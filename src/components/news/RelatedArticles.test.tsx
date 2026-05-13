import { render, screen } from '@testing-library/react';
import { RelatedArticles } from './RelatedArticles';
import type { NewsArticle } from '@/lib/cms/article/types';

jest.mock('./NewsCard', () => ({
  NewsCard: ({ article }: { article: { id: number; title: string } }) => (
    <div data-testid={`news-card-${article.id}`}>{article.title}</div>
  ),
}));

const mockArticles: NewsArticle[] = [
  {
    id: 2,
    title: 'Article 2',
    excerpt: 'Excerpt 2',
    publishDate: '2026-01-10',
    author: 'Author 2',
    category: 'Company News',
    slug: 'article-2',
    readTimeMinutes: 5,
    order: 2,
  },
  {
    id: 3,
    title: 'Article 3',
    excerpt: 'Excerpt 3',
    publishDate: '2026-01-05',
    author: 'Author 3',
    category: 'Press Release',
    slug: 'article-3',
    readTimeMinutes: 4,
    order: 3,
  },
];

describe('RelatedArticles', () => {
  it('displays section header', () => {
    render(<RelatedArticles articles={mockArticles} />);
    expect(screen.getByText('Related Reading')).toBeInTheDocument();
  });

  it('renders related articles using NewsCard', () => {
    render(<RelatedArticles articles={mockArticles} />);
    expect(screen.getByTestId('news-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('news-card-3')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
    expect(screen.getByText('Article 3')).toBeInTheDocument();
  });

  it('does not render when no related articles', () => {
    const { container } = render(<RelatedArticles articles={[]} />);
    const section = container.querySelector('section');
    expect(section).not.toBeInTheDocument();
  });

  it('applies responsive grid layout', () => {
    const { container } = render(<RelatedArticles articles={mockArticles} />);
    const grid = container.querySelector('[class*="grid"]');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });

  it('applies section spacing', () => {
    const { container } = render(<RelatedArticles articles={mockArticles} />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('py-16');
  });

  it('applies max-width container', () => {
    const { container } = render(<RelatedArticles articles={mockArticles} />);
    const contentContainer = container.querySelector('[class*="max-w"]');
    expect(contentContainer).toHaveClass('max-w-7xl');
  });
});
