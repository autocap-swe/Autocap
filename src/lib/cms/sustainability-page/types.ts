import type { StrapiMedia } from '../media';

export interface CmsTextItem {
  text: string;
}

export interface CmsSustainabilityPage {
  heroHeadline: string;
  heroIntro: string;
  whereWeAreTitle: string;
  whereWeAreDescription: string;
  whereWeAreCurrentFocusLabel: string;
  whereWeAreFocusAreas: CmsTextItem[];
  whereWeAreGoingTitle: string;
  whereWeAreGoingDescription: string;
  whereWeAreGoingStatement: string;
  governanceTitle: string;
  governanceDescription: string;
  governanceContactText: string;
  governanceContactEmail: string;
  heroImage?: StrapiMedia | null;
}

export type SustainabilityPageContent = CmsSustainabilityPage;
