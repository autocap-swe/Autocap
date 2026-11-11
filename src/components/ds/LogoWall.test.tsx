import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogoWall, type LogoTile } from './LogoWall';

jest.mock('@/i18n/navigation', () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const tiles: LogoTile[] = [
  { key: 'a', name: 'Alfa Däck', city: 'Stockholm', region: 'east', tireHotel: true },
  { key: 'b', name: 'Beta Däck', city: 'Mölndal', region: 'west', tireHotel: false },
];
const labels = { all: 'All', east: 'East', west: 'West/Central', tireHotel: 'Tire hotel', group: 'Filter' };

describe('LogoWall (AC-V2-C3)', () => {
  it('shows every brand by default', () => {
    render(<LogoWall tiles={tiles} hrefBase="#" labels={labels} />);
    expect(screen.getByText('Alfa Däck')).toBeInTheDocument();
    expect(screen.getByText('Beta Däck')).toBeInTheDocument();
  });

  it('filters by region', async () => {
    render(<LogoWall tiles={tiles} hrefBase="#" labels={labels} />);
    await userEvent.click(screen.getByRole('button', { name: 'West/Central' }));
    expect(screen.queryByText('Alfa Däck')).not.toBeInTheDocument();
    expect(screen.getByText('Beta Däck')).toBeInTheDocument();
  });

  it('filters by tire hotel', async () => {
    render(<LogoWall tiles={tiles} hrefBase="#" labels={labels} />);
    await userEvent.click(screen.getByRole('button', { name: 'Tire hotel' }));
    expect(screen.getByText('Alfa Däck')).toBeInTheDocument();
    expect(screen.queryByText('Beta Däck')).not.toBeInTheDocument();
  });

  it('links each tile to its company', () => {
    render(<LogoWall tiles={tiles} hrefBase="/portfolio#" labels={labels} />);
    expect(screen.getByText('Alfa Däck').closest('a')).toHaveAttribute('href', '/portfolio#company-a');
  });
});
