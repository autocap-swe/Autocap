import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsGrowthMilestones, GrowthMilestonesContent } from './types';
import { growthMilestonesMapper } from './mapper';

const fallback: GrowthMilestonesContent = {
  milestonesTitle: '',
  intro: '',
  roadmap: '',
  milestones: [],
};

export async function getGrowthMilestonesContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<GrowthMilestonesContent> {
  const options = {
    revalidate,
    tags: ['growth-milestones'],
    params: { populate: 'milestones' },
    mapper: growthMilestonesMapper,
  };

  const result = await getContent<CmsGrowthMilestones, GrowthMilestonesContent>(
    'growth-milestones',
    {
      ...options,
      locale,
    }
  );

  if (!result && locale && locale !== 'en') {
    return getContent<CmsGrowthMilestones, GrowthMilestonesContent>('growth-milestones', {
      ...options,
      locale: 'en',
    });
  }

  return result ?? fallback;
}
