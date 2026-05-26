import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsHomepage, HomepageContent } from './types';
import { homepageMapper } from './mapper';

export async function getHomepageContent(
  revalidate = REVALIDATE_HIGH,
  locale?: string
): Promise<HomepageContent> {
  return getContent<CmsHomepage, HomepageContent>('homepage', {
    revalidate,
    mapper: homepageMapper,
    locale,
    tags: ['homepage'],
    params: { populate: 'audienceCards,heroVideo' },
  });
}
