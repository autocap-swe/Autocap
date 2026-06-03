import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsEntrepreneursPage, EntrepreneursPageContent } from './types';
import { entrepreneursPageMapper } from './mapper';

export async function getEntrepreneursPageContent(
  revalidate = REVALIDATE_HIGH,
  locale?: string
): Promise<EntrepreneursPageContent> {
  return getContent<CmsEntrepreneursPage, EntrepreneursPageContent>('entrepreneurs-page', {
    revalidate,
    mapper: entrepreneursPageMapper,
    locale,
    tags: ['entrepreneurs-page'],
    params: { populate: 'benefits,heroImage,closingBgImage,seo' },
  });
}
