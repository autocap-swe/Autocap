import { render, screen } from '@testing-library/react';
import { LatestNewsStrip } from './LatestNewsStrip';
import type { NewsArticle } from '@/lib/cms/article/types';

jest.mock('@/components/news/NewsCard', () => ({
  NewsCard: ({ article }: { article: NewsArticle }) => (
    <div data-testid="news-card">
      <h3>{article.title}</h3>
      <p>{article.publishDate}</p>
    </div>
  ),
}));

const mockArticles: NewsArticle[] = [
  {
    id: 1,
    title: 'Most Recent Article',
    publishDate: '2026-03-01',
    excerpt: 'Recent excerpt',
    slug: 'most-recent',
    author: 'Author',
    category: 'Company News',
    readTimeMinutes: 3,
    order: 1,
  },
  {
    id: 2,
    title: 'Second Recent Article',
    publishDate: '2026-02-15',
    excerpt: 'Second excerpt',
    slug: 'second-recent',
    author: 'Author',
    category: 'Company News',
    readTimeMinutes: 3,
    order: 2,
  },
  {
    id: 3,
    title: 'Third Recent Article',
    publishDate: '2026-02-01',
    excerpt: 'Third excerpt',
    slug: 'third-recent',
    author: 'Author',
    category: 'Company News',
    readTimeMinutes: 3,
    order: 3,
  },
  {
    id: 4,
    title: 'Older Article',
    publishDate: '2026-01-15',
    excerpt: 'Older excerpt',
    slug: 'older',
    author: 'Author',
    category: 'Company News',
    readTimeMinutes: 3,
    order: 4,
  },
  {
    id: 5,
    title: 'Oldest Article',
    publishDate: '2026-01-01',
    excerpt: 'Oldest excerpt',
    slug: 'oldest',
    author: 'Author',
    category: 'Company News',
    readTimeMinutes: 3,
    order: 5,
  },
];

describe('LatestNewsStrip', () => {
  describe('AC-001: Displays exactly 3 most recent articles sorted by date', () => {
    it('renders exactly 3 articles', () => {
      render(<LatestNewsStrip articles={mockArticles} />);
      const newsCards = screen.getAllByTestId('news-card');
      expect(newsCards).toHaveLength(3);
    });

    it('displays articles sorted by publishDate descending', () => {
      render(<LatestNewsStrip articles={mockArticles} />);
      const newsCards = screen.getAllByTestId('news-card');
      expect(newsCards[0]).toHaveTextContent('Most Recent Article');
      expect(newsCards[1]).toHaveTextContent('Second Recent Article');
      expect(newsCards[2]).toHaveTextContent('Third Recent Article');
    });

    it('does not display older articles', () => {
      render(<LatestNewsStrip articles={mockArticles} />);
      expect(screen.queryByText('Older Article')).not.toBeInTheDocument();
      expect(screen.queryByText('Oldest Article')).not.toBeInTheDocument();
    });
  });

  describe('AC-003: Renders "Latest News" section heading', () => {
    it('displays "Latest News" heading', () => {
      render(<LatestNewsStrip articles={mockArticles} />);
      expect(screen.getByRole('heading', { name: /Latest News/i })).toBeInTheDocument();
    });

    it('heading is h2 level', () => {
      render(<LatestNewsStrip articles={mockArticles} />);
      const heading = screen.getByRole('heading', { name: /Latest News/i });
      expect(heading.tagName).toBe('H2');
    });

    it('heading has proper styling', () => {
      render(<LatestNewsStrip articles={mockArticles} />);
      const heading = screen.getByRole('heading', { name: /Latest News/i });
      expect(heading).toHaveClass('font-black');
    });
  });

  describe('AC-004: Responsive grid layout (1/3 columns)', () => {
    it('has grid layout', () => {
      const { container } = render(<LatestNewsStrip articles={mockArticles} />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('has 1 column on mobile, 3 columns on desktop', () => {
      const { container } = render(<LatestNewsStrip articles={mockArticles} />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });

    it('has appropriate gap spacing', () => {
      const { container } = render(<LatestNewsStrip articles={mockArticles} />);
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('gap-6');
    });
  });

  describe('AC-005: Reuses tested NewsCard component', () => {
    it('passes article data to NewsCard', () => {
      render(<LatestNewsStrip articles={mockArticles} />);
      expect(screen.getByText('Most Recent Article')).toBeInTheDocument();
      expect(screen.getByText('Second Recent Article')).toBeInTheDocument();
      expect(screen.getByText('Third Recent Article')).toBeInTheDocument();
    });
  });

  describe('AC-006: Integrates seamlessly into homepage flow', () => {
    it('has full-width section', () => {
      const { container } = render(<LatestNewsStrip articles={mockArticles} />);
      const section = container.firstChild;
      expect(section).toHaveClass('w-full');
    });

    it('has appropriate vertical padding', () => {
      const { container } = render(<LatestNewsStrip articles={mockArticles} />);
      const section = container.firstChild;
      expect(section).toHaveClass('py-20');
    });

    it('has max-width container for content', () => {
      const { container } = render(<LatestNewsStrip articles={mockArticles} />);
      const contentContainer = container.querySelector('.max-w-7xl');
      expect(contentContainer).toBeInTheDocument();
    });

    it('has horizontal padding for mobile', () => {
      const { container } = render(<LatestNewsStrip articles={mockArticles} />);
      const contentContainer = container.querySelector('.max-w-7xl');
      expect(contentContainer).toHaveClass('px-6');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty articles array gracefully', () => {
      const { container } = render(<LatestNewsStrip articles={[]} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has semantic section element', () => {
      const { container } = render(<LatestNewsStrip articles={mockArticles} />);
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      render(<LatestNewsStrip articles={mockArticles} />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toBeInTheDocument();
    });
  });
});
