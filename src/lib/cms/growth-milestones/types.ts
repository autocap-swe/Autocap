import type { GrowthMilestone } from '@/types/investors';

export interface CmsMilestone {
  id: number;
  year: number;
  label: string;
  description: string;
  isAchieved: boolean;
}

export interface CmsGrowthMilestones {
  milestonesTitle?: string;
  intro?: string;
  roadmap?: string;
  milestones: CmsMilestone[];
}

export interface GrowthMilestonesContent {
  milestonesTitle: string;
  intro: string;
  roadmap: string;
  milestones: GrowthMilestone[];
}

export type { GrowthMilestone };
