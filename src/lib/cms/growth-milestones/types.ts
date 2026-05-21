import type { GrowthMilestone } from '@/types/investors';

export interface CmsMilestone {
  id: number;
  year: number;
  label: string;
  description: string;
  isAchieved: boolean;
}

export interface CmsGrowthMilestones {
  milestones: CmsMilestone[];
}

export type { GrowthMilestone };
