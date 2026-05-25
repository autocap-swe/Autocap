import type { CmsTestimonial } from './types';
import type { Testimonial } from '@/types/testimonial';

const CMS_URL = (process.env.CMS_API_URL ?? 'http://localhost:1337').replace(/\/$/, '');

function resolveUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${CMS_URL}${url}`;
}

export function testimonialMapper(cms: CmsTestimonial): Testimonial {
  return {
    id: cms.id,
    workshopName: cms.workshopName,
    city: cms.city,
    ownerName: cms.ownerName,
    quote: cms.quote,
    keyFact: cms.keyFact,
    ownerPhotoUrl: resolveUrl(cms.ownerPhoto?.url),
    acquisitionDate: cms.acquisitionDate,
    order: cms.order,
  };
}

export function testimonialsMapper(items: CmsTestimonial[]): Testimonial[] {
  return items.map(testimonialMapper);
}
