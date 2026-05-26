import type { StrapiMedia } from '../media';

export interface CmsBenefitItem {
  title: string;
  description: string;
}

export interface CmsEntrepreneursPage {
  landingHeadline: string;
  landingSubheadline: string;
  landingCtaText: string;
  landingCtaLink: string;
  trustIndicator?: string;
  whyPageTitle: string;
  whyPageBadge?: string;
  whyPageIntro: string;
  whyPageIntroBold: string;
  benefits: CmsBenefitItem[];
  closingBlockTitle: string;
  closingBlockDescription: string;
  whyPageClosingCta: string;
  heroImage?: StrapiMedia | null;
}

export type EntrepreneursPageContent = CmsEntrepreneursPage;
