import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';
import { Section } from './Section';

describe('PageHeader (AC-DS2)', () => {
  it('renders eyebrow, a single h1 and the lead', () => {
    render(<PageHeader eyebrow="About" title="Leadership" lead="Lead text." />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Leadership');
    expect(screen.getByText('Lead text.')).toBeInTheDocument();
  });

  it('uses the v2 title role', () => {
    render(<PageHeader title="Leadership" />);
    expect(screen.getByRole('heading', { level: 1 }).className).toContain('t-h1');
  });
});

describe('Section (AC-DS4)', () => {
  it.each([
    ['white', 'bg-white'],
    ['ink', 'bg-ink'],
    ['birch', 'bg-birch'],
    ['fjord', 'bg-fjord'],
  ] as const)('tone %s sets %s', (tone, cls) => {
    const { container } = render(<Section tone={tone}>x</Section>);
    expect(container.querySelector('section')?.className).toContain(cls);
  });
});
