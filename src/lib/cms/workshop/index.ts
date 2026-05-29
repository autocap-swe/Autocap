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
  const localeTag =
    locale && locale !== 'en' ? `workshop:${slug}:${locale}` : `workshop:${slug}:en`;

  const results = await getContent<CmsWorkshop[], Workshop[]>('workshops', {
    revalidate,
    tags: ['workshops', `workshop:${slug}`, localeTag],
    params: {
      'filters[slug][$eq]': slug,
      'pagination[pageSize]': '1',
      'populate[image]': 'true',
      'populate[localizations][fields][0]': 'slug',
      'populate[localizations][fields][1]': 'locale',
    },
    mapper: workshopsMapper,
    locale,
  });

  if (!results[0] && locale && locale !== 'en') {
    return getContent<CmsWorkshop[], Workshop[]>('workshops', {
      revalidate,
      tags: ['workshops', `workshop:${slug}`, `workshop:${slug}:en`],
      params: {
        'filters[slug][$eq]': slug,
        'pagination[pageSize]': '1',
        'populate[image]': 'true',
      },
      mapper: workshopsMapper,
      locale: 'en',
    }).then(r => r[0] ?? null);
  }

  return results[0] ?? null;
}
