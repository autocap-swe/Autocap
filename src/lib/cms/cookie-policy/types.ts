import type { CookiePolicy, CookiePolicySection } from '@/types/cookie-policy';

export interface CmsCookiePolicySection {
  sectionId: string;
  title: string;
  content: string;
}

export interface CmsCookiePolicy {
  sections: CmsCookiePolicySection[];
  lastUpdated: string;
  contactEmail: string;
  heroDescription?: string;
  contactTitle?: string;
  contactDescription?: string;
}

export type { CookiePolicy, CookiePolicySection };
