import type { CmsSeo } from '../seo';
import type { StrapiMedia } from '../media';

export interface CmsInvestorsPage {
  landingHeadline: string;
  landingSubheadline: string;
  landingCtaText: string;
  landingCtaLink: string;
  trustIndicator?: string;
  closingBlockTitle?: string;
  closingBlockDescription?: string;
  heroImage?: StrapiMedia | null;
  seo?: CmsSeo | null;
}

export type InvestorsPageContent = CmsInvestorsPage;
