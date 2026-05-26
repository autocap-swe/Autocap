import type { CmsAboutPage, AboutPageContent } from './types';

export function aboutPageMapper(cms: CmsAboutPage): AboutPageContent {
  return { ...cms };
}
