import type { CmsContactPage, ContactCardData, ContactContent } from './types';

/**
 * The two specialized routing cards ("For Investors", "For Workshop Owners")
 * are navigation, not editorial copy — they live here as a static const.
 * Promote to a Strapi component if editors need to manage them later.
 */
const SPECIALIZED_CARDS: readonly ContactCardData[] = [
  {
    title: 'For Investors',
    description:
      'Interested in the AutoCap opportunity? Learn about our investment case and growth strategy.',
    ctaText: 'Investor Relations ',
    ctaLink: '/investors/contact',
    bgColor: 'bg-[#D8E4DC]',
  },
  {
    title: 'For Workshop Owners',
    description:
      "Thinking about the next chapter for your tire workshop? Let's have a confidential conversation.",
    ctaText: 'Start a Conversation ',
    ctaLink: '/entrepreneurs/contact',
    bgColor: 'bg-[#C9D8E8]',
  },
];

export function contactMapper(cms: CmsContactPage): ContactContent {
  return {
    hero: {
      title: cms.heroTitle,
      description: cms.heroDescription,
    },
    routing: { text: cms.routingText },
    specializedCards: [...SPECIALIZED_CARDS],
    generalInquiry: {
      title: cms.generalInquiryTitle,
      successMessage: cms.successMessage,
    },
    companyInfo: {
      email: cms.companyEmail,
      address: cms.companyAddress,
      businessHours: cms.businessHours,
    },
    formLabels: {
      nameLabel: cms.nameLabel,
      namePlaceholder: cms.namePlaceholder,
      emailLabel: cms.emailLabel,
      emailPlaceholder: cms.emailPlaceholder,
      subjectLabel: cms.subjectLabel,
      subjectPlaceholder: cms.subjectPlaceholder,
      messageLabel: cms.messageLabel,
      messagePlaceholder: cms.messagePlaceholder,
      gdprConsentText: cms.gdprConsentText,
      submitButtonText: cms.submitButtonText,
    },
  };
}
