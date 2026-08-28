import { groupWorkshopsByCoordinate } from './groupWorkshopsByCoordinate';
import type { Workshop } from '@/lib/cms/workshop/types';

function makeWorkshop(overrides: Partial<Workshop> & { id: number }): Workshop {
  return {
    name: `Workshop ${overrides.id}`,
    slug: `workshop-${overrides.id}`,
    city: 'Mölndal',
    region: 'Västra Götaland',
    latitude: 57.6557,
    longitude: 12.0138,
    status: 'acquired',
    yearAcquired: 2026,
    localWebsite: 'https://example.se',
    description: 'Test workshop',
    ...overrides,
  };
}

describe('groupWorkshopsByCoordinate', () => {
  // AC-001
  it('returns a single-workshop group for a unique coordinate', () => {
    const workshop = makeWorkshop({ id: 1, latitude: 59.3459, longitude: 18.053 });

    const groups = groupWorkshopsByCoordinate([workshop]);

    expect(groups).toHaveLength(1);
    expect(groups[0].workshops).toEqual([workshop]);
    expect(groups[0].latitude).toBe(59.3459);
    expect(groups[0].longitude).toBe(18.053);
  });

  // AC-002
  it('groups workshops sharing a coordinate into one entry', () => {
    const workshops = [
      makeWorkshop({ id: 1, name: 'Däckpoint i Mölndal' }),
      makeWorkshop({ id: 2, name: 'Mölndals Däckservice' }),
      makeWorkshop({ id: 3, name: 'Mölndals Bilverkstad' }),
    ];

    const groups = groupWorkshopsByCoordinate(workshops);

    expect(groups).toHaveLength(1);
    expect(groups[0].workshops.map(w => w.name)).toEqual([
      'Däckpoint i Mölndal',
      'Mölndals Däckservice',
      'Mölndals Bilverkstad',
    ]);
  });

  // AC-004
  it('group count matches distinct coordinates and preserves every workshop', () => {
    const workshops = [
      makeWorkshop({ id: 1 }),
      makeWorkshop({ id: 2 }),
      makeWorkshop({ id: 3 }),
      makeWorkshop({ id: 4, latitude: 59.3477, longitude: 17.9396 }),
      makeWorkshop({ id: 5, latitude: 59.4819, longitude: 17.7441 }),
    ];

    const groups = groupWorkshopsByCoordinate(workshops);

    expect(groups).toHaveLength(3);
    expect(groups.reduce((sum, group) => sum + group.workshops.length, 0)).toBe(workshops.length);
  });

  // AC-005
  it('treats equal coordinates with differing precision as one group', () => {
    const workshops = [
      makeWorkshop({ id: 1, latitude: 57.6557, longitude: 12.0138 }),
      makeWorkshop({ id: 2, latitude: 57.6557, longitude: 12.0138 }),
      makeWorkshop({ id: 3, latitude: 57.655701, longitude: 12.013802 }),
    ];

    const groups = groupWorkshopsByCoordinate(workshops);

    expect(groups).toHaveLength(1);
    expect(groups[0].workshops).toHaveLength(3);
    expect(groups[0].latitude).toBe(57.6557);
  });

  it('keeps workshops on coordinates that differ beyond the grouping precision apart', () => {
    const workshops = [
      makeWorkshop({ id: 1, latitude: 57.6557, longitude: 12.0138 }),
      makeWorkshop({ id: 2, latitude: 57.6558, longitude: 12.0138 }),
    ];

    expect(groupWorkshopsByCoordinate(workshops)).toHaveLength(2);
  });

  // Distances at Mölndal's latitude: 1e-5° of latitude is 1.11 m, 1e-5° of
  // longitude is 0.60 m. The grouping key rounds to 5 decimals, so the
  // threshold sits at roughly one metre.
  const METRES_PER_DEGREE_LAT = 111132;

  function metresNorth(latitude: number, metres: number): number {
    return latitude + metres / METRES_PER_DEGREE_LAT;
  }

  it('groups workshops that are sub-metre apart', () => {
    const workshops = [
      makeWorkshop({ id: 1, latitude: 57.6557 }),
      makeWorkshop({ id: 2, latitude: metresNorth(57.6557, 0.5) }),
    ];

    expect(groupWorkshopsByCoordinate(workshops)).toHaveLength(1);
  });

  it('keeps workshops a couple of metres apart separate', () => {
    const workshops = [
      makeWorkshop({ id: 1, latitude: 57.6557 }),
      makeWorkshop({ id: 2, latitude: metresNorth(57.6557, 2) }),
    ];

    expect(groupWorkshopsByCoordinate(workshops)).toHaveLength(2);
  });

  it('keeps neighbouring addresses separate', () => {
    const workshops = [
      makeWorkshop({ id: 1, latitude: 57.6557 }),
      makeWorkshop({ id: 2, latitude: metresNorth(57.6557, 50) }),
    ];

    // 50 m apart is two markers — they overlap visually at low zoom, which is
    // zoom-level clustering's job, not this function's.
    expect(groupWorkshopsByCoordinate(workshops)).toHaveLength(2);
  });

  it('buckets by a rounding grid, so the threshold is not a true radius', () => {
    // 1.11 m apart, but both round to the same key
    const sameBucket = [
      makeWorkshop({ id: 1, latitude: 57.655745 }),
      makeWorkshop({ id: 2, latitude: 57.655755 }),
    ];
    expect(groupWorkshopsByCoordinate(sameBucket)).toHaveLength(1);

    // 0.89 m apart, but they straddle a grid line
    const straddling = [
      makeWorkshop({ id: 3, latitude: 57.655751 }),
      makeWorkshop({ id: 4, latitude: 57.655759 }),
    ];
    expect(groupWorkshopsByCoordinate(straddling)).toHaveLength(2);
  });

  // The CMS stores latitude and longitude as Strapi's `float` type, created as
  // double precision, so a coordinate reaches the map with every place the
  // editor typed. Grouping is therefore decided by the 5-place key above, not
  // by what the database was able to keep.
  describe('with coordinates as the CMS stores them', () => {
    it('groups two workshops sharing one address', () => {
      // Mölndals Däckservice and Mölndals Bilverkstad, both Kråketorpsgatan 16
      const workshops = [
        makeWorkshop({ id: 1, city: 'Mölndal', latitude: 57.6557, longitude: 12.0138 }),
        makeWorkshop({ id: 2, city: 'Mölndal', latitude: 57.6557, longitude: 12.0138 }),
      ];

      expect(groupWorkshopsByCoordinate(workshops)).toHaveLength(1);
    });

    it('keeps two buildings across the street apart', () => {
      // 12.0138 and 12.0141 are ~20 m apart — under decimal(10, 2) both saved
      // as 12.01 and collapsed into one pin
      const workshops = [
        makeWorkshop({ id: 1, latitude: 57.6557, longitude: 12.0138 }),
        makeWorkshop({ id: 2, latitude: 57.6557, longitude: 12.0141 }),
      ];

      expect(groupWorkshopsByCoordinate(workshops)).toHaveLength(2);
    });

    it('keeps workshops in the same city apart', () => {
      // Bromma, Vasastan and Solna all rounded to 59.35, 17.94 / 18.01 before
      const workshops = [
        makeWorkshop({ id: 1, city: 'Bromma', latitude: 59.3477, longitude: 17.9396 }),
        makeWorkshop({ id: 2, city: 'Stockholm', latitude: 59.3459, longitude: 18.053 }),
        makeWorkshop({ id: 3, city: 'Solna', latitude: 59.3653, longitude: 18.005 }),
      ];

      expect(groupWorkshopsByCoordinate(workshops)).toHaveLength(3);
    });
  });

  // AC-006
  it('returns no groups for an empty list', () => {
    expect(groupWorkshopsByCoordinate([])).toEqual([]);
  });

  it('preserves input order of groups', () => {
    const workshops = [
      makeWorkshop({ id: 1, city: 'Bromma', latitude: 59.3477, longitude: 17.9396 }),
      makeWorkshop({ id: 2, city: 'Mölndal' }),
      makeWorkshop({ id: 3, city: 'Bromma', latitude: 59.3477, longitude: 17.9396 }),
    ];

    const groups = groupWorkshopsByCoordinate(workshops);

    expect(groups.map(group => group.workshops[0].city)).toEqual(['Bromma', 'Mölndal']);
  });
});
