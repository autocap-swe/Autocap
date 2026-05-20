import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsWorkshop, Workshop } from './types';
import { workshopsMapper } from './mapper';

export async function getWorkshopsContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<Workshop[]> {
  const options = {
    revalidate,
    tags: ['workshops'],
    params: { 'pagination[pageSize]': '100', populate: 'image' },
    mapper: workshopsMapper,
  };

  const results = await getContent<CmsWorkshop[], Workshop[]>('workshops', {
    ...options,
    locale,
  });

  if (results.length === 0 && locale && locale !== 'en') {
    return getContent<CmsWorkshop[], Workshop[]>('workshops', {
      ...options,
      locale: 'en',
    });
  }

  return results;
}

export async function getWorkshopBySlugContent(
  slug: string,
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<Workshop | null> {
  const options = {
    revalidate,
    tags: ['workshops', `workshop:${slug}`],
    params: {
      'filters[slug][$eq]': slug,
      'pagination[pageSize]': '1',
      populate: 'image',
    },
    mapper: workshopsMapper,
  };

  const results = await getContent<CmsWorkshop[], Workshop[]>('workshops', {
    ...options,
    locale,
  });

  if (!results[0] && locale && locale !== 'en') {
    const enResults = await getContent<CmsWorkshop[], Workshop[]>('workshops', {
      ...options,
      locale: 'en',
    });
    return enResults[0] ?? null;
  }

  return results[0] ?? null;
}
