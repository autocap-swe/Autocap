import { render, screen } from '@testing-library/react'
import { ContentImage } from './ContentImage'

describe('ContentImage', () => {
  it('renders image with alt text', () => {
    render(<ContentImage src="/test-image.jpg" alt="Test image" />)

    const image = screen.getByRole('img', { name: 'Test image' })
    expect(image).toBeInTheDocument()
  })

  it('uses Next.js Image component', () => {
    render(<ContentImage src="/test.jpg" alt="Test" />)

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('alt', 'Test')
  })

  it('renders caption when provided', () => {
    render(
      <ContentImage
        src="/test.jpg"
        alt="Test"
        caption="This is a test caption"
      />
    )

    expect(screen.getByText('This is a test caption')).toBeInTheDocument()
  })

  it('uses figure element for semantic HTML', () => {
    const { container } = render(<ContentImage src="/test.jpg" alt="Test" />)

    const figure = container.querySelector('figure')
    expect(figure).toBeInTheDocument()
  })

  it('applies vertical margin', () => {
    const { container } = render(<ContentImage src="/test.jpg" alt="Test" />)

    const figure = container.querySelector('figure')
    expect(figure).toHaveClass('my-12')
  })

  it('applies aspect-video ratio', () => {
    const { container } = render(<ContentImage src="/test.jpg" alt="Test" />)

    const imageContainer = container.querySelector('.aspect-video')
    expect(imageContainer).toBeInTheDocument()
  })

  it('applies rounded corners', () => {
    const { container } = render(<ContentImage src="/test.jpg" alt="Test" />)

    const imageContainer = container.querySelector('.rounded-lg')
    expect(imageContainer).toBeInTheDocument()
  })

  it('does not render figcaption when there is no caption', () => {
    const { container } = render(<ContentImage src="/test.jpg" alt="Test" />)

    const figcaption = container.querySelector('figcaption')
    expect(figcaption).not.toBeInTheDocument()
  })
})
