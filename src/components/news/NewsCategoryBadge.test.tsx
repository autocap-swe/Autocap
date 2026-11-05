import { render, screen } from '@testing-library/react';
import { NewsCategoryBadge } from './NewsCategoryBadge';

jest.mock('next-intl', () => {
  const en = jest.requireActual('../../../messages/en.json');
  return {
    useTranslations: (namespace: string) => (key: string) =>
      namespace
        .split('.')
        .reduce((node: Record<string, unknown>, part) => node[part] as Record<string, unknown>, en)[
        key
      ],
  };
});

describe('NewsCategoryBadge', () => {
  describe('AC-003: Category Badge Colors', () => {
    it('renders Company News with AutoCap Red background and white text', () => {
      render(<NewsCategoryBadge category="Company News" />);
      const badge = screen.getByText('Company News');

      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-[#C8102E]');
      expect(badge).toHaveClass('text-white');
    });

    it('renders Press Release with Nordic Black background and white text', () => {
      render(<NewsCategoryBadge category="Press Release" />);
      const badge = screen.getByText('Press Release');

      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-[#1C1C1E]');
      expect(badge).toHaveClass('text-white');
    });

    it('renders Industry Insights with Sage Green background and dark text', () => {
      render(<NewsCategoryBadge category="Industry Insights" />);
      const badge = screen.getByText('Industry Insights');

      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-[#D8E4DC]');
      expect(badge).toHaveClass('text-[#1C1C1E]');
    });

    it('renders Media Coverage with Ember background and dark text', () => {
      render(<NewsCategoryBadge category="Media Coverage" />);
      const badge = screen.getByText('Media Coverage');

      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-[#F0DADA]');
      expect(badge).toHaveClass('text-[#1C1C1E]');
    });
  });

  it('applies badge styling classes', () => {
    render(<NewsCategoryBadge category="Company News" />);
    const badge = screen.getByText('Company News');

    expect(badge).toHaveClass('px-3');
    expect(badge).toHaveClass('py-1');
    expect(badge).toHaveClass('rounded-full');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('font-semibold');
  });
});
