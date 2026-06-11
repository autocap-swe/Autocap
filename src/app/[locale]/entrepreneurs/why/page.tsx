export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/entrepreneurs/Breadcrumb';
import { BenefitSection } from '@/components/entrepreneurs/BenefitSection';
import Image from 'next/image';
import { getEntrepreneursPageContent } from '@/lib/cms/entrepreneurs-page';
import { cmsMediaUrl } from '@/lib/cms/media';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';

export const metadata: Metadata = {
  title: 'Why AutoCap · For Workshop Owners',
  description: 'Discover what makes AutoCap different from selling to a chain.',
};

export default async function WhyAutoCapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [cms, t] = await Promise.all([
    getEntrepreneursPageContent(REVALIDATE_HIGH, locale),
    getTranslations('entrepreneurs'),
  ]);

  const benefits = cms.benefits.map((b, i) => ({
    id: i + 1,
    title: b.title,
    description: b.description,
  }));

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#D8E4DC] via-[#C8D5CC] to-[#D8E4DC] px-6 py-20 md:px-8 md:py-24">
        <div className="relative mx-auto max-w-4xl">
          <Breadcrumb
            items={[
              { label: t('breadcrumb.home'), href: '/' },
              { label: t('breadcrumb.entrepreneurs'), href: '/entrepreneurs' },
              { label: cms.whyPageTitle },
            ]}
          />
          <div className="mt-8 text-center">
            {cms.whyPageBadge && (
              <div className="mb-6 inline-flex items-center rounded-full bg-white px-4 py-2 shadow-md">
                <span className="text-sm font-semibold text-[#C8102E]">{cms.whyPageBadge}</span>
              </div>
            )}
            <h1 className="mb-6 text-5xl font-black text-[#1C1C1E] md:text-6xl lg:text-7xl">
              {cms.whyPageTitle}
            </h1>
            <div className="mx-auto mb-6 h-1 w-24 bg-[#C8102E]" />
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-700 md:text-2xl">
              {cms.whyPageIntro}{' '}
              <span className="font-bold text-[#C8102E]">{cms.whyPageIntroBold}</span>
            </p>
          </div>
        </div>
      </section>

      {benefits.map((benefit, index) => (
        <BenefitSection key={benefit.id} benefit={benefit} index={index} />
      ))}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] px-6 py-20 md:px-8 md:py-28">
        {cmsMediaUrl(cms.closingBgImage) && (
          <Image src={cmsMediaUrl(cms.closingBgImage)!} alt="" fill className="object-cover" />
        )}
        {cmsMediaUrl(cms.closingBgImage) && <div className="absolute inset-0 bg-black/60" />}
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8102E] opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl lg:text-6xl">
            {cms.closingBlockTitle}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
            {cms.closingBlockDescription}
          </p>
          <Link
            href="/entrepreneurs/contact"
            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105"
          >
            {cms.whyPageClosingCta}
          </Link>
        </div>
      </section>
    </main>
  );
}
