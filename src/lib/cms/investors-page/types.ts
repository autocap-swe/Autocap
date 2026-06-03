import type { CmsSeo } from '../seo';
import type { StrapiMedia } from '../media';

export interface InvestorsFormLabels {
  contactTitle: string;
  contactSubtext: string;
  contactSuccessMessage: string;
  formNameLabel: string;
  formEmailLabel: string;
  formPhoneLabel: string;
  formOrganisationLabel: string;
  formRoleLabel: string;
  formEnquiryTypeLabel: string;
  formMessageLabel: string;
  formGdprConsentText: string;
  formSubmitButtonText: string;
}

export interface CmsInvestorsPage extends InvestorsFormLabels {
  landingHeadline: string;
  landingSubheadline: string;
  landingCtaText: string;
  landingCtaLink: string;
  trustIndicator?: string;
  closingBlockTitle?: string;
  closingBlockDescription?: string;
  heroImage?: StrapiMedia | null;
  closingBgImage?: StrapiMedia | null;
  seo?: CmsSeo | null;
}

export type InvestorsPageContent = CmsInvestorsPage;
