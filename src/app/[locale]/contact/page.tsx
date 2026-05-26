import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getContactContent } from '@/lib/cms/contact';
import { ContactCard } from '@/components/contact/ContactCard';
import { GeneralContactForm } from '@/components/contact/GeneralContactForm';
import { CompanyInfo } from '@/components/contact/CompanyInfo';
import { buildMetadata } from '@/lib/cms/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = await getContactContent(undefined, locale).catch(() => null);
  return buildMetadata(
    {
      title: 'Contact · AutoCap Group',
      description: 'Get in touch — for workshop owners, investors, media, or general enquiries.',
    },
    content?.seo,
    locale
  );
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getContactContent(undefined, locale).catch(() => null);
  if (!content) notFound();
  const { hero, routing, specializedCards, generalInquiry, companyInfo, formLabels } = content;

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
