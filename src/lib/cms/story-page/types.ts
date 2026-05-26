import type { BlocksContent } from '@strapi/blocks-react-renderer';
import type { StrapiMedia } from '../media';

export interface CmsTimelineMilestone {
  year: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'future';
}

export interface CmsStoryPage {
  heroHeadline: string;
  openingHeadline: string;
  openingContent: BlocksContent;
  pullQuoteText: string;
  pullQuoteAttribution: string;
  pullQuoteAttributionTitle: string;
  modelTitle: string;
  modelContent: BlocksContent;
  visionTitle: string;
  visionContent: BlocksContent;
  timelineTitle: string;
  timelineMilestones: CmsTimelineMilestone[];
  heroImage?: StrapiMedia | null;
}

export type StoryPageContent = CmsStoryPage;
