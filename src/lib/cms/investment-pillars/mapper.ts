import type { CmsInvestmentPillars, InvestmentPillar } from './types';

export function investmentPillarsMapper(cms: CmsInvestmentPillars): InvestmentPillar[] {
  return cms.pillars.map((p, i) => ({
    id: i + 1,
    icon: p.icon,
    title: p.title,
    description: p.description,
  }));
}
