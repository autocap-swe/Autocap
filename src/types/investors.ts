export interface GrowthMilestone {
  period: string;
  description: string;
  status: 'completed' | 'target';
}

export interface InvestmentPillar {
  id: number;
  icon: string;
  title: string;
  description: string;
}
