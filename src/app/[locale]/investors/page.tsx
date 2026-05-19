import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { investorsContent } from '@/content/investors';

export const metadata = {
  title: 'Investors · AutoCap Group',
  description:
    "Consolidating Sweden's fragmented tire service market. Explore the investment case and team.",
};

export default async function InvestorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('investors');

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#C9D8E8] via-[#B8C7D7] to-[#C9D8E8]">
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
          <h1 className="mb-8 text-5xl font-black leading-[1.1] text-[#1C1C1E] md:text-6xl lg:text-7xl xl:text-8xl">
            {t('landing.headline')}
          </h1>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
            {t('landing.subheadline')}
          </p>
          <div className="mt-16 flex items-center justify-center gap-3 text-sm text-gray-600">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-medium">{t('trustIndicator')}</span>
          </div>
          <div className="mt-8">
            <Link
              href={investorsContent.landing.ctaLink}
              className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105"
            >
              {t('landing.ctaText')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
