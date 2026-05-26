export interface CookiePolicySection {
  id: string;
  title: string;
  content: string[];
}

import type { CmsSeo } from '@/lib/cms/seo';

export interface CookiePolicy {
  sections: CookiePolicySection[];
  lastUpdated: string;
  contactEmail: string;
  heroDescription?: string;
  contactTitle?: string;
  contactDescription?: string;
  seo?: CmsSeo | null;
}
