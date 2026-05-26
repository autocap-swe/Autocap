import type { CmsStoryPage, StoryPageContent } from './types';

export function storyPageMapper(cms: CmsStoryPage): StoryPageContent {
  return { ...cms };
}
