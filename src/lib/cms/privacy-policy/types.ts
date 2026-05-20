export interface CmsPrivacySection {
  sectionId: string;
  title: string;
  content: string;
}

export interface CmsPrivacyPolicy {
  sections: CmsPrivacySection[];
  lastUpdated: string;
  contactEmail: string;
}

export type { PrivacySection, PrivacyPolicy } from '@/types/privacy-policy';
