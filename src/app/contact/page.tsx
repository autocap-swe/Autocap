import type { Metadata } from 'next';
import { getContactContent } from '@/lib/cms/contact';
import type { ContactContent } from '@/lib/cms/contact/types';
import { ContactCard } from '@/components/contact/ContactCard';
import { GeneralContactForm } from '@/components/contact/GeneralContactForm';
import { CompanyInfo } from '@/components/contact/CompanyInfo';

export const metadata: Metadata = {
  title: 'Contact · AutoCap Group',
  description: 'Get in touch — for workshop owners, investors, media, or general enquiries.',
};

const fallbackContent: ContactContent = {
  hero: {
    title: 'Get in touch with us',
    description:
      'Have a question, a proposal, or just want to learn more? We would love to hear from you.',
  },
  routing: { text: 'For specific enquiries:' },
  specializedCards: [
    {
      title: 'For Investors',
      description:
        'Interested in the AutoCap opportunity? Learn about our investment case and growth strategy.',
      ctaText: 'Investor Relations',
      ctaLink: '/investors/contact',
      bgColor: 'bg-[#D8E4DC]',
    },
    {
      title: 'For Workshop Owners',
      description:
        "Thinking about the next chapter for your tire workshop? Let's have a confidential conversation.",
      ctaText: 'Start a Conversation',
      ctaLink: '/entrepreneurs/contact',
      bgColor: 'bg-[#C9D8E8]',
    },
  ],
  generalInquiry: {
    title: 'General Inquiry',
    successMessage: 'Thank you for your message. We will get back to you within 2 business days.',
  },
  companyInfo: {
    email: 'info@autocapgroup.se',
    address: 'AutoCap Group Sweden AB · Nybrogatan 7 · Stockholm, Sweden',
  },
  formLabels: {
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
  },
};

export default async function ContactPage() {
  const { hero, routing, specializedCards, generalInquiry, companyInfo, formLabels } =
    await getContactContent().catch(() => fallbackContent);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="px-6 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-[#1C1C1E] md:text-5xl">{hero.title}</h1>
          <p className="text-lg leading-relaxed text-gray-700 md:text-xl">{hero.description}</p>
        </div>
      </section>

      {/* Routing Section */}
      <section className="px-6 pb-8 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-600">{routing.text}</p>
        </div>
      </section>

      {/* Specialized Contact Cards */}
      <section className="px-6 pb-16 md:px-8 md:pb-20">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {specializedCards.map((card, index) => (
            <ContactCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* General Inquiry Form */}
      <section className="px-6 pb-16 md:px-8 md:pb-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#1C1C1E]">
            {generalInquiry.title}
          </h2>
          <GeneralContactForm
            successMessage={generalInquiry.successMessage}
            formLabels={formLabels}
          />
        </div>
      </section>

      {/* Company Contact Info */}
      <section className="px-6 pb-20 md:px-8">
        <div className="mx-auto max-w-2xl">
          <CompanyInfo {...companyInfo} />
        </div>
      </section>
    </main>
  );
}
