export interface CmsPrivacySection {
  sectionId: string;
  title: string;
  content: string;
}

export interface CmsPrivacyPolicy {
  sections: CmsPrivacySection[];
  lastUpdated: string;
  contactEmail: string;
  version: string;
  heroDescription?: string;
  contactTitle?: string;
  contactDescription?: string;
}

export type { PrivacySection, PrivacyPolicy } from '@/types/privacy-policy';
