import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPrivacyPolicyContent } from '@/lib/cms/privacy-policy';
import { PolicyChangeBanner } from '@/components/privacy/PolicyChangeBanner';

export const metadata: Metadata = {
  title: 'Privacy Policy · AutoCap Group',
  description:
    'AutoCap Group privacy policy — how we collect, use, and protect your personal data in compliance with GDPR.',
};

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacyPolicy');

  const cmsPolicy = await getPrivacyPolicyContent(undefined, locale).catch(() => null);

  const sections = cmsPolicy?.sections ?? [];
  const contactEmail = cmsPolicy?.contactEmail ?? 'kontakt@autocapgroup.se';

  const lastUpdated = cmsPolicy
    ? new Date(cmsPolicy.lastUpdated).toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <main className="min-h-screen bg-white">
      {cmsPolicy && (
        <PolicyChangeBanner version={cmsPolicy.version} lastUpdated={cmsPolicy.lastUpdated} />
      )}
      <section className="w-full bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            {lastUpdated ? `Last updated: ${lastUpdated}` : t('hero.lastUpdated')}
          </p>
          <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
            {cmsPolicy?.heroDescription}
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
                      className={`whitespace-pre-line leading-relaxed ${
                        paragraph.includes('LEGAL CONTENT PENDING') ||
                        paragraph.includes('Placeholder')
                          ? 'italic text-gray-600'
                          : 'text-gray-700'
                      }`}
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
            {cmsPolicy?.contactTitle ?? t('contact.title')}
          </h2>
          <p className="mb-6 leading-relaxed text-gray-700">
            {cmsPolicy?.contactDescription ?? t('contact.description')}
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center text-lg font-semibold text-[#C8102E] transition-colors hover:text-[#A00D25]"
          >
            {contactEmail}
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
