import { render, screen } from '@testing-library/react';
import { InvestmentPillar } from './InvestmentPillar';

jest.mock('lucide-react', () => {
  const icon = (name: string) => {
    const Icon = () => <svg data-testid={`${name}-icon`} />;
    Icon.displayName = name;
    return Icon;
  };
  return {
    Target: icon('target'),
    TrendingUp: icon('trending-up'),
    Zap: icon('zap'),
    Users: icon('users'),
    ShoppingCart: icon('shopping-cart'),
    Settings: icon('settings'),
    BarChart3: icon('bar-chart'),
    Heart: icon('heart'),
  };
});

const pillar = {
  id: 1,
  icon: 'Users',
  title: 'Test Pillar Title',
  description: 'This is a test pillar description with some details.',
};

describe('InvestmentPillar', () => {
  it('renders the number, title and description', () => {
    render(<InvestmentPillar pillar={pillar} index={0} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Test Pillar Title' })).toBeInTheDocument();
    expect(screen.getByText(pillar.description)).toBeInTheDocument();
  });

  it('shows the icon named in the CMS', () => {
    render(<InvestmentPillar pillar={pillar} index={0} />);
    expect(screen.getByTestId('users-icon')).toBeInTheDocument();
  });

  it('falls back to an icon by position when the CMS names none or an unknown one', () => {
    const { rerender } = render(<InvestmentPillar pillar={{ ...pillar, icon: undefined }} index={0} />);
    expect(screen.getByTestId('target-icon')).toBeInTheDocument();
    rerender(<InvestmentPillar pillar={{ ...pillar, id: 2, icon: 'NoSuchIcon' }} index={1} />);
    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
  });

  it('alternates the section background by position', () => {
    const { container, rerender } = render(<InvestmentPillar pillar={pillar} index={0} />);
    const first = container.querySelector('section')?.className;
    rerender(<InvestmentPillar pillar={pillar} index={1} />);
    expect(container.querySelector('section')?.className).not.toBe(first);
  });
});
