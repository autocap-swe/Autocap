/**
 * Mocked Strapi CMS responses for the Contact Page single-type.
 *
 * Used in tests to simulate CMS data without hitting the real Strapi API.
 * Mirrors the shape returned by GET /api/contact-page.
 */

/** Full CMS response — all fields populated */
export const mockCmsContactPageFull = {
  heroTitle: 'Get in touch with us',
  heroDescription:
    'Have a question, a proposal, or just want to learn more about what we do? We would love to hear from you.',
  routingText: 'For specific enquiries:',
  generalInquiryTitle: 'General Inquiry',
  successMessage: 'Thank you for your message. We will get back to you within 2 business days.',
  companyEmail: 'info@autocapgroup.se',
  companyAddress: 'AutoCap Group Sweden AB · Nybrogatan 7 · Stockholm, Sweden',
  nameLabel: 'Full Name',
  namePlaceholder: 'Enter your full name',
  emailLabel: 'Email Address',
  emailPlaceholder: 'you@example.com',
  subjectLabel: 'Subject',
  subjectPlaceholder: 'What is this regarding?',
  messageLabel: 'Your Message',
  messagePlaceholder: 'Tell us more about your enquiry...',
  gdprConsentText:
    "I agree to the processing of my personal data in accordance with AutoCap's privacy policy.",
  submitButtonText: 'Send Message',
};

/** Partial CMS response — only heroTitle set (simulates user's first CMS edit) */
export const mockCmsContactPagePartial = {
  heroTitle: 'Reach out to us',
};

/** Strapi wraps data in a `{ data: ... }` envelope */
export const mockStrapiResponseFull = {
  data: mockCmsContactPageFull,
  meta: {},
};

export const mockStrapiResponsePartial = {
  data: mockCmsContactPagePartial,
  meta: {},
};

export const mockStrapiResponseEmpty = {
  data: null,
  meta: {},
};

export const mockStrapiResponse404 = {
  data: null,
  error: {
    status: 404,
    name: 'NotFoundError',
    message: 'Not Found',
    details: {},
  },
};

export const mockStrapiResponse403 = {
  data: null,
  error: {
    status: 403,
    name: 'ForbiddenError',
    message: 'Forbidden',
    details: {},
  },
};
