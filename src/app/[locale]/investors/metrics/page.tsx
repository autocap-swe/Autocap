import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/entrepreneurs/Breadcrumb';
import { investorsContent } from '@/content/investors';
import { MetricCard } from '@/components/investors/MetricCard';

export const metadata: Metadata = {
  title: 'Growth Metrics · AutoCap Group',
  description: "Track AutoCap's growth from founding to 12 workshops and beyond.",
};

export default async function InvestorsMetricsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('investors');

  const kpis = investorsContent.metrics.kpis.map((m, i) => ({
    ...m,
    label: t(`metrics.kpis.${i}.label`),
  }));

  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#C9D8E8] via-[#B8C7D7] to-[#C9D8E8] px-6 py-20 md:px-8 md:py-24">
        <div className="relative mx-auto max-w-4xl">
          <Breadcrumb
            items={[
              { label: t('breadcrumb.home'), href: '/' },
              { label: 'Investors', href: '/investors' },
              { label: t('breadcrumb.growthMetrics') },
            ]}
          />
          <div className="mt-8 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md">
              <BarChart3 className="h-5 w-5 text-[#C8102E]" />
              <span className="text-sm font-semibold text-[#C8102E]">{t('metricsPage.badge')}</span>
            </div>
            <h1 className="mb-6 text-5xl font-black text-[#1C1C1E] md:text-6xl lg:text-7xl">
              {t('metricsPage.title')}
            </h1>
            <div className="mx-auto mb-6 h-1 w-24 bg-[#C8102E]" />
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-700 md:text-2xl">
              {t('metrics.intro')}
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#E4E2DE] via-[#D8D6D2] to-[#E4E2DE] py-20 md:py-28">
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {kpis.map((metric, index) => (
              <MetricCard key={index} metric={metric} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="mb-6 text-4xl font-black text-[#1C1C1E] md:text-5xl">
            {t('metricsPage.roadAhead')}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mb-12 text-xl leading-relaxed text-gray-700 md:text-2xl">
            {t('metrics.roadmap')}
          </p>
          <Link
            href="/investors/contact"
            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105"
          >
            {t('metricsPage.closingCta')}
          </Link>
        </div>
      </section>
    </main>
  );
}
