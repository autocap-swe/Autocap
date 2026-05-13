import { render, screen } from '@testing-library/react';
import { ArticleBody } from './ArticleBody';
import type { ArticleContentBlock } from '@/lib/cms/article/types';

describe('ArticleBody', () => {
  it('renders all content block types', () => {
    const content: ArticleContentBlock[] = [
      { type: 'paragraph', content: 'This is a paragraph.' },
      { type: 'heading', level: 2, content: 'Section Heading' },
      { type: 'heading', level: 3, content: 'Subsection Heading' },
      { type: 'image', src: '/test.jpg', alt: 'Test image', caption: 'Test caption' },
      { type: 'quote', content: 'Test quote', attribution: 'John Doe' },
      { type: 'list', style: 'bullet', items: ['Item 1', 'Item 2'] },
      { type: 'callout', variant: 'info', content: 'Info message' },
    ];

    render(<ArticleBody content={content} />);

    expect(screen.getByText('This is a paragraph.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Section Heading' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Subsection Heading' })
    ).toBeInTheDocument();
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
    expect(screen.getByText('Test caption')).toBeInTheDocument();
    expect(screen.getByText(/Test quote/)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('applies max-width container', () => {
    const content: ArticleContentBlock[] = [{ type: 'paragraph', content: 'Test content' }];

    const { container } = render(<ArticleBody content={content} />);

    const article = container.querySelector('article');
    expect(article).toHaveClass('max-w-3xl');
  });

  it('applies horizontal margins', () => {
    const content: ArticleContentBlock[] = [{ type: 'paragraph', content: 'Test content' }];

    const { container } = render(<ArticleBody content={content} />);

    const article = container.querySelector('article');
    expect(article).toHaveClass('mx-auto');
  });

  it('applies vertical padding', () => {
    const content: ArticleContentBlock[] = [{ type: 'paragraph', content: 'Test content' }];

    const { container } = render(<ArticleBody content={content} />);

    const article = container.querySelector('article');
    expect(article).toHaveClass('py-12');
  });

  it('renders empty content gracefully', () => {
    const { container } = render(<ArticleBody content={[]} />);

    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();
  });

  it('renders content in correct order', () => {
    const content: ArticleContentBlock[] = [
      { type: 'paragraph', content: 'First paragraph' },
      { type: 'paragraph', content: 'Second paragraph' },
      { type: 'heading', level: 2, content: 'Middle heading' },
      { type: 'paragraph', content: 'Third paragraph' },
    ];

    const { container } = render(<ArticleBody content={content} />);

    const paragraphs = container.querySelectorAll('p');
    const heading = container.querySelector('h2');

    expect(paragraphs[0]).toHaveTextContent('First paragraph');
    expect(paragraphs[1]).toHaveTextContent('Second paragraph');
    expect(heading).toHaveTextContent('Middle heading');
    expect(paragraphs[2]).toHaveTextContent('Third paragraph');
  });
});
