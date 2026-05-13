import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsWorkshop, Workshop } from './types';
import { workshopsMapper } from './mapper';

export async function getWorkshopsContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<Workshop[]> {
  return getContent<CmsWorkshop[], Workshop[]>('workshops', {
    revalidate,
    locale,
    tags: ['workshops'],
    params: { 'pagination[pageSize]': '100' },
    mapper: workshopsMapper,
  });
}

export async function getWorkshopBySlugContent(
  slug: string,
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<Workshop | null> {
  const results = await getContent<CmsWorkshop[], Workshop[]>('workshops', {
    revalidate,
    locale,
    tags: ['workshops', `workshop:${slug}`],
    params: {
      'filters[slug][$eq]': slug,
      'pagination[pageSize]': '1',
    },
    mapper: workshopsMapper,
  });
  return results[0] ?? null;
}
