import type { Workshop } from '@/lib/cms/workshop/types';

export type RegionKey = 'east' | 'west';

export interface Company {
  key: string;
  name: string;
  region: RegionKey;
  /** City shown in lists and on hover. */
  city: string;
  workshops: Workshop[];
  website?: string;
  imageUrl?: string;
  /** Earliest year a workshop in the company joined the group. */
  since?: number;
  founded?: number;
  /** Only stated where the source confirms it (design sketch / published copy). */
  tireHotel: boolean;
  /** Only people already named publicly on the site. */
  ledBy?: string;
  withinDackgruppen?: boolean;
}

interface CompanyRule {
  key: string;
  name: string;
  match: (workshop: Workshop) => boolean;
  city: string;
  tireHotel?: boolean;
  ledBy?: string;
  founded?: number;
  withinDackgruppen?: boolean;
}

// Counties per region follow the regional organisation decided 2026-11-02 (border at Örebro).
const EAST_COUNTIES = ['Stockholm', 'Uppsala', 'Västmanland', 'Södermanland', 'Östergötland'];

export function regionOf(workshop: Workshop): RegionKey {
  return EAST_COUNTIES.includes(workshop.region) ? 'east' : 'west';
}

// Brand grouping of the workshops in the CMS. Facts beyond the CMS are limited to what is
// already published on the site or stated in the approved design sketch.
const RULES: CompanyRule[] = [
  {
    key: 'dackgruppen',
    name: 'Däckgruppen',
    match: w => w.name.startsWith('Däckgruppen'),
    city: 'Stockholm',
    tireHotel: true,
    ledBy: 'Fredrik Agrell, CEO',
  },
  {
    key: 'skanstull',
    name: 'Skanstulls Bil & Däck',
    match: w => w.name.startsWith('Skanstull'),
    city: 'Skarpnäck',
    founded: 1990,
  },
  {
    key: 'tumba',
    name: 'Tumba Gummiverkstad',
    match: w => w.name.startsWith('Tumba'),
    city: 'Tumba',
    withinDackgruppen: true,
  },
  {
    key: 'dackpoint',
    name: 'Däckpoint i Mölndal',
    match: w => w.name.startsWith('Däckpoint'),
    city: 'Mölndal',
    ledBy: 'Martin Cederberg',
  },
  {
    key: 'molndals-dackservice',
    name: 'Mölndals Däckservice',
    match: w => w.name === 'Mölndals Däckservice',
    city: 'Mölndal',
  },
  {
    key: 'molndals-bilverkstad',
    name: 'Mölndals Bilverkstad',
    match: w => w.name === 'Mölndals Bilverkstad',
    city: 'Mölndal',
  },
  {
    key: 'oxnered',
    name: "Verksta'n i Öxnered",
    match: w => w.name.includes('Öxnered'),
    city: 'Vänersborg',
    ledBy: 'Martin Tommysson',
  },
];

/** Groups acquired workshops into the local brands, in the fixed brand order. */
export function groupCompanies(workshops: Workshop[]): Company[] {
  const acquired = workshops.filter(w => w.status === 'acquired');
  return RULES.map(rule => {
    const own = acquired.filter(rule.match).sort((a, b) => a.name.localeCompare(b.name, 'sv'));
    const first = own[0];
    return {
      key: rule.key,
      name: rule.name,
      region: first ? regionOf(first) : 'east',
      city: rule.city,
      workshops: own,
      website: first?.localWebsite || undefined,
      imageUrl: own.find(w => w.imageUrl)?.imageUrl,
      since: own.length ? Math.min(...own.map(w => w.yearAcquired)) : undefined,
      founded: first?.yearFounded ?? rule.founded,
      tireHotel: rule.tireHotel ?? false,
      ledBy: rule.ledBy,
      withinDackgruppen: rule.withinDackgruppen,
    };
  }).filter(company => company.workshops.length > 0);
}

export function countByRegion(workshops: Workshop[]): Record<RegionKey, number> {
  const acquired = workshops.filter(w => w.status === 'acquired');
  return {
    east: acquired.filter(w => regionOf(w) === 'east').length,
    west: acquired.filter(w => regionOf(w) === 'west').length,
  };
}
