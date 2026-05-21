import type { CmsGrowthMilestones, GrowthMilestone } from './types';

export function growthMilestonesMapper(cms: CmsGrowthMilestones): GrowthMilestone[] {
  return [...cms.milestones]
    .sort((a, b) => a.year - b.year)
    .map(m => ({
      period: m.label,
      description: m.description,
      status: m.isAchieved ? 'completed' : 'target',
    }));
}
