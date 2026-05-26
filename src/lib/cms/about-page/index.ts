import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsAboutPage, AboutPageContent } from './types';
import { aboutPageMapper } from './mapper';

export async function getAboutPageContent(
  revalidate = REVALIDATE_HIGH,
  locale?: string
): Promise<AboutPageContent> {
  return getContent<CmsAboutPage, AboutPageContent>('about-page', {
    revalidate,
    mapper: aboutPageMapper,
    locale,
    tags: ['about-page'],
    params: { populate: 'differentiators,heroImage' },
  });
}
