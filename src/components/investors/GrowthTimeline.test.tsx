import { render, screen } from '@testing-library/react';
import { GrowthTimeline } from './GrowthTimeline';
import type { GrowthMilestone } from '@/types/investors';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CheckCircle2: () => <div data-testid="check-circle-icon" />,
  Circle: () => <div data-testid="circle-icon" />,
}));

describe('GrowthTimeline Component', () => {
  const mockMilestones: readonly GrowthMilestone[] = [
    {
      period: 'H2 2025',
      description: 'Platform established. Three founding acquisitions completed.',
      status: 'completed',
    },
    {
      period: 'Q1 2026',
      description: 'Largest acquisition completed (7-unit Stockholm group).',
      status: 'completed',
    },
    {
      period: '2026',
      description: 'Scaling phase. Targeting 20+ workshops.',
      status: 'target',
    },
  ];

  describe('Rendering', () => {
    it('renders all milestone periods', () => {
      render(<GrowthTimeline milestones={mockMilestones} />);
      expect(screen.getByText('H2 2025')).toBeInTheDocument();
      expect(screen.getByText('Q1 2026')).toBeInTheDocument();
      expect(screen.getByText('2026')).toBeInTheDocument();
    });

    it('renders all milestone descriptions', () => {
      render(<GrowthTimeline milestones={mockMilestones} />);
      expect(
        screen.getByText('Platform established. Three founding acquisitions completed.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Largest acquisition completed (7-unit Stockholm group).')
      ).toBeInTheDocument();
      expect(screen.getByText('Scaling phase. Targeting 20+ workshops.')).toBeInTheDocument();
    });

    it('renders correct number of milestones', () => {
      const { container } = render(<GrowthTimeline milestones={mockMilestones} />);
      const milestoneElements = container.querySelectorAll('.flex.gap-6');
      expect(milestoneElements).toHaveLength(3);
    });
  });

  describe('Status Icons', () => {
    it('renders CheckCircle2 icon for completed milestones', () => {
      render(<GrowthTimeline milestones={mockMilestones} />);
      const checkIcons = screen.getAllByTestId('check-circle-icon');
      expect(checkIcons).toHaveLength(2); // H2 2025 and Q1 2026
    });

    it('renders Circle icon for target milestones', () => {
      render(<GrowthTimeline milestones={mockMilestones} />);
      const circleIcons = screen.getAllByTestId('circle-icon');
      expect(circleIcons).toHaveLength(1); // 2026
    });

    it('uses different visual styling for completed milestones', () => {
      const completedMilestones: readonly GrowthMilestone[] = [
        {
          period: 'H2 2025',
          description: 'Completed milestone',
          status: 'completed',
        },
      ];
      render(<GrowthTimeline milestones={completedMilestones} />);
      // Completed milestones use CheckCircle2 icon
      expect(screen.getByTestId('check-circle-icon')).toBeInTheDocument();
    });

    it('uses different visual styling for target milestones', () => {
      const targetMilestones: readonly GrowthMilestone[] = [
        {
          period: '2026',
          description: 'Target milestone',
          status: 'target',
        },
      ];
      render(<GrowthTimeline milestones={targetMilestones} />);
      // Target milestones use Circle icon
      expect(screen.getByTestId('circle-icon')).toBeInTheDocument();
    });
  });

  describe('Period Styling', () => {
    it('uses red color for completed milestone periods', () => {
      const { container } = render(<GrowthTimeline milestones={mockMilestones} />);
      const periods = container.querySelectorAll('.text-\\[\\#C8102E\\]');
      // Should have icons + period text for completed milestones
      expect(periods.length).toBeGreaterThan(0);
    });

    it('uses gray color for target milestone periods', () => {
      const { container } = render(<GrowthTimeline milestones={mockMilestones} />);
      const periods = container.querySelectorAll('.text-gray-600');
      expect(periods.length).toBeGreaterThan(0);
    });

    it('period text is bold', () => {
      const { container } = render(<GrowthTimeline milestones={mockMilestones} />);
      const periods = container.querySelectorAll('.font-bold');
      expect(periods.length).toBeGreaterThanOrEqual(3);
    });

    it('period has responsive text size', () => {
      const { container } = render(<GrowthTimeline milestones={mockMilestones} />);
      const period = container.querySelector('.text-lg.md\\:text-xl');
      expect(period).toBeInTheDocument();
    });
  });

  describe('Description Styling', () => {
    it('description has relaxed leading', () => {
      render(<GrowthTimeline milestones={mockMilestones} />);
      const description = screen.getByText(/Platform established/);
      expect(description).toHaveClass('leading-relaxed');
    });

    it('description is responsive', () => {
      render(<GrowthTimeline milestones={mockMilestones} />);
      const description = screen.getByText(/Platform established/);
      expect(description).toHaveClass('text-base', 'md:text-lg');
    });

    it('description uses gray color', () => {
      render(<GrowthTimeline milestones={mockMilestones} />);
      const description = screen.getByText(/Platform established/);
      expect(description).toHaveClass('text-gray-700');
    });
  });

  describe('Layout', () => {
    it('uses flex layout with gap', () => {
      const { container } = render(<GrowthTimeline milestones={mockMilestones} />);
      const milestoneItem = container.querySelector('.flex.gap-6');
      expect(milestoneItem).toBeInTheDocument();
    });

    it('icon container does not shrink', () => {
      const { container } = render(<GrowthTimeline milestones={mockMilestones} />);
      const iconContainer = container.querySelector('.flex-shrink-0');
      expect(iconContainer).toBeInTheDocument();
    });

    it('content container is flexible', () => {
      const { container } = render(<GrowthTimeline milestones={mockMilestones} />);
      const contentContainer = container.querySelector('.flex-1');
      expect(contentContainer).toBeInTheDocument();
    });

    it('has vertical spacing between milestones', () => {
      const { container } = render(<GrowthTimeline milestones={mockMilestones} />);
      const wrapper = container.querySelector('.space-y-8');
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty milestones array', () => {
      const { container } = render(<GrowthTimeline milestones={[]} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles single milestone', () => {
      const singleMilestone: readonly GrowthMilestone[] = [
        {
          period: 'H2 2025',
          description: 'Single milestone',
          status: 'completed',
        },
      ];
      render(<GrowthTimeline milestones={singleMilestone} />);
      expect(screen.getByText('H2 2025')).toBeInTheDocument();
      expect(screen.getByText('Single milestone')).toBeInTheDocument();
    });

    it('handles many milestones', () => {
      const manyMilestones: readonly GrowthMilestone[] = Array.from({ length: 10 }, (_, i) => ({
        period: `Milestone ${i + 1}`,
        description: `Description ${i + 1}`,
        status: i % 2 === 0 ? ('completed' as const) : ('target' as const),
      }));
      render(<GrowthTimeline milestones={manyMilestones} />);
      expect(screen.getByText('Milestone 1')).toBeInTheDocument();
      expect(screen.getByText('Milestone 10')).toBeInTheDocument();
    });

    it('handles long period text', () => {
      const longPeriodMilestone: readonly GrowthMilestone[] = [
        {
          period: 'Q4 2025 - Early 2026',
          description: 'Extended period milestone',
          status: 'target',
        },
      ];
      render(<GrowthTimeline milestones={longPeriodMilestone} />);
      expect(screen.getByText('Q4 2025 - Early 2026')).toBeInTheDocument();
    });

    it('handles long description text', () => {
      const longDescMilestone: readonly GrowthMilestone[] = [
        {
          period: '2026',
          description:
            'This is a very long description that contains multiple sentences and detailed information about the milestone, including specific metrics, goals, and strategic objectives that need to be achieved.',
          status: 'target',
        },
      ];
      render(<GrowthTimeline milestones={longDescMilestone} />);
      expect(screen.getByText(/This is a very long description/)).toBeInTheDocument();
    });
  });

  describe('Icon Layout', () => {
    it('renders icon for each milestone', () => {
      render(<GrowthTimeline milestones={mockMilestones} />);
      const checkIcons = screen.getAllByTestId('check-circle-icon');
      const circleIcons = screen.getAllByTestId('circle-icon');
      // Should have 2 completed + 1 target = 3 total icons
      expect(checkIcons.length + circleIcons.length).toBe(3);
    });

    it('icons are in non-shrinking containers', () => {
      const { container } = render(<GrowthTimeline milestones={mockMilestones} />);
      const iconContainers = container.querySelectorAll('.flex-shrink-0');
      expect(iconContainers.length).toBe(3);
    });
  });
});
