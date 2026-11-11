/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { KpiTicker } from './KpiTicker';

// Mock KPI data for testing
const mockKpis = [
  {
    value: 10000,
    label: 'Active Users',
    suffix: '+',
  },
  {
    value: 500000,
    label: 'Videos Captioned',
    suffix: '+',
  },
  {
    value: 95,
    label: 'Languages Supported',
    suffix: '+',
  },
  {
    value: 99.9,
    label: 'Accuracy Rate',
    suffix: '%',
  },
];

describe('KpiTicker', () => {
  let mockIntersectionObserver: jest.Mock;

  beforeEach(() => {
    // Mock IntersectionObserver
    mockIntersectionObserver = jest.fn(function (
      callback: IntersectionObserverCallback
    ) {
      return {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
        takeRecords: jest.fn(),
        root: null,
        rootMargin: '',
        thresholds: [0]
      };
    });

    global.IntersectionObserver = mockIntersectionObserver as any;

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });

    // Mock requestAnimationFrame
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(
      (cb) => setTimeout(cb, 16) as unknown as number
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders all 4 KPI cards with correct labels', () => {
    render(<KpiTicker kpis={mockKpis} />);

    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Videos Captioned')).toBeInTheDocument();
    expect(screen.getByText('Languages Supported')).toBeInTheDocument();
    expect(screen.getByText('Accuracy Rate')).toBeInTheDocument();
  });

  it('does not render gradient circle decorations', () => {
    const { container } = render(<KpiTicker kpis={mockKpis} />);

    // Check that there are no decorative gradient circles
    // The gradient circles had classes: "absolute left-1/4 top-1/2 h-96 w-96"
    const gradientCircles = container.querySelectorAll(
      '.absolute.left-1\\/4.top-1\\/2, .absolute.right-1\\/4.top-1\\/2'
    );

    expect(gradientCircles.length).toBe(0);

    // Verify the section background gradient is still present
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-gradient-to-br');
  });

  it('renders section with dark gradient background', () => {
    const { container } = render(<KpiTicker kpis={mockKpis} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-gradient-to-br');
    expect(section).toHaveClass('from-[#1C1C1E]');
    expect(section).toHaveClass('via-[#2C2C2E]');
    expect(section).toHaveClass('to-[#1C1C1E]');
  });

  it('renders the final KPI values without a count-up animation (fas A)', () => {
    render(<KpiTicker kpis={mockKpis} />);

    expect(screen.getByText('10000+')).toBeInTheDocument();
    expect(screen.getByText('500000+')).toBeInTheDocument();
    expect(screen.getByText('95+')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.queryByText(/^0/)).not.toBeInTheDocument();
  });

  it('renders correct icons for each KPI', () => {
    const { container } = render(<KpiTicker kpis={mockKpis} />);

    // Check that SVG icons are present (4 icons for 4 KPIs)
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(4);
  });

  it('renders responsive grid layout classes', () => {
    const { container } = render(<KpiTicker kpis={mockKpis} />);

    // Grid container should have responsive classes
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1'); // Mobile: 1 column
    expect(gridContainer).toHaveClass('sm:grid-cols-2'); // Small screens: 2 columns
    expect(gridContainer).toHaveClass('xl:grid-cols-4'); // Wide screens: 4 columns
  });

  it('applies correct spacing and padding', () => {
    const { container } = render(<KpiTicker kpis={mockKpis} />);

    const section = container.querySelector('section');
    expect(section).toHaveClass('py-20');
    expect(section).toHaveClass('md:py-28');
  });

  it('renders KPI cards with glass effect styling', () => {
    const { container } = render(<KpiTicker kpis={mockKpis} />);

    // KPI cards should have backdrop blur and border
    const kpiCards = container.querySelectorAll('.backdrop-blur-sm');
    expect(kpiCards.length).toBeGreaterThanOrEqual(4);
  });

  it('has proper semantic HTML structure', () => {
    const { container } = render(<KpiTicker kpis={mockKpis} />);

    // Should be wrapped in a section
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();

    // Should have a max-width container
    const maxWidthDiv = container.querySelector('.max-w-7xl');
    expect(maxWidthDiv).toBeInTheDocument();
  });

  it('displays correct suffix formatting', () => {
    render(<KpiTicker kpis={mockKpis} />);

    expect(screen.getAllByText(/\+$/).length).toBe(3); // Three KPIs have + suffix
    expect(screen.getByText(/%$/)).toBeInTheDocument(); // One KPI has % suffix
  });
});
