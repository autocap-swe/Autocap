import type { CmsSeo } from '../seo';
import type { BlocksContent } from '@strapi/blocks-react-renderer';
import type { StrapiMedia } from '../media';

export interface CmsBenefitItem {
  title: string;
  description: string;
}

export interface CmsAboutPage {
  heroHeadline: string;
  heroSubheadline: string;
  trustIndicator?: string;
  storyTitle: string;
  storyContent: BlocksContent;
  missionTitle: string;
  missionStatement: string;
  missionOurVisionLabel: string;
  missionVision: string;
  differentiatorsSectionTitle: string;
  differentiators: CmsBenefitItem[];
  closingTitle: string;
  closingDescription: string;
  heroImage?: StrapiMedia | null;
  missionBgImage?: StrapiMedia | null;
  differentiatorsBgImage?: StrapiMedia | null;
  closingBgImage?: StrapiMedia | null;
  seo?: CmsSeo | null;
}

export type AboutPageContent = CmsAboutPage;
