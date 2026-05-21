import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsInvestmentPillars, InvestmentPillar } from './types';
import { investmentPillarsMapper } from './mapper';

export async function getInvestmentPillarsContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<InvestmentPillar[]> {
  const options = {
    revalidate,
    tags: ['investment-pillars'],
    params: { populate: 'pillars' },
    mapper: investmentPillarsMapper,
  };

  const result = await getContent<CmsInvestmentPillars, InvestmentPillar[]>('investment-pillars', {
    ...options,
    locale,
  });

  if (!result && locale && locale !== 'en') {
    return getContent<CmsInvestmentPillars, InvestmentPillar[]>('investment-pillars', {
      ...options,
      locale: 'en',
    });
  }

  return result ?? [];
}
