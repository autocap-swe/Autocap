import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsPortfolioPage, PortfolioPageContent } from './types';
import { portfolioPageMapper } from './mapper';

export async function getPortfolioPageContent(
  revalidate = REVALIDATE_HIGH,
  locale?: string
): Promise<PortfolioPageContent> {
  return getContent<CmsPortfolioPage, PortfolioPageContent>('portfolio-page', {
    revalidate,
    mapper: portfolioPageMapper,
    locale,
    tags: ['portfolio-page'],
    params: { populate: 'heroImage,seo' },
  });
}
