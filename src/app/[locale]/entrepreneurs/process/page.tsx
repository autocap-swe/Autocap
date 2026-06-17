import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, CheckCircle2 } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/entrepreneurs/Breadcrumb';
import { ProcessTimeline } from '@/components/entrepreneurs/ProcessTimeline';
import { getAcquisitionProcessContent } from '@/lib/cms/acquisition-process';
import { buildMetadata } from '@/lib/cms/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getAcquisitionProcessContent(undefined, locale).catch(() => null);
  return buildMetadata(
    {
      title: 'How It Works · AutoCap Group',
      description:
        'Our clear, respectful acquisition process from first conversation to completion.',
    },
    cms?.seo,
    locale
  );
}

export default async function ProcessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, acquisitionProcess] = await Promise.all([
    getTranslations('entrepreneurs'),
    getAcquisitionProcessContent(undefined, locale).catch(() => null),
  ]);

  const steps = (acquisitionProcess?.steps ?? []).map(s => ({
    number: s.stepNumber,
    title: s.title,
    description: s.description,
    timeline: '',
  }));

  return (
    <main className="min-h-screen bg-[#F5F0EB]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#D8E4DC] via-[#C8D5CC] to-[#D8E4DC] px-6 py-20 md:px-8 md:py-24">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#C8102E] opacity-10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <Breadcrumb
            items={[
              { label: t('breadcrumb.home'), href: '/' },
              { label: 'Entrepreneurs', href: '/entrepreneurs' },
              { label: t('breadcrumb.howItWorks') },
            ]}
          />
          <div className="mt-8 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md">
              <Clock className="h-5 w-5 text-[#C8102E]" />
              <span className="text-sm font-semibold text-[#C8102E]">{t('processPage.badge')}</span>
            </div>
            <h1 className="mb-6 hyphens-auto break-words text-4xl font-black text-[#1C1C1E] md:text-6xl lg:text-7xl">
              {acquisitionProcess?.heading || t('processPage.title')}
            </h1>
            <div className="mx-auto mb-6 h-1 w-24 bg-[#C8102E]" />
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-700 md:text-2xl">
              {acquisitionProcess?.intro}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <ProcessTimeline steps={steps} />
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 shadow-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold text-[#C8102E]">
                {acquisitionProcess?.totalTimeline}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] px-6 py-20 md:px-8 md:py-28">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8102E] opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <CheckCircle2 className="h-8 w-8 text-[#C8102E]" />
            </div>
          </div>
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl lg:text-6xl">
            {t('processPage.closingTitle')}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
            {t('processPage.closingDescription')}
          </p>
          <Link
            href="/entrepreneurs/contact"
            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105"
          >
            {acquisitionProcess?.ctaText}
          </Link>
        </div>
      </section>
    </main>
  );
}
