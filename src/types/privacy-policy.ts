export interface PrivacySection {
  id: string;
  title: string;
  content: string[];
}

export interface PrivacyPolicy {
  sections: PrivacySection[];
  lastUpdated: string;
  contactEmail: string;
  version: string;
  heroDescription?: string;
  contactTitle?: string;
  contactDescription?: string;
}
