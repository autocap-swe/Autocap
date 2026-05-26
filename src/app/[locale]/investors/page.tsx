export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getInvestorsPageContent } from '@/lib/cms/investors-page';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';
import { cmsMediaUrl } from '@/lib/cms/media';

export const metadata: Metadata = {
  title: 'Investors · AutoCap Group',
  description:
    "Consolidating Sweden's fragmented tire service market. Explore the investment case and team.",
};

export default async function InvestorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getInvestorsPageContent(REVALIDATE_HIGH, locale);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {cmsMediaUrl(cms.heroImage) && (
        <Image
          src={cmsMediaUrl(cms.heroImage)!}
          alt="AutoCap investors"
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/15" />
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
              <TrendingUp className="h-12 w-12 text-[#C8102E] md:h-16 md:w-16" strokeWidth={2} />
            </div>
          </div>
          <h1 className="mb-8 text-5xl font-black leading-[1.1] text-white md:text-6xl lg:text-7xl xl:text-8xl">
            {cms.landingHeadline}
          </h1>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white/90 md:text-2xl md:leading-relaxed">
            {cms.landingSubheadline}
          </p>
          {cms.trustIndicator && (
            <div className="mt-16 flex items-center justify-center gap-3 text-sm text-white/80">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="font-medium">{cms.trustIndicator}</span>
            </div>
          )}
          <div className="mt-8">
            <Link
              href={cms.landingCtaLink}
              className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105"
            >
              {cms.landingCtaText}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
