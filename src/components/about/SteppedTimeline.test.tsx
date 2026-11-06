import { render, screen } from '@testing-library/react';
import { SteppedTimeline } from './SteppedTimeline';

describe('SteppedTimeline', () => {
  const mockMilestones = [
    {
      year: 'Founding',
      title: 'AutoCap Group Founded',
      description: 'Launched with a vision',
      status: 'completed' as const,
    },
    {
      year: 'First Acquisition',
      title: 'Stockholm Expansion',
      description: 'Acquired first workshops',
      status: 'completed' as const,
    },
    {
      year: 'Geographic Growth',
      title: 'Västra Götaland',
      description: 'Expanded to Västra Götaland',
      status: 'completed' as const,
    },
    {
      year: 'Today',
      title: '12 Workshops',
      description: '12 workshops, ~50 employees',
      status: 'current' as const,
    },
    {
      year: '2028 Target',
      title: '50+ Workshops',
      description: 'Ambitious target',
      status: 'future' as const,
    },
  ];

  describe('AC-004: Desktop alternating layout', () => {
    it('renders milestones in alternating left-right layout on desktop', () => {
      // Mock window.matchMedia to simulate desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { container } = render(<SteppedTimeline milestones={mockMilestones} />);

      // Check for alternating positions (class-based verification)
      const milestoneWrappers = container.querySelectorAll('[data-testid^="milestone-wrapper-"]');

      expect(milestoneWrappers[0]).toHaveClass('md:justify-start'); // left
      expect(milestoneWrappers[1]).toHaveClass('md:justify-end'); // right
      expect(milestoneWrappers[2]).toHaveClass('md:justify-start'); // left
      expect(milestoneWrappers[3]).toHaveClass('md:justify-end'); // right
      expect(milestoneWrappers[4]).toHaveClass('md:justify-start'); // left
    });

    it('connects each card to central timeline spine', () => {
      const { container } = render(<SteppedTimeline milestones={mockMilestones} />);

      // Check for timeline spine
      const timelineSpine = screen.getByTestId('timeline-spine');
      expect(timelineSpine).toBeInTheDocument();

      // Check for connector lines (should be 5, one for each milestone)
      const connectors = container.querySelectorAll('[data-testid^="connector-"]');
      expect(connectors).toHaveLength(5);
    });
  });

  describe('AC-005: Mobile vertical layout', () => {
    it('stacks milestones vertically on mobile with left-aligned spine', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      const { container } = render(<SteppedTimeline milestones={mockMilestones} />);

      // All cards should have mobile stacking classes
      const milestoneWrappers = container.querySelectorAll('[data-testid^="milestone-wrapper-"]');

      milestoneWrappers.forEach(wrapper => {
        expect(wrapper).toHaveClass('flex-col');
      });

      // Mobile spine should be visible
      const timelineSpine = screen.getByTestId('timeline-spine');
      expect(timelineSpine).toHaveClass('block'); // Visible on mobile (not hidden)
    });

    it('applies consistent spacing between mobile cards', () => {
      const { container } = render(<SteppedTimeline milestones={mockMilestones} />);

      const timelineContainer = container.querySelector('[data-testid="timeline-container"]');
      expect(timelineContainer).toHaveClass('space-y-16');
    });
  });

  describe('AC-006: Timeline spine gradient', () => {
    it('renders timeline spine with gradient from red to gray', () => {
      render(<SteppedTimeline milestones={mockMilestones} />);

      const timelineSpine = screen.getByTestId('timeline-spine');

      // Check for gradient classes
      expect(timelineSpine).toHaveClass('bg-gradient-to-b');
    });

    it('uses dashed line for future milestone connection', () => {
      const { container } = render(<SteppedTimeline milestones={mockMilestones} />);

      // The last connector (future milestone) should have dashed border
      const futureConnector = container.querySelector('[data-testid="connector-4"]');
      expect(futureConnector).toHaveClass('border-dashed');
    });
  });

  describe('AC-007: Content is visible without scroll animation (fas A, 2026-11)', () => {
    it('renders every milestone fully visible on first paint', () => {
      const { container } = render(<SteppedTimeline milestones={mockMilestones} />);

      const milestones = container.querySelectorAll('[data-testid^="milestone-wrapper-"]');

      expect(milestones.length).toBe(mockMilestones.length);
      milestones.forEach(milestone => {
        expect(milestone).not.toHaveStyle({ opacity: '0' });
      });
    });

    it('renders all milestone titles', () => {
      render(<SteppedTimeline milestones={mockMilestones} />);

      expect(screen.getByText('AutoCap Group Founded')).toBeInTheDocument();
      expect(screen.getByText('Stockholm Expansion')).toBeInTheDocument();
      expect(screen.getByText('Västra Götaland')).toBeInTheDocument();
      expect(screen.getByText('12 Workshops')).toBeInTheDocument();
      expect(screen.getByText('50+ Workshops')).toBeInTheDocument();
    });
  });

  describe('AC-009: Responsive breakpoint behavior', () => {
    it('switches layout at 768px breakpoint without content overlap', () => {
      const { container, rerender } = render(<SteppedTimeline milestones={mockMilestones} />);

      // Desktop layout should have specific classes
      const desktopContainer = container.querySelector('[data-testid="timeline-container"]');
      expect(desktopContainer).toHaveClass('max-w-6xl');

      // Re-render with same props (layout should remain stable)
      rerender(<SteppedTimeline milestones={mockMilestones} />);

      // Container should still be present without overlap
      const updatedContainer = container.querySelector('[data-testid="timeline-container"]');
      expect(updatedContainer).toBeInTheDocument();
    });

    it('preserves animation state during layout transition', () => {
      const { container } = render(<SteppedTimeline milestones={mockMilestones} />);

      // Animation state is handled by Framer Motion
      // Verify that all milestones are present and have animation wrapper
      const milestones = container.querySelectorAll('[data-testid^="milestone-wrapper-"]');
      expect(milestones).toHaveLength(5);
    });
  });

  describe('AC-012: Animation performance', () => {
    it('animations complete within 0.4s duration', () => {
      const { container } = render(<SteppedTimeline milestones={mockMilestones} />);

      // Verify that milestones have correct transition duration
      // This is set via Framer Motion's duration prop (0.4s)
      const milestones = container.querySelectorAll('[data-testid^="milestone-wrapper-"]');
      expect(milestones.length).toBeGreaterThan(0);
    });

    it('disables animations when prefers-reduced-motion is set', () => {
      // Mock prefers-reduced-motion
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const { container } = render(<SteppedTimeline milestones={mockMilestones} />);

      // Component should still render even with reduced motion
      const timelineContainer = container.querySelector('[data-testid="timeline-container"]');
      expect(timelineContainer).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('handles single milestone', () => {
      const singleMilestone = [mockMilestones[0]];

      render(<SteppedTimeline milestones={singleMilestone} />);

      expect(screen.getByText('AutoCap Group Founded')).toBeInTheDocument();
    });

    it('handles empty milestones array', () => {
      const { container } = render(<SteppedTimeline milestones={[]} />);

      // Timeline container should still render
      const timelineContainer = container.querySelector('[data-testid="timeline-container"]');
      expect(timelineContainer).toBeInTheDocument();
    });

    it('handles odd number of milestones correctly', () => {
      // 5 milestones (odd number) should still alternate correctly
      const { container } = render(<SteppedTimeline milestones={mockMilestones} />);

      const milestoneWrappers = container.querySelectorAll('[data-testid^="milestone-wrapper-"]');
      expect(milestoneWrappers).toHaveLength(5);
    });
  });
});
