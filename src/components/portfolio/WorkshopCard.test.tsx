import { render, screen } from '@testing-library/react';
import { WorkshopCard } from './WorkshopCard';
import type { Workshop } from '@/lib/cms/workshop/types';

const labels: Record<string, string> = { founded: 'Founded', inGroupSince: 'In the group since' };

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => labels[key] ?? key,
}));

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const workshop: Workshop = {
  id: 1,
  name: 'Test Däck',
  slug: 'test-dack',
  city: 'Stockholm',
  region: 'Stockholm',
  latitude: 59.3,
  longitude: 18.0,
  status: 'acquired',
  yearAcquired: 2026,
  localWebsite: 'https://example.com',
  description: 'A workshop',
};

describe('WorkshopCard (fas A)', () => {
  it('AC-A4.1: shows "In the group since" instead of "Since"', () => {
    render(<WorkshopCard workshop={workshop} />);
    expect(screen.getByText('In the group since')).toBeInTheDocument();
    expect(screen.getByText('2026')).toBeInTheDocument();
    expect(screen.queryByText(/^Since /)).not.toBeInTheDocument();
  });

  it('AC-A4.2: shows the founding year when known', () => {
    render(<WorkshopCard workshop={{ ...workshop, yearFounded: 1987 }} />);
    expect(screen.getByText('Founded')).toBeInTheDocument();
    expect(screen.getByText('1987')).toBeInTheDocument();
  });

  it('AC-A4.3: hides "Founded" when the year is missing', () => {
    render(<WorkshopCard workshop={workshop} />);
    expect(screen.queryByText('Founded')).not.toBeInTheDocument();
  });
});
