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
