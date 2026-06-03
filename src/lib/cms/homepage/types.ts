import type { CmsSeo } from '../seo';
import type { StrapiMedia } from '../media';

export interface CmsAudienceCard {
  id: number;
  headline: string;
  description: string;
  ctaText: string;
}

export interface CmsHomepage {
  heroHeadline: string;
  heroSubheadline: string;
  heroCta1Text: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;
  audienceCards?: CmsAudienceCard[];
  ceoQuoteText: string;
  ceoQuoteAttribution: string;
  footerCtaHeadline: string;
  footerCtaSubtext: string;
  footerCtaButtonText: string;
  footerCtaButtonLink: string;
  heroVideo?: StrapiMedia | null;
  ceoQuoteBgImage?: StrapiMedia | null;
  footerCtaBgImage?: StrapiMedia | null;
  seo?: CmsSeo | null;
}

export type HomepageContent = CmsHomepage;
