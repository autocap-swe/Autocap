import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsInvestorsPage, InvestorsPageContent } from './types';
import { investorsPageMapper } from './mapper';

export async function getInvestorsPageContent(
  revalidate = REVALIDATE_HIGH,
  locale?: string
): Promise<InvestorsPageContent> {
  return getContent<CmsInvestorsPage, InvestorsPageContent>('investors-page', {
    revalidate,
    mapper: investorsPageMapper,
    locale,
    tags: ['investors-page'],
    params: { populate: 'heroImage,seo' },
  });
}
