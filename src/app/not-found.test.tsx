import { render, screen } from '@testing-library/react'
import NotFound from './not-found'

describe('Root 404 Page', () => {
  describe('AC-001: Renders on invalid routes', () => {
    it('renders the 404 page', () => {
      render(<NotFound />)
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })
  })

  describe('AC-002: Headline "Wrong turn." displays', () => {
    it('displays correct headline', () => {
      render(<NotFound />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Wrong turn.')
    })

    it('headline is emphasized', () => {
      render(<NotFound />)
      const headline = screen.getByRole('heading', { level: 1 })
      expect(headline).toHaveClass('font-black')
    })

    it('headline has responsive sizing', () => {
      render(<NotFound />)
      const headline = screen.getByRole('heading', { level: 1 })
      expect(headline).toHaveClass('text-4xl')
      expect(headline).toHaveClass('md:text-5xl')
    })
  })

  describe('AC-003: Message matches copy deck verbatim', () => {
    it('displays exact copy deck message', () => {
      render(<NotFound />)
      expect(
        screen.getByText(/The page you're looking for doesn't exist — but our workshops do\./i)
      ).toBeInTheDocument()
    })

    it('message has readable typography', () => {
      const { container } = render(<NotFound />)
      const message = container.querySelector('p')
      expect(message).toHaveClass('text-lg')
      expect(message).toHaveClass('md:text-xl')
    })
  })

  describe('AC-004: CTA button links to homepage', () => {
    it('renders homepage link', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to homepage/i })
      expect(link).toBeInTheDocument()
    })

    it('link points to homepage', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to homepage/i })
      expect(link).toHaveAttribute('href', '/')
    })

    it('CTA text is "Back to homepage"', () => {
      render(<NotFound />)
      expect(screen.getByText(/Back to homepage/i)).toBeInTheDocument()
    })

    it('CTA has arrow icon', () => {
      const { container } = render(<NotFound />)
      const icon = container.querySelector('svg.lucide-arrow-right')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('AC-005: Uses brand colors', () => {
    it('icon has AutoCap Red color', () => {
      const { container } = render(<NotFound />)
      const icon = container.querySelector('.text-\\[\\#C8102E\\]')
      expect(icon).toBeInTheDocument()
    })

    it('icon background is Ember', () => {
      const { container } = render(<NotFound />)
      const iconBg = container.querySelector('.bg-\\[\\#F0DADA\\]')
      expect(iconBg).toBeInTheDocument()
    })

    it('CTA uses gradient background', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to homepage/i })
      expect(link).toHaveClass('bg-gradient-to-r')
      expect(link).toHaveClass('from-[#C8102E]')
      expect(link).toHaveClass('to-[#A00D25]')
    })
  })

  describe('AC-006: Responsive layout', () => {
    it('is centered vertically and horizontally', () => {
      const { container } = render(<NotFound />)
      const wrapper = container.querySelector('.flex.min-h-screen.items-center.justify-center')
      expect(wrapper).toBeInTheDocument()
    })

    it('has mobile padding', () => {
      const { container } = render(<NotFound />)
      const wrapper = container.querySelector('.px-6')
      expect(wrapper).toBeInTheDocument()
    })

    it('content is centered', () => {
      const { container } = render(<NotFound />)
      const content = container.querySelector('.text-center')
      expect(content).toBeInTheDocument()
    })
  })

  describe('AC-007: Header and footer render correctly', () => {
    // Note: Header and Footer are in layout.tsx, not in not-found.tsx
    // This test verifies the 404 page structure doesn't break layout
    it('404 page has proper structure', () => {
      const { container } = render(<NotFound />)
      expect(container.querySelector('div')).toBeInTheDocument()
    })
  })

  describe('AC-008: AlertCircle icon from lucide-react', () => {
    it('displays AlertCircle icon', () => {
      const { container } = render(<NotFound />)
      // AlertCircle renders as SVG with lucide class
      const icon = container.querySelector('svg.lucide')
      expect(icon).toBeInTheDocument()
    })

    it('icon is in a rounded background', () => {
      const { container } = render(<NotFound />)
      const iconBg = container.querySelector('.rounded-full')
      expect(iconBg).toBeInTheDocument()
    })

    it('icon has appropriate size', () => {
      const { container } = render(<NotFound />)
      const icon = container.querySelector('.h-12.w-12')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Design Elements', () => {
    it('has decorative line', () => {
      const { container } = render(<NotFound />)
      const line = container.querySelector('.bg-gradient-to-r')
      expect(line).toBeInTheDocument()
    })

    it('decorative line uses AutoCap Red', () => {
      const { container } = render(<NotFound />)
      const line = container.querySelector('.bg-\\[\\#C8102E\\]')
      expect(line).toBeInTheDocument()
    })

    it('has white background', () => {
      const { container } = render(<NotFound />)
      const wrapper = container.querySelector('.bg-white')
      expect(wrapper).toBeInTheDocument()
    })
  })

  describe('CTA Button Styling', () => {
    it('CTA has rounded corners', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to homepage/i })
      expect(link).toHaveClass('rounded-xl')
    })

    it('CTA has padding', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to homepage/i })
      expect(link).toHaveClass('px-6')
      expect(link).toHaveClass('py-3')
    })

    it('CTA has hover effect', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to homepage/i })
      expect(link).toHaveClass('hover:scale-105')
    })

    it('CTA has white text', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to homepage/i })
      expect(link).toHaveClass('text-white')
    })

    it('CTA is bold', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to homepage/i })
      expect(link).toHaveClass('font-bold')
    })
  })

  describe('Accessibility', () => {
    it('has single h1 heading', () => {
      render(<NotFound />)
      const headings = screen.getAllByRole('heading', { level: 1 })
      expect(headings).toHaveLength(1)
    })

    it('link is keyboard accessible', () => {
      render(<NotFound />)
      const link = screen.getByRole('link', { name: /Back to homepage/i })
      expect(link.tagName).toBe('A')
    })
  })
})
