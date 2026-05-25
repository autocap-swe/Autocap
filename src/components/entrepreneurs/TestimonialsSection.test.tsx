import { render } from '@testing-library/react';
import { TestimonialsSection } from './TestimonialsSection';
import type { Testimonial } from '@/types/testimonial';

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    workshopName: 'Däckpoint i Mölndal',
    city: 'Mölndal',
    ownerName: 'Martin',
    quote: 'Test quote one.',
    keyFact: 'Däckpoint i Mölndal · October 2025',
    acquisitionDate: 'October 2025',
    order: 1,
  },
  {
    id: 2,
    workshopName: "Verksta'n i Öxnered",
    city: 'Öxnered',
    ownerName: 'Workshop Owner',
    quote: 'Test quote two.',
    keyFact: "Verksta'n i Öxnered · December 2025",
    acquisitionDate: 'December 2025',
    order: 2,
  },
  {
    id: 3,
    workshopName: 'Svenska Däckgruppen',
    city: 'Stockholm',
    ownerName: 'Workshop Owner',
    quote: 'Test quote three.',
    keyFact: '7 workshops across Stockholm · January 2026',
    acquisitionDate: 'January 2026',
    order: 3,
  },
];

jest.mock('@/lib/cms/testimonial', () => ({
  getTestimonialsContent: () => Promise.resolve(mockTestimonials),
}));

describe('TestimonialsSection', () => {
  describe('AC-003: Testimonial Grid Layout', () => {
    it('renders testimonials in responsive grid layout', async () => {
      const { container } = render(await TestimonialsSection());

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid?.className).toMatch(/gap-/);

      const articles = container.querySelectorAll('article');
      expect(articles).toHaveLength(mockTestimonials.length);
    });
  });

  describe('AC-014: Responsive Design - Mobile', () => {
    it('renders single column layout on mobile', async () => {
      const { container } = render(await TestimonialsSection());

      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('grid');
      expect(grid?.className).toContain('md:grid-cols-2');
      expect(grid?.className).toContain('lg:grid-cols-3');
    });
  });

  describe('AC-015: Responsive Design - Tablet', () => {
    it('renders two column layout on tablet', async () => {
      const { container } = render(await TestimonialsSection());

      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('md:grid-cols-2');
    });
  });

  describe('AC-016: Responsive Design - Desktop', () => {
    it('renders three column layout on desktop', async () => {
      const { container } = render(await TestimonialsSection());

      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('lg:grid-cols-3');

      const containerElement = container.querySelector('[class*="max-w-"]');
      expect(containerElement).toBeInTheDocument();
    });
  });
});
