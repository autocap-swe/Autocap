import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsMediaKitPage } from './types';
import type { AssetCategory } from '@/types/media-kit';
import { mediaKitPageMapper } from './mapper';

export async function getMediaKitCategories(
  locale?: string,
  revalidate = REVALIDATE_HIGH
): Promise<AssetCategory[]> {
  return getContent<CmsMediaKitPage, AssetCategory[]>('media-kit-page', {
    revalidate,
    tags: ['media-kit-categories'],
    params: {
      'populate[categories][populate][assets][populate]': 'file',
      'populate[seo]': 'true',
    },
    mapper: mediaKitPageMapper,
    locale,
  });
}
