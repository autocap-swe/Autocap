import { render, screen } from '@testing-library/react';
import { NewsCard } from './NewsCard';
import type { NewsArticle } from '@/lib/cms/article/types';

const mockArticle: NewsArticle = {
  id: 1,
  title: 'AutoCap Group Acquires Svenska Däckgruppen',
  excerpt:
    'We are excited to announce the acquisition of Svenska Däckgruppen, expanding our presence in the Västra Götaland region.',
  publishDate: '2026-01-15',
  author: 'AutoCap Group',
  category: 'Press Release',
  imageUrl: '/images/news/acquisition.jpg',
  slug: 'autocap-acquires-svenska-dackgruppen',
  readTimeMinutes: 3,
  order: 1,
};

const mockArticleWithoutImage: NewsArticle = {
  ...mockArticle,
  id: 2,
  imageUrl: undefined,
};

describe('NewsCard', () => {
  describe('AC-002: Article Card Structure', () => {
    it('renders article image when imageUrl is provided', () => {
      render(<NewsCard article={mockArticle} />);

      const image = screen.getByRole('img', { name: mockArticle.title });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', expect.stringContaining('acquisition.jpg'));
    });

    it('renders category badge with correct category', () => {
      render(<NewsCard article={mockArticle} />);

      const badge = screen.getByText('Press Release');
      expect(badge).toBeInTheDocument();
    });

    it('renders article title', () => {
      render(<NewsCard article={mockArticle} />);

      const title = screen.getByRole('heading', { name: mockArticle.title });
      expect(title).toBeInTheDocument();
    });

    it('renders article excerpt with line clamping', () => {
      render(<NewsCard article={mockArticle} />);

      const excerpt = screen.getByText(mockArticle.excerpt);
      expect(excerpt).toBeInTheDocument();
      expect(excerpt).toHaveClass('line-clamp-3');
    });

    it('renders footer with author, date, and read time', () => {
      render(<NewsCard article={mockArticle} />);

      // Check for author, date, and read time in footer
      expect(screen.getByText(/3 min read/)).toBeInTheDocument();
      expect(screen.getByText(/January 15, 2026/)).toBeInTheDocument();

      // Verify footer contains author by checking the footer div
      const footer = screen.getByText(/3 min read/).closest('div');
      expect(footer).toHaveTextContent('AutoCap Group');
    });
  });

  describe('AC-004: Image Handling', () => {
    it('renders placeholder when imageUrl is missing', () => {
      render(<NewsCard article={mockArticleWithoutImage} />);

      // PhotoPlaceholder should render with Newspaper icon
      const placeholder = screen.getByTestId('photo-placeholder');
      expect(placeholder).toBeInTheDocument();
    });

    it('uses article title as image alt text', () => {
      render(<NewsCard article={mockArticle} />);

      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', mockArticle.title);
    });
  });

  describe('AC-005: Date Formatting', () => {
    it('formats publishDate in human-readable format', () => {
      render(<NewsCard article={mockArticle} />);

      // Date should be formatted like "January 15, 2026" or similar
      const dateElement = screen.getByText(/2026/);
      expect(dateElement).toBeInTheDocument();
    });
  });

  describe('AC-007: Hover Effects', () => {
    it('applies hover transition classes', () => {
      const { container } = render(<NewsCard article={mockArticle} />);

      const card = container.querySelector('article');
      expect(card).toHaveClass('transition-all');
      expect(card).toHaveClass('duration-300');
      expect(card).toHaveClass('hover:-translate-y-1');
    });
  });

  describe('AC-009: Accessibility', () => {
    it('uses semantic article element', () => {
      const { container } = render(<NewsCard article={mockArticle} />);

      const article = container.querySelector('article');
      expect(article).toBeInTheDocument();
    });

    it('uses proper heading hierarchy', () => {
      render(<NewsCard article={mockArticle} />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('AC-015: NewsCard Clickable', () => {
    it('wraps entire card with Link component', () => {
      const { container } = render(<NewsCard article={mockArticle} />);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
    });

    it('navigates to article detail page with correct slug', () => {
      const { container } = render(<NewsCard article={mockArticle} />);

      const link = container.querySelector('a');
      expect(link).toHaveAttribute('href', '/news/autocap-acquires-svenska-dackgruppen');
    });

    it('applies cursor-pointer styling', () => {
      const { container } = render(<NewsCard article={mockArticle} />);

      const link = container.querySelector('a');
      expect(link).toHaveClass('cursor-pointer');
    });

    it('is keyboard accessible', () => {
      const { container } = render(<NewsCard article={mockArticle} />);

      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link?.tagName.toLowerCase()).toBe('a');
    });

    it('has no nested links', () => {
      const { container } = render(<NewsCard article={mockArticle} />);

      const links = container.querySelectorAll('a');
      expect(links.length).toBe(1);
    });
  });
});
