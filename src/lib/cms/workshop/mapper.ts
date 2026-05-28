import type { CmsWorkshop, Workshop } from './types';

const CMS_URL = (process.env.CMS_API_URL ?? 'http://localhost:1337').replace(/\/$/, '');

function resolveUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${CMS_URL}${url}`;
}

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
    localWebsite: cms.localWebsite
      ? cms.localWebsite.match(/^https?:\/\//)
        ? cms.localWebsite
        : `https://${cms.localWebsite}`
      : cms.localWebsite,
    description: cms.description,
    partnershipNote: cms.partnershipNote ?? null,
    imageUrl: resolveUrl(cms.image?.url),
  };
}

export function workshopsMapper(items: CmsWorkshop[]): Workshop[] {
  return items.map(workshopMapper);
}
