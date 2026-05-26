import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsStoryPage, StoryPageContent } from './types';
import { storyPageMapper } from './mapper';

export async function getStoryPageContent(
  revalidate = REVALIDATE_HIGH,
  locale?: string
): Promise<StoryPageContent> {
  return getContent<CmsStoryPage, StoryPageContent>('story-page', {
    revalidate,
    mapper: storyPageMapper,
    locale,
    tags: ['story-page'],
    params: { populate: 'timelineMilestones,heroImage' },
  });
}
