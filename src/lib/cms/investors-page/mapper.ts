import type { CmsInvestorsPage, InvestorsPageContent } from './types';

export function investorsPageMapper(cms: CmsInvestorsPage): InvestorsPageContent {
  return { ...cms };
}
