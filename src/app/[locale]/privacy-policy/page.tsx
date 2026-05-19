import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { privacyPolicyContent } from '@/content/privacyPolicy';

export const metadata: Metadata = {
  title: privacyPolicyContent.metadata.title,
  description: privacyPolicyContent.metadata.description,
};

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacyPolicy');

  const sections = privacyPolicyContent.sections.map(section => ({
    ...section,
    title: t(`sections.${section.id}.title`),
    content: section.content.map((_, ci) => t(`sections.${section.id}.content.${ci}`)),
  }));

  return (
    <main className="min-h-screen bg-white">
      <section className="w-full bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mb-6 text-sm text-gray-500">{t('hero.lastUpdated')}</p>
          <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
            {t('hero.description')}
          </p>
          <div className="mt-8 h-1 w-24 bg-[#C8102E]" />
        </div>
      </section>

      <section className="w-full py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map(section => (
              <div key={section.id} id={section.id}>
                <h2 className="mb-4 text-2xl font-bold text-[#1C1C1E] md:text-3xl">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.content.map((paragraph, index) => (
                    <p
                      key={index}
                      className={`leading-relaxed ${paragraph.includes('LEGAL CONTENT PENDING') || paragraph.includes('Placeholder') ? 'italic text-gray-600' : 'text-gray-700'}`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-[#1C1C1E] md:text-3xl">
            {t('contact.title')}
          </h2>
          <p className="mb-6 leading-relaxed text-gray-700">{t('contact.description')}</p>
          <a
            href={`mailto:${privacyPolicyContent.contact.email}`}
            className="inline-flex items-center text-lg font-semibold text-[#C8102E] transition-colors hover:text-[#A00D25]"
          >
            {privacyPolicyContent.contact.email}
          </a>
        </div>
      </section>

      <section className="w-full border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <Link
            href="#"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-[#C8102E]"
          >
            {t('backToTop')}
          </Link>
        </div>
      </section>
    </main>
  );
}
