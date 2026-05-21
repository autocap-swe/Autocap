import { render, screen } from '@testing-library/react';
import { InvestmentPillar } from './InvestmentPillar';
import type { InvestmentPillar as PillarType } from '@/types/investors';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Target: () => <div data-testid="target-icon" />,
  Package: () => <div data-testid="package-icon" />,
}));

describe('InvestmentPillar Component', () => {
  const mockPillar: PillarType = {
    id: 1,
    icon: 'Target',
    title: 'Test Pillar Title',
    description: 'This is a test pillar description with some details.',
  };

  describe('Rendering', () => {
    it('renders pillar title', () => {
      render(<InvestmentPillar pillar={mockPillar} />);
      expect(screen.getByText('Test Pillar Title')).toBeInTheDocument();
    });

    it('renders pillar description', () => {
      render(<InvestmentPillar pillar={mockPillar} />);
      expect(
        screen.getByText('This is a test pillar description with some details.')
      ).toBeInTheDocument();
    });

    it('renders pillar icon', () => {
      render(<InvestmentPillar pillar={mockPillar} />);
      expect(screen.getByTestId('target-icon')).toBeInTheDocument();
    });

    it('renders different icon when provided', () => {
      const pillarWithPackage: PillarType = {
        ...mockPillar,
        icon: Package,
      };
      render(<InvestmentPillar pillar={pillarWithPackage} />);
      expect(screen.getByTestId('package-icon')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('has white background with border', () => {
      const { container } = render(<InvestmentPillar pillar={mockPillar} />);
      const card = container.firstChild;
      expect(card).toHaveClass('bg-white', 'border', 'border-gray-200');
    });

    it('has rounded corners', () => {
      const { container } = render(<InvestmentPillar pillar={mockPillar} />);
      const card = container.firstChild;
      expect(card).toHaveClass('rounded-2xl');
    });

    it('has hover shadow effect', () => {
      const { container } = render(<InvestmentPillar pillar={mockPillar} />);
      const card = container.firstChild;
      expect(card).toHaveClass('hover:shadow-lg');
    });

    it('has transition animation', () => {
      const { container } = render(<InvestmentPillar pillar={mockPillar} />);
      const card = container.firstChild;
      expect(card).toHaveClass('transition-all');
    });

    it('has responsive padding', () => {
      const { container } = render(<InvestmentPillar pillar={mockPillar} />);
      const card = container.firstChild;
      expect(card).toHaveClass('p-6', 'md:p-8');
    });
  });

  describe('Icon Container', () => {
    it('has red background with opacity', () => {
      const { container } = render(<InvestmentPillar pillar={mockPillar} />);
      const iconContainer = container.querySelector('.bg-\\[\\#C8102E\\]\\/10');
      expect(iconContainer).toBeInTheDocument();
    });

    it('has rounded corners', () => {
      const { container } = render(<InvestmentPillar pillar={mockPillar} />);
      const iconContainer = container.querySelector('.rounded-xl');
      expect(iconContainer).toBeInTheDocument();
    });

    it('has fixed dimensions', () => {
      const { container } = render(<InvestmentPillar pillar={mockPillar} />);
      const iconContainer = container.querySelector('.h-12.w-12');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  describe('Typography', () => {
    it('title is bold and larger on desktop', () => {
      render(<InvestmentPillar pillar={mockPillar} />);
      const title = screen.getByText('Test Pillar Title');
      expect(title).toHaveClass('font-bold', 'text-xl', 'md:text-2xl');
    });

    it('title uses black color', () => {
      render(<InvestmentPillar pillar={mockPillar} />);
      const title = screen.getByText('Test Pillar Title');
      expect(title).toHaveClass('text-[#1C1C1E]');
    });

    it('description has relaxed leading', () => {
      render(<InvestmentPillar pillar={mockPillar} />);
      const description = screen.getByText(/This is a test pillar description/);
      expect(description).toHaveClass('leading-relaxed');
    });

    it('description is responsive', () => {
      render(<InvestmentPillar pillar={mockPillar} />);
      const description = screen.getByText(/This is a test pillar description/);
      expect(description).toHaveClass('text-base', 'md:text-lg');
    });
  });

  describe('Accessibility', () => {
    it('title is a heading', () => {
      render(<InvestmentPillar pillar={mockPillar} />);
      const title = screen.getByRole('heading', { name: 'Test Pillar Title' });
      expect(title).toBeInTheDocument();
    });

    it('title is h3 level', () => {
      render(<InvestmentPillar pillar={mockPillar} />);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent('Test Pillar Title');
    });
  });

  describe('Content Flexibility', () => {
    it('handles long titles gracefully', () => {
      const longTitlePillar: PillarType = {
        ...mockPillar,
        title: 'This is a very long pillar title that might wrap to multiple lines',
      };
      render(<InvestmentPillar pillar={longTitlePillar} />);
      expect(
        screen.getByText('This is a very long pillar title that might wrap to multiple lines')
      ).toBeInTheDocument();
    });

    it('handles long descriptions gracefully', () => {
      const longDescPillar: PillarType = {
        ...mockPillar,
        description:
          'This is a very long description that contains multiple sentences and should wrap nicely across multiple lines to ensure readability.',
      };
      render(<InvestmentPillar pillar={longDescPillar} />);
      expect(
        screen.getByText(
          /This is a very long description that contains multiple sentences and should wrap nicely/
        )
      ).toBeInTheDocument();
    });
  });
});
