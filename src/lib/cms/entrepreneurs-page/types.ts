import type { CmsSeo } from '../seo';
import type { StrapiMedia } from '../media';

export interface CmsBenefitItem {
  title: string;
  description: string;
}

export interface EntrepreneursFormLabels {
  contactTitle: string;
  contactSubtext: string;
  contactSuccessMessage: string;
  formNameLabel: string;
  formEmailLabel: string;
  formPhoneLabel: string;
  formWorkshopNameLabel: string;
  formCityRegionLabel: string;
  formRevenueLabel: string;
  formMessageLabel: string;
  formGdprConsentText: string;
  formSubmitButtonText: string;
}

export interface CmsEntrepreneursPage extends EntrepreneursFormLabels {
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
  seo?: CmsSeo | null;
}

export type EntrepreneursPageContent = CmsEntrepreneursPage;
