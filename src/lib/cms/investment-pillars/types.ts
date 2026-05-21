import type { InvestmentPillar } from '@/types/investors';

export interface CmsPillar {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface CmsInvestmentPillars {
  pillars: CmsPillar[];
}

export type { InvestmentPillar };
