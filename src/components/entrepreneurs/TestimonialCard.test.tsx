import { render, screen } from '@testing-library/react';
import type { Testimonial } from '@/types/testimonial';
import { TestimonialCard } from './TestimonialCard';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} className={className} />;
  },
}));

const mockTestimonial: Testimonial = {
  id: 1,
  workshopName: 'Test Workshop',
  city: 'Stockholm',
  ownerName: 'Test Owner',
  quote: 'This is a test quote for validation.',
  keyFact: 'Test Workshop · Test acquisition · January 2026',
  ownerPhotoUrl: '/images/test-owner.jpg',
  acquisitionDate: 'January 2026',
  order: 1,
};

const mockTestimonialWithoutPhotos: Testimonial = {
  ...mockTestimonial,
  ownerPhotoUrl: undefined,
};

describe('TestimonialCard', () => {
  describe('AC-004: Testimonial Card Structure', () => {
    it('renders card with all structural elements', () => {
      const { container } = render(<TestimonialCard testimonial={mockTestimonial} />);

      const card = container.firstChild as HTMLElement;
      expect(card).toBeInTheDocument();
      expect(card.className).toContain('bg-white');
      expect(card.className).toContain('rounded');
      expect(card.className).toContain('shadow');

      const blockquote = container.querySelector('blockquote');
      expect(blockquote).toBeInTheDocument();
      expect(blockquote?.textContent).toContain('This is a test quote for validation.');

      expect(screen.getByText('Test Owner, Test Workshop')).toBeInTheDocument();
      expect(
        screen.getByText('Test Workshop · Test acquisition · January 2026')
      ).toBeInTheDocument();
    });
  });

  describe('AC-008 & AC-009: Photo Handling - Owner Portrait Only', () => {
    it('renders circular owner portrait when photo URL provided', () => {
      const { container } = render(<TestimonialCard testimonial={mockTestimonial} />);

      const ownerImg = container.querySelector('img[src="/images/test-owner.jpg"]');
      expect(ownerImg).toBeInTheDocument();
      expect(ownerImg).toHaveAttribute('alt', 'Test Owner from Test Workshop');
      expect(ownerImg?.className).toContain('rounded-full');
    });
  });

  describe('AC-010: Photo Placeholders', () => {
    it('shows branded placeholder for missing owner photo', () => {
      render(<TestimonialCard testimonial={mockTestimonialWithoutPhotos} />);

      expect(screen.getByText('TO')).toBeInTheDocument();

      const placeholder = screen.getByLabelText(/Profile placeholder/);
      expect(placeholder.className).toContain('bg-[#C8102E]');
    });
  });

  describe('AC-011: Quote Styling', () => {
    it('applies correct quote text styling', () => {
      render(<TestimonialCard testimonial={mockTestimonial} />);

      const quoteElement = screen.getByText((content, element) => {
        return element?.tagName === 'BLOCKQUOTE' && content.includes('This is a test quote');
      });
      expect(quoteElement.className).toContain('text-lg');
      expect(quoteElement.className).toContain('leading-relaxed');
      expect(quoteElement.className).toContain('text-gray-700');
      expect(quoteElement.className).toMatch(/text-left|text-start/);
      expect(quoteElement.textContent).toContain('This is a test quote for validation.');
      expect(quoteElement.textContent?.trim()).toMatch(/^["“].*["”]$/);
    });
  });

  describe('AC-012: Attribution Styling', () => {
    it('applies correct attribution styling', () => {
      render(<TestimonialCard testimonial={mockTestimonial} />);

      const attribution = screen.getByText(/Test Owner/);
      expect(attribution.className).toMatch(/font-semibold|font-bold/);
      expect(attribution.className).toContain('text-[#1C1C1E]');
    });
  });

  describe('AC-013: Key Fact Styling', () => {
    it('applies correct key fact styling with bullet separators', () => {
      render(<TestimonialCard testimonial={mockTestimonial} />);

      const keyFact = screen.getByText(/Test Workshop · Test acquisition · January 2026/);
      expect(keyFact.className).toContain('text-sm');
      expect(keyFact.className).toContain('text-[#C8102E]');
      expect(keyFact.className).toMatch(/font-semibold|font-bold/);
      expect(keyFact.textContent).toContain('·');
    });
  });

  describe('AC-018: Accessibility - Screen Readers', () => {
    it('provides accessible markup and labels', () => {
      const { container } = render(<TestimonialCard testimonial={mockTestimonial} />);

      const semantic = container.querySelector('article, blockquote');
      expect(semantic).toBeInTheDocument();

      const images = container.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });
  });
});
