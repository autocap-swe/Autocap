import { render, screen } from '@testing-library/react';
import { ArticleHeader } from './ArticleHeader';
import type { NewsArticle } from '@/lib/cms/article/types';

describe('ArticleHeader', () => {
  const mockArticle: NewsArticle = {
    id: 1,
    title: 'Test Article Title',
    excerpt: 'Test excerpt',
    publishDate: '2026-01-15',
    author: 'John Doe',
    category: 'Company News',
    imageUrl: '/test-article.jpg',
    slug: 'test-article',
    readTimeMinutes: 5,
    order: 1,
  };

  it('displays article title', () => {
    render(<ArticleHeader article={mockArticle} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Test Article Title' })
    ).toBeInTheDocument();
  });

  it('displays category badge', () => {
    render(<ArticleHeader article={mockArticle} />);

    expect(screen.getByText('Company News')).toBeInTheDocument();
  });

  it('displays author name', () => {
    render(<ArticleHeader article={mockArticle} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays formatted publish date', () => {
    render(<ArticleHeader article={mockArticle} />);

    expect(screen.getByText('January 15, 2026')).toBeInTheDocument();
  });

  it('displays read time', () => {
    render(<ArticleHeader article={mockArticle} />);

    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('applies responsive title typography', () => {
    const { container } = render(<ArticleHeader article={mockArticle} />);

    const title = container.querySelector('h1');
    expect(title).toHaveClass('text-5xl');
    expect(title).toHaveClass('md:text-6xl');
    expect(title).toHaveClass('lg:text-7xl');
  });

  it('applies title font weight', () => {
    const { container } = render(<ArticleHeader article={mockArticle} />);

    const title = container.querySelector('h1');
    expect(title).toHaveClass('font-black');
  });

  it('applies Linen White gradient background', () => {
    const { container } = render(<ArticleHeader article={mockArticle} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-gradient-to-br');
    expect(header).toHaveClass('from-[#F5F0EB]');
    expect(header).toHaveClass('to-[#EDE8E3]');
  });

  it('applies vertical padding', () => {
    const { container } = render(<ArticleHeader article={mockArticle} />);

    const header = container.querySelector('header');
    expect(header).toHaveClass('py-16');
  });

  it('displays decorative red line separator', () => {
    const { container } = render(<ArticleHeader article={mockArticle} />);

    const separator = container.querySelector('[class*="border-[#C8102E]"]');
    expect(separator).toBeInTheDocument();
  });

  it('applies max-width container', () => {
    const { container } = render(<ArticleHeader article={mockArticle} />);

    const contentContainer = container.querySelector('[class*="max-w"]');
    expect(contentContainer).toHaveClass('max-w-4xl');
  });

  it('centers content horizontally', () => {
    const { container } = render(<ArticleHeader article={mockArticle} />);

    const contentContainer = container.querySelector('[class*="max-w"]');
    expect(contentContainer).toHaveClass('mx-auto');
  });
});
