import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsGrowthMilestones, GrowthMilestone } from './types';
import { growthMilestonesMapper } from './mapper';

export async function getGrowthMilestonesContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<GrowthMilestone[]> {
  const options = {
    revalidate,
    tags: ['growth-milestones'],
    params: { populate: 'milestones' },
    mapper: growthMilestonesMapper,
  };

  const result = await getContent<CmsGrowthMilestones, GrowthMilestone[]>('growth-milestones', {
    ...options,
    locale,
  });

  if (!result && locale && locale !== 'en') {
    return getContent<CmsGrowthMilestones, GrowthMilestone[]>('growth-milestones', {
      ...options,
      locale: 'en',
    });
  }

  return result ?? [];
}
