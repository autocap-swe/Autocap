import type { Metadata } from 'next';
import { Leaf } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sustainabilityContent } from '@/content/sustainability';

export const metadata: Metadata = {
  title: sustainabilityContent.metadata.title,
  description: sustainabilityContent.metadata.description,
};

export default async function SustainabilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('sustainability');

  const focusAreas = sustainabilityContent.whereWeAre.focusAreas.map((_, i) =>
    t(`whereWeAre.focusAreas.${i}`)
  );

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-[#F5F0EB] via-[#E5E0DB] to-[#F5F0EB]">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <div className="relative flex min-h-[85vh] items-center justify-center px-6 py-24 md:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-flex items-center justify-center">
              <div className="rounded-2xl bg-white p-4">
                <Leaf className="h-12 w-12 text-[#C8102E] md:h-16 md:w-16" strokeWidth={2} />
              </div>
            </div>
            <h1 className="mb-8 text-5xl font-black leading-[1.1] text-[#1C1C1E] md:text-6xl lg:text-7xl xl:text-8xl">
              {t('hero.headline')}
            </h1>
            <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {t('hero.intro')}
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {t('whereWeAre.title')}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mb-12 text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
            {t('whereWeAre.description')}
          </p>
          <div>
            <p className="mb-6 text-lg font-bold text-[#1C1C1E] md:text-xl">
              {t('whereWeAre.currentFocusAreas')}
            </p>
            <ul className="space-y-4">
              {focusAreas.map((area, index) => (
                <li
                  key={index}
                  className="flex gap-x-4 text-lg leading-relaxed text-gray-700 md:text-xl"
                >
                  <span
                    className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#C8102E]"
                    aria-hidden="true"
                  />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] via-[#E5E0DB] to-[#F5F0EB] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {t('whereWeAreGoing.title')}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <div className="space-y-6">
            <p className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {t('whereWeAreGoing.description')}
            </p>
            <p className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {t('whereWeAreGoing.statement')}
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {t('governance.title')}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <div className="space-y-6">
            <p className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {t('governance.description')}
            </p>
            <p className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {t('governance.contactText')}{' '}
              <a
                href={`mailto:${sustainabilityContent.governance.contactEmail}`}
                className="font-bold text-[#C8102E] transition-colors hover:text-[#A00D25]"
              >
                {sustainabilityContent.governance.contactEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
