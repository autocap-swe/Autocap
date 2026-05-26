export interface PrivacySection {
  id: string;
  title: string;
  content: string[];
}

import type { CmsSeo } from '@/lib/cms/seo';

export interface PrivacyPolicy {
  sections: PrivacySection[];
  lastUpdated: string;
  contactEmail: string;
  version: string;
  heroDescription?: string;
  contactTitle?: string;
  contactDescription?: string;
  seo?: CmsSeo | null;
}
