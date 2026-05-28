import type { CmsPortfolioPage, PortfolioPageContent } from './types';

export function portfolioPageMapper(cms: CmsPortfolioPage): PortfolioPageContent {
  return { ...cms };
}
