import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/entrepreneurs/Breadcrumb';
import { ContactForm } from '@/components/entrepreneurs/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us · For Workshop Owners',
  description: "Start a confidential conversation about your workshop's future.",
};

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('entrepreneurs');

  return (
    <main className="min-h-screen bg-[#D8E4DC]">
      <section className="px-6 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb
            items={[
              { label: t('breadcrumb.home'), href: '/' },
              { label: t('breadcrumb.whyAutocap'), href: '/entrepreneurs' },
              { label: t('breadcrumb.letsTalk') },
            ]}
          />
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-[#1C1C1E] md:text-5xl">
              {t('contact.title')}
            </h1>
            <p className="text-lg leading-relaxed text-gray-700">{t('contact.subtext')}</p>
          </div>
        </div>
      </section>
      <section className="px-6 pb-20 md:px-8">
        <div className="mx-auto max-w-2xl">
          <ContactForm successMessage={t('contact.successMessage')} />
        </div>
      </section>
    </main>
  );
}
