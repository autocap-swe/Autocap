import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsTestimonial } from './types';
import type { Testimonial } from '@/types/testimonial';
import { testimonialsMapper } from './mapper';

export async function getTestimonialsContent(revalidate = REVALIDATE_HIGH): Promise<Testimonial[]> {
  return getContent<CmsTestimonial[], Testimonial[]>('testimonials', {
    revalidate,
    tags: ['testimonials'],
    params: {
      'pagination[pageSize]': '50',
      'sort[0]': 'order:asc',
      populate: 'ownerPhoto',
    },
    mapper: testimonialsMapper,
  });
}
