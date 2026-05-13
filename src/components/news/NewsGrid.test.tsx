import { render, screen } from '@testing-library/react';
import { NewsGrid } from './NewsGrid';
import type { NewsArticle } from '@/lib/cms/article/types';

const mockArticles: NewsArticle[] = [
  {
    id: 1,
    title: 'First Article',
    excerpt: 'First article excerpt',
    publishDate: '2026-01-15',
    author: 'Author One',
    category: 'Company News',
    slug: 'first-article',
    readTimeMinutes: 3,
    order: 1,
  },
  {
    id: 2,
    title: 'Second Article',
    excerpt: 'Second article excerpt',
    publishDate: '2025-12-20',
    author: 'Author Two',
    category: 'Press Release',
    slug: 'second-article',
    readTimeMinutes: 4,
    order: 2,
  },
  {
    id: 3,
    title: 'Third Article',
    excerpt: 'Third article excerpt',
    publishDate: '2025-11-10',
    author: 'Author Three',
    category: 'Industry Insights',
    slug: 'third-article',
    readTimeMinutes: 5,
    order: 3,
  },
];

describe('NewsGrid', () => {
  describe('AC-006: Responsive Grid Layout', () => {
    it('renders all articles in a grid', () => {
      render(<NewsGrid articles={mockArticles} />);

      expect(screen.getByText('First Article')).toBeInTheDocument();
      expect(screen.getByText('Second Article')).toBeInTheDocument();
      expect(screen.getByText('Third Article')).toBeInTheDocument();
    });

    it('applies responsive grid classes', () => {
      const { container } = render(<NewsGrid articles={mockArticles} />);

      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toHaveClass('grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('md:grid-cols-2');
      expect(grid).toHaveClass('lg:grid-cols-3');
      expect(grid).toHaveClass('gap-8');
    });

    it('applies max-width container', () => {
      const { container } = render(<NewsGrid articles={mockArticles} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('max-w-7xl');
      expect(wrapper).toHaveClass('mx-auto');
    });
  });

  describe('AC-011: Empty State', () => {
    it('renders empty state message when no articles', () => {
      render(<NewsGrid articles={[]} />);

      expect(screen.getByText(/No news articles available at the moment/i)).toBeInTheDocument();
      expect(screen.getByText(/Check back soon for updates/i)).toBeInTheDocument();
    });

    it('does not render grid when articles array is empty', () => {
      const { container } = render(<NewsGrid articles={[]} />);

      const grid = container.querySelector('[class*="grid-cols"]');
      expect(grid).not.toBeInTheDocument();
    });
  });

  describe('AC-012: Article Ordering', () => {
    it('renders articles sorted by publishDate descending (newest first)', () => {
      render(<NewsGrid articles={mockArticles} />);

      const articles = screen.getAllByRole('article');

      // First article should be the newest (2026-01-15)
      expect(articles[0]).toHaveTextContent('First Article');

      // Second article should be 2025-12-20
      expect(articles[1]).toHaveTextContent('Second Article');

      // Third article should be oldest (2025-11-10)
      expect(articles[2]).toHaveTextContent('Third Article');
    });

    it('handles articles with same date', () => {
      const articlesWithSameDate: NewsArticle[] = [
        { ...mockArticles[0], publishDate: '2026-01-15' },
        { ...mockArticles[1], publishDate: '2026-01-15' },
      ];

      render(<NewsGrid articles={articlesWithSameDate} />);

      // Should render both articles
      expect(screen.getByText('First Article')).toBeInTheDocument();
      expect(screen.getByText('Second Article')).toBeInTheDocument();
    });
  });
});
