import type { CmsWorkshop, Workshop } from './types';

export function workshopMapper(cms: CmsWorkshop): Workshop {
  return {
    id: cms.id,
    name: cms.name,
    slug: cms.slug,
    city: cms.city,
    region: cms.region,
    latitude: cms.latitude,
    longitude: cms.longitude,
    status: cms.acquisitionStatus,
    yearAcquired: cms.yearAcquired,
    localWebsite: cms.localWebsite,
    description: cms.description,
  };
}

export function workshopsMapper(items: CmsWorkshop[]): Workshop[] {
  return items.map(workshopMapper);
}
