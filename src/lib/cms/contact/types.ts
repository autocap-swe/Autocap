/**
 * Types for the Contact Page — both the Strapi shape and the page shape.
 * Moved from `src/content/contact.ts` (which is deleted in v2).
 */

// ---------- Strapi shape (what the API returns) ----------

export interface CmsContactPage {
  heroTitle: string;
  heroDescription: string;
  routingText: string;
  generalInquiryTitle: string;
  successMessage: string;
  companyEmail: string;
  companyAddress: string;
  businessHours?: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  gdprConsentText: string;
  submitButtonText: string;
}

// ---------- Page shape (what the page renders) ----------

export interface ContactCardData {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  bgColor: string;
}

export interface CompanyContactInfo {
  email: string;
  address?: string;
  businessHours?: string;
}

export interface ContactFormLabels {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  gdprConsentText: string;
  submitButtonText: string;
}

export interface ContactContent {
  hero: {
    title: string;
    description: string;
  };
  routing: {
    text: string;
  };
  specializedCards: ContactCardData[];
  generalInquiry: {
    title: string;
    successMessage: string;
  };
  companyInfo: CompanyContactInfo;
  formLabels: ContactFormLabels;
}
