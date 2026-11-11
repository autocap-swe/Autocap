import type { Workshop } from '@/lib/cms/workshop/types';
import { SITE_URL } from '@/lib/cms/seo';

/**
 * schema.org description of one workshop, built only from CMS fields. The CMS holds no street
 * address, phone or opening hours, so those are left out rather than guessed.
 */
export function workshopJsonLd(workshop: Workshop, pageUrl: string): Record<string, unknown> {
  const hasPosition = Number.isFinite(workshop.latitude) && Number.isFinite(workshop.longitude);
  return {
    '@context': 'https://schema.org',
    '@type': 'TireShop',
    '@id': `${pageUrl}#workshop`,
    name: workshop.name,
    description: workshop.description,
    url: workshop.localWebsite || pageUrl,
    mainEntityOfPage: pageUrl,
    ...(workshop.imageUrl ? { image: workshop.imageUrl } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: workshop.city,
      addressRegion: workshop.region,
      addressCountry: 'SE',
    },
    ...(hasPosition
      ? { geo: { '@type': 'GeoCoordinates', latitude: workshop.latitude, longitude: workshop.longitude } }
      : {}),
    ...(workshop.yearFounded ? { foundingDate: String(workshop.yearFounded) } : {}),
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
  };
}
