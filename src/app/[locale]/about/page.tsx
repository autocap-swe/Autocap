import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, CheckCircle2 } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { aboutContent } from '@/content/about';
import { ValueCard } from '@/components/about/ValueCard';

export const metadata: Metadata = {
  title: 'About AutoCap Group · Built by entrepreneurs, run with discipline',
  description:
    'Nordic consolidation platform for tire service centres — founder-led, privately held, and built to grow.',
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const storyParagraphs = aboutContent.story.paragraphs.map((_, i) => t(`story.paragraphs.${i}`));

  const values = aboutContent.values.map((v, i) => ({
    ...v,
    title: t(`values.${i}.title`),
    description: t(`values.${i}.description`),
  }));

  const differentiatorItems = aboutContent.differentiators.items.map((item, i) => ({
    ...item,
    title: t(`differentiators.items.${i}.title`),
    description: t(`differentiators.items.${i}.description`),
  }));

  const closingCtas = aboutContent.closing.ctas.map((cta, i) => ({
    ...cta,
    label: t(`closing.ctas.${i}.label`),
  }));

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-[#EDE4D8] via-[#DDD3C8] to-[#EDE4D8]">
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
                <Building2 className="h-12 w-12 text-[#C8102E] md:h-16 md:w-16" strokeWidth={2} />
              </div>
            </div>

            <h1 className="mb-8 text-5xl font-black leading-[1.1] text-[#1C1C1E] md:text-6xl lg:text-7xl xl:text-8xl">
              {t('hero.headline')}
            </h1>

            <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {t('hero.subheadline')}
            </p>

            <div className="mt-16 flex items-center justify-center gap-3 text-sm text-gray-600">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="font-medium">{t('trustIndicator')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {t('story.title')}
          </h2>

          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

          <div className="space-y-6">
            {storyParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#EDE4D8] via-[#DDD3C8] to-[#EDE4D8] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <h2 className="mb-12 text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {t('mission.title')}
          </h2>

          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

          <p className="mb-12 text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
            {t('mission.statement')}
          </p>

          <div className="rounded-2xl bg-white/50 p-8 md:p-12">
            <h3 className="mb-4 text-2xl font-bold text-[#1C1C1E] md:text-3xl">
              {t('mission.ourVision')}
            </h3>
            <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
              {t('mission.vision')}
            </p>
          </div>
        </div>
      </section>

      {values.map((value, index) => (
        <ValueCard key={value.id} value={value} index={index} />
      ))}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {t('differentiators.title')}
          </h2>

          <div className="mx-auto mb-12 h-1 w-24 bg-[#C8102E]" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {differentiatorItems.map(item => (
              <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C8102E]/10">
                  <CheckCircle2 className="h-6 w-6 text-[#C8102E]" strokeWidth={2.5} />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-[#1C1C1E]">{item.title}</h3>
                <p className="text-lg leading-relaxed text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] px-6 py-20 md:px-8 md:py-28">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8102E] opacity-20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-[#C8102E]" />
            </div>
          </div>

          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl lg:text-6xl">
            {t('closing.title')}
          </h2>

          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
            {t('closing.description')}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            {closingCtas.map((cta, index) => (
              <Link
                key={index}
                href={cta.href}
                className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 md:px-10 md:py-5 md:text-xl"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
