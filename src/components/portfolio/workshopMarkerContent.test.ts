import { buildMarkerElement } from './workshopMarkerContent';
import type { Workshop } from '@/lib/cms/workshop/types';
import type { WorkshopLocationGroup } from './groupWorkshopsByCoordinate';

function makeWorkshop(overrides: Partial<Workshop> & { id: number }): Workshop {
  return {
    name: `Workshop ${overrides.id}`,
    slug: `workshop-${overrides.id}`,
    city: 'Mölndal',
    region: 'Västra Götaland',
    latitude: 57.6448,
    longitude: 12.0176,
    status: 'acquired',
    yearAcquired: 2026,
    localWebsite: 'https://example.se',
    description: 'Test workshop',
    ...overrides,
  };
}

function makeGroup(count: number): WorkshopLocationGroup {
  const workshops = Array.from({ length: count }, (_, index) => makeWorkshop({ id: index + 1 }));
  return {
    key: '57.64480,12.01760',
    latitude: 57.6448,
    longitude: 12.0176,
    workshops,
  };
}

describe('buildMarkerElement', () => {
  // Mapbox positions markers with `.mapboxgl-marker { position: absolute }`.
  // An inline `position` beats that class, drops every marker back into
  // document flow, and they stack down the map instead of sitting on their
  // coordinates — with Mapbox's transform still moving them on every zoom.
  it('sets no inline position, so the Mapbox class keeps the marker absolute', () => {
    expect(buildMarkerElement(makeGroup(1)).style.position).toBe('');
    expect(buildMarkerElement(makeGroup(3)).style.position).toBe('');
  });

  it('keeps the count badge absolutely positioned inside the marker', () => {
    const badge = buildMarkerElement(makeGroup(3)).querySelector('.workshop-marker-badge');

    expect(badge).not.toBeNull();
    expect((badge as HTMLElement).style.position).toBe('absolute');
    expect(badge?.textContent).toBe('3');
  });

  it('gives a single-workshop marker no badge', () => {
    expect(buildMarkerElement(makeGroup(1)).querySelector('.workshop-marker-badge')).toBeNull();
  });
});
