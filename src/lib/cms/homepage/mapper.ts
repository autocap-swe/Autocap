import type { CmsHomepage, HomepageContent } from './types';

export function homepageMapper(cms: CmsHomepage): HomepageContent {
  return { ...cms };
}
