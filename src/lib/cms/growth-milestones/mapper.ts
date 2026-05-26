import type { CmsGrowthMilestones, GrowthMilestonesContent } from './types';

export function growthMilestonesMapper(cms: CmsGrowthMilestones): GrowthMilestonesContent {
  return {
    milestonesTitle: cms.milestonesTitle ?? '',
    intro: cms.intro ?? '',
    roadmap: cms.roadmap ?? '',
    milestones: [...cms.milestones]
      .sort((a, b) => a.year - b.year)
      .map(m => ({
        period: m.label,
        description: m.description,
        status: m.isAchieved ? 'completed' : 'target',
      })),
  };
}
