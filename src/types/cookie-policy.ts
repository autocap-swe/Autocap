export interface CookiePolicySection {
  id: string;
  title: string;
  content: string[];
}

export interface CookiePolicy {
  sections: CookiePolicySection[];
  lastUpdated: string;
  contactEmail: string;
}
