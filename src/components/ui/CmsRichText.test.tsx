import { render, screen } from '@testing-library/react';
import { CmsRichText } from './CmsRichText';
import type { BlocksContent } from '@strapi/blocks-react-renderer';

const paragraphBlock: BlocksContent = [
  {
    type: 'paragraph',
    children: [{ type: 'text', text: 'Hello world' }],
  },
];

const headingBlock: BlocksContent = [
  {
    type: 'heading',
    level: 2,
    children: [{ type: 'text', text: 'Section heading' }],
  },
];

describe('CmsRichText', () => {
  it('renders paragraph block as visible text', () => {
    render(<CmsRichText content={paragraphBlock} />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders heading block as visible text', () => {
    render(<CmsRichText content={headingBlock} />);
    expect(screen.getByText('Section heading')).toBeInTheDocument();
  });

  it('renders empty content without error', () => {
    const { container } = render(<CmsRichText content={[]} />);
    expect(container).toBeInTheDocument();
  });
});
