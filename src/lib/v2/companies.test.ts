import type { Workshop } from '@/lib/cms/workshop/types';
import { countByRegion, groupCompanies, regionOf } from './companies';

function workshop(name: string, region: string, yearAcquired = 2026): Workshop {
  return {
    id: name.length,
    name,
    slug: name,
    city: 'X',
    region,
    latitude: 0,
    longitude: 0,
    status: 'acquired',
    yearAcquired,
    localWebsite: '',
    description: '',
  };
}

const workshops = [
  workshop('Däckgruppen Solna', 'Stockholm'),
  workshop('Däckgruppen Bromma', 'Stockholm'),
  workshop('Tumba Gummiverkstad', 'Stockholm', 2025),
  workshop('Däckpoint i Mölndal', 'Västra Götaland', 2025),
  workshop("Verksta'n i Öxnered", 'Västra Götaland', 2025),
];

describe('companies (AC-V2-C1, AC-V2-C2)', () => {
  it('groups workshops into brands in a fixed order', () => {
    const companies = groupCompanies(workshops);
    expect(companies.map(c => c.key)).toEqual(['dackgruppen', 'tumba', 'dackpoint', 'oxnered']);
    expect(companies[0].workshops).toHaveLength(2);
  });

  it('places Stockholm in East and Västra Götaland in West/Central', () => {
    expect(regionOf(workshops[0])).toBe('east');
    expect(regionOf(workshops[3])).toBe('west');
    expect(countByRegion(workshops)).toEqual({ east: 3, west: 2 });
  });

  it('leaves out workshops that are not yet acquired', () => {
    const pending = { ...workshop('Däckpoint i Mölndal', 'Västra Götaland'), status: 'pending' as const };
    expect(groupCompanies([pending])).toEqual([]);
  });

  it('marks tire hotel only where confirmed', () => {
    const companies = groupCompanies(workshops);
    expect(companies.find(c => c.key === 'dackgruppen')?.tireHotel).toBe(true);
    expect(companies.find(c => c.key === 'dackpoint')?.tireHotel).toBe(false);
  });
});
