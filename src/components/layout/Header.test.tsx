import { render, screen } from '@testing-library/react'
import { Header } from './Header'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('Header - LanguageSelector Integration', () => {
  describe('AC-001: Language selector is visible in desktop header', () => {
    it('renders LanguageSelector in header', () => {
      render(<Header />)

      const languageSelector = screen.getByRole('group', { name: /language selector/i })
      expect(languageSelector).toBeInTheDocument()
    })

    it('LanguageSelector is positioned in header navigation', () => {
      render(<Header />)

      const nav = screen.getByRole('navigation')
      const languageSelector = screen.getByRole('group', { name: /language selector/i })

      // Language selector should be within the navigation
      expect(nav).toContainElement(languageSelector)
    })
  })

  describe('AC-003: Mobile responsive language selector', () => {
    it('LanguageSelector is present in component tree', () => {
      render(<Header />)

      // Language selector should be in the DOM (even if hidden at some breakpoints)
      const languageSelector = screen.getByRole('group', { name: /language selector/i })
      expect(languageSelector).toBeInTheDocument()
    })
  })

  describe('Header still renders correctly with LanguageSelector', () => {
    it('renders logo', () => {
      render(<Header />)

      const logo = screen.getByAltText(/autocap/i)
      expect(logo).toBeInTheDocument()
    })

    it('renders navigation links', () => {
      render(<Header />)

      // The logotype is the link home.
      const homeLink = screen.getByRole('link', { name: /autocap group/i })
      expect(homeLink).toBeInTheDocument()
    })

    it('renders mobile menu button', () => {
      render(<Header />)

      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toBeInTheDocument()
    })
  })
})
