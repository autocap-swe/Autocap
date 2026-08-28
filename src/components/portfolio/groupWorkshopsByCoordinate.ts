import type { Workshop } from '@/lib/cms/workshop/types';

/** Decimal places used for the grouping key — 5 places is roughly 1.1 metres. */
const COORDINATE_PRECISION = 5;

export interface WorkshopLocationGroup {
  /** Stable key derived from the rounded coordinate, e.g. "57.65570,12.01380" */
  key: string;
  latitude: number;
  longitude: number;
  workshops: Workshop[];
}

function coordinateKey(latitude: number, longitude: number): string {
  return `${latitude.toFixed(COORDINATE_PRECISION)},${longitude.toFixed(COORDINATE_PRECISION)}`;
}

/**
 * Buckets workshops that sit on the same coordinate so the map can render one
 * marker per location instead of stacking markers on top of each other.
 *
 * Group order and the workshops inside each group follow the input order, and
 * each group is positioned at its first workshop's coordinate.
 */
export function groupWorkshopsByCoordinate(workshops: Workshop[]): WorkshopLocationGroup[] {
  const groups = new Map<string, WorkshopLocationGroup>();

  workshops.forEach(workshop => {
    const key = coordinateKey(workshop.latitude, workshop.longitude);
    const existing = groups.get(key);

    if (existing) {
      existing.workshops.push(workshop);
      return;
    }

    groups.set(key, {
      key,
      latitude: workshop.latitude,
      longitude: workshop.longitude,
      workshops: [workshop],
    });
  });

  return Array.from(groups.values());
}
