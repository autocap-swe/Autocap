import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/entrepreneurs/Breadcrumb';
import { InvestmentPillar } from '@/components/investors/InvestmentPillar';
import Image from 'next/image';
import { getInvestmentPillarsContent } from '@/lib/cms/investment-pillars';
import { getInvestorsPageContent } from '@/lib/cms/investors-page';
import { cmsMediaUrl } from '@/lib/cms/media';

export const metadata: Metadata = {
  title: 'Investment Case · AutoCap Group',
  description:
    'Discover the AutoCap investment opportunity: market consolidation, recurring revenue, and operational scale.',
};

export default async function InvestorsWhyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('investors');

  const [pillars, investorsPage] = await Promise.all([
    getInvestmentPillarsContent(undefined, locale).catch(() => []),
    getInvestorsPageContent(undefined, locale).catch(() => null),
  ]);

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#C9D8E8] via-[#B8C7D7] to-[#C9D8E8] px-6 py-20 md:px-8 md:py-24">
        <div className="relative mx-auto max-w-4xl">
          <Breadcrumb
            items={[
              { label: t('breadcrumb.home'), href: '/' },
              { label: 'Investors', href: '/investors' },
              { label: t('breadcrumb.investmentCase') },
            ]}
          />
          <div className="mt-8 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-white px-4 py-2 shadow-md">
              <span className="text-sm font-semibold text-[#C8102E]">
                {pillars.length > 0 ? `${pillars.length} Investment Pillars` : t('whyPage.badge')}
              </span>
            </div>
            <h1 className="mb-6 hyphens-auto break-words text-4xl font-black text-[#1C1C1E] md:text-6xl lg:text-7xl">
              {t('whyPage.title')}
            </h1>
            <div className="mx-auto mb-6 h-1 w-24 bg-[#C8102E]" />
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-700 md:text-2xl">
              {t('whyPage.intro')}{' '}
              <span className="font-bold text-[#C8102E]">{t('whyPage.introBold')}</span>
            </p>
          </div>
        </div>
      </section>

      {pillars.map((pillar, index) => (
        <InvestmentPillar key={pillar.id} pillar={pillar} index={index} />
      ))}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] px-6 py-20 md:px-8 md:py-28">
        {cmsMediaUrl(investorsPage?.closingBgImage) && (
          <Image
            src={cmsMediaUrl(investorsPage?.closingBgImage)!}
            alt=""
            fill
            className="object-cover"
          />
        )}
        {cmsMediaUrl(investorsPage?.closingBgImage) && (
          <div className="absolute inset-0 bg-black/60" />
        )}
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8102E] opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl lg:text-6xl">
            {investorsPage?.closingBlockTitle}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
            {investorsPage?.closingBlockDescription}
          </p>
          <Link
            href="/investors/contact"
            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105"
          >
            {t('whyPage.closingCta')}
          </Link>
        </div>
      </section>
    </main>
  );
}
