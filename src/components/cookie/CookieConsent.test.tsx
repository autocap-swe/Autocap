import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CookieConsent } from './CookieConsent'
import { CookieConsentProvider } from './CookieConsentProvider'

// The banner reads its state from the provider that wraps the whole site.
const renderBanner = () =>
  render(
    <CookieConsentProvider>
      <CookieConsent />
    </CookieConsentProvider>
  )
import { saveConsentData, getAcceptedAllPreferences } from '@/lib/cookieConsent'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('CookieConsent Component', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('AC-001: Banner appears on first visit', () => {
    it('shows banner when no consent exists', async () => {
      renderBanner()
      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /cookie consent banner/i })).toBeInTheDocument()
      })
    })

    it('displays cookie message', async () => {
      renderBanner()
      await waitFor(() => {
        expect(screen.getByText(/We use cookies/i)).toBeInTheDocument()
      })
    })

    it('shows Cookie icon', async () => {
      const { container } = renderBanner()
      await waitFor(() => {
        const icon = container.querySelector('svg.lucide-cookie')
        expect(icon).toBeInTheDocument()
      })
    })
  })

  describe('AC-002: "Accept all" saves consent and hides banner', () => {
    it('hides banner after clicking Accept all', async () => {
      renderBanner()

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /cookie consent banner/i })).toBeInTheDocument()
      })

      const acceptButton = screen.getByRole('button', { name: /accept all/i })
      fireEvent.click(acceptButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /cookie consent banner/i })).not.toBeInTheDocument()
      })
    })

    it('saves consent to localStorage', async () => {
      renderBanner()

      await waitFor(() => {
        const acceptButton = screen.getByRole('button', { name: /accept all/i })
        fireEvent.click(acceptButton)
      })

      await waitFor(() => {
        const stored = localStorage.getItem('autocap_cookie_consent')
        expect(stored).not.toBeNull()
      })
    })

    it('accepts all cookie categories', async () => {
      renderBanner()

      await waitFor(() => {
        const acceptButton = screen.getByRole('button', { name: /accept all/i })
        fireEvent.click(acceptButton)
      })

      await waitFor(() => {
        const stored = localStorage.getItem('autocap_cookie_consent')
        const data = JSON.parse(stored!)
        expect(data.preferences.necessary).toBe(true)
        expect(data.preferences.analytics).toBe(true)
        expect(data.preferences.marketing).toBe(true)
      })
    })
  })

  describe('AC-003: "Manage preferences" opens modal', () => {
    it('opens preferences modal', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /cookie preferences/i })).toBeInTheDocument()
      })
    })

    it('modal has category toggles', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        expect(screen.getAllByText(/Necessary Cookies/i).length).toBeGreaterThan(0)
        expect(screen.getByText(/Analytics Cookies/i)).toBeInTheDocument()
        expect(screen.getByText(/Marketing Cookies/i)).toBeInTheDocument()
      })
    })

    it('shows close button in modal', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close preferences/i })).toBeInTheDocument()
      })
    })
  })

  describe('AC-004: Privacy Policy link', () => {
    it('displays Privacy Policy link', async () => {
      renderBanner()

      await waitFor(() => {
        const link = screen.getByRole('link', { name: /privacy policy/i })
        expect(link).toBeInTheDocument()
      })
    })

    it('Privacy Policy link points to correct page', async () => {
      renderBanner()

      await waitFor(() => {
        const link = screen.getByRole('link', { name: /privacy policy/i })
        expect(link).toHaveAttribute('href', '/privacy-policy')
      })
    })
  })

  describe('AC-005: Respects existing consent', () => {
    it('does not show banner if valid consent exists', async () => {
      saveConsentData('accepted', getAcceptedAllPreferences())
      renderBanner()

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /cookie consent banner/i })).not.toBeInTheDocument()
      })
    })

    it('respects rejected consent', async () => {
      saveConsentData('rejected', { necessary: true, analytics: false, marketing: false })
      renderBanner()

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /cookie consent banner/i })).not.toBeInTheDocument()
      })
    })

    it('respects custom consent', async () => {
      saveConsentData('custom', { necessary: true, analytics: true, marketing: false })
      renderBanner()

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /cookie consent banner/i })).not.toBeInTheDocument()
      })
    })
  })

  describe('AC-006: Consent expires after 365 days', () => {
    it('shows banner if consent has expired', async () => {
      const expiredData = {
        state: 'accepted' as const,
        preferences: getAcceptedAllPreferences(),
        timestamp: Date.now() - 400 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() - 1,
      }
      localStorage.setItem('autocap_cookie_consent', JSON.stringify(expiredData))

      renderBanner()

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /cookie consent banner/i })).toBeInTheDocument()
      })
    })
  })

  describe('AC-007: Keyboard navigable', () => {
    it('Accept all button is keyboard accessible', async () => {
      renderBanner()

      await waitFor(() => {
        const acceptButton = screen.getByRole('button', { name: /accept all/i })
        expect(acceptButton.tagName).toBe('BUTTON')
      })
    })

    it('Manage preferences button is keyboard accessible', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        expect(manageButton.tagName).toBe('BUTTON')
      })
    })

    it('modal close button is keyboard accessible', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close preferences/i })
        expect(closeButton.tagName).toBe('BUTTON')
      })
    })
  })

  describe('AC-008: No z-index conflict with BackToTop', () => {
    it('banner has z-40', async () => {
      const { container } = renderBanner()

      await waitFor(() => {
        const banner = container.querySelector('.z-40')
        expect(banner).toBeInTheDocument()
      })
    })

    it('modal has higher z-index than banner', async () => {
      const { container } = renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        const modal = container.querySelector('.z-50')
        expect(modal).toBeInTheDocument()
      })
    })
  })

  describe('AC-009: Does not block critical CTAs', () => {
    it('banner is positioned at bottom', async () => {
      const { container } = renderBanner()

      await waitFor(() => {
        const banner = container.querySelector('.fixed.bottom-0')
        expect(banner).toBeInTheDocument()
      })
    })

    it('banner does not cover viewport', async () => {
      const { container } = renderBanner()

      await waitFor(() => {
        const banner = container.querySelector('.fixed')
        expect(banner).not.toHaveClass('inset-0')
      })
    })
  })

  describe('AC-010: GDPR compliant', () => {
    it('necessary cookies are always enabled in modal', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/Always Active/i)).toBeInTheDocument()
      })
    })

    it('analytics cookies can be toggled', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox')
        const analyticsCheckbox = checkboxes[0] // First checkbox (analytics)
        expect(analyticsCheckbox).toBeInTheDocument()
      })
    })

    it('marketing cookies can be toggled', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox')
        expect(checkboxes.length).toBe(2) // Analytics and Marketing
      })
    })
  })

  describe('Banner Styling', () => {
    it('has Nordic Black background', async () => {
      const { container } = renderBanner()

      await waitFor(() => {
        const banner = container.querySelector('.bg-\\[\\#1C1C1E\\]')
        expect(banner).toBeInTheDocument()
      })
    })

    it('Accept button has AutoCap Red background', async () => {
      renderBanner()

      await waitFor(() => {
        const acceptButton = screen.getByRole('button', { name: /accept all/i })
        expect(acceptButton).toHaveClass('bg-[#C8102E]')
      })
    })
  })

  describe('Modal Functionality', () => {
    it('closes modal on close button click', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close preferences/i })
        fireEvent.click(closeButton)
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /cookie preferences/i })).not.toBeInTheDocument()
      })
    })

    it('closes modal on cancel button click', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /cancel/i })
        fireEvent.click(cancelButton)
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /cookie preferences/i })).not.toBeInTheDocument()
      })
    })

    it('closes modal and banner on Accept all while the modal is open', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        // The preferences modal has no button of its own for this; the banner's stays reachable.
        const acceptButton = screen.getAllByRole('button', { name: /accept all/i }).at(-1) as HTMLElement
        fireEvent.click(acceptButton)
      })

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /cookie preferences/i })).not.toBeInTheDocument()
        expect(screen.queryByRole('dialog', { name: /cookie consent banner/i })).not.toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('banner has role="dialog"', async () => {
      renderBanner()

      await waitFor(() => {
        const banner = screen.getByRole('dialog', { name: /cookie consent banner/i })
        expect(banner).toBeInTheDocument()
      })
    })

    it('modal has role="dialog" and aria-modal', async () => {
      renderBanner()

      await waitFor(() => {
        const manageButton = screen.getByRole('button', { name: /manage preferences/i })
        fireEvent.click(manageButton)
      })

      await waitFor(() => {
        const modal = screen.getByRole('dialog', { name: /cookie preferences/i })
        expect(modal).toHaveAttribute('aria-modal', 'true')
      })
    })
  })
})
