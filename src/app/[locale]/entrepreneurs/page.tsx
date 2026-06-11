export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { TestimonialsSection } from '@/components/entrepreneurs/TestimonialsSection';
import { getEntrepreneursPageContent } from '@/lib/cms/entrepreneurs-page';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';
import { cmsMediaUrl } from '@/lib/cms/media';
import { buildMetadata } from '@/lib/cms/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getEntrepreneursPageContent(REVALIDATE_HIGH, locale);
  return buildMetadata(
    {
      title: 'For Workshop Owners · AutoCap Group',
      description:
        'Thinking of selling? AutoCap preserves your brand, keeps your team, and offers fair value.',
    },
    cms.seo,
    locale
  );
}

export default async function EntrepreneursPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getEntrepreneursPageContent(REVALIDATE_HIGH, locale);

  return (
    <main className="relative overflow-hidden">
      <section
        className={`relative overflow-hidden py-20 md:py-28 ${
          !cmsMediaUrl(cms.heroImage) ? 'bg-[#1C1C1E]' : ''
        }`}
      >
        {cmsMediaUrl(cms.heroImage) && (
          <Image
            src={cmsMediaUrl(cms.heroImage)!}
            alt="AutoCap entrepreneurs"
            fill
            className="object-cover"
            priority
          />
        )}
        <div
          className={`absolute inset-0 ${cmsMediaUrl(cms.heroImage) ? 'bg-black/50' : 'bg-black/0'}`}
        />
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center md:px-8">
          <h1 className="mb-8 text-5xl font-black leading-[1.1] text-white md:text-6xl lg:text-7xl xl:text-8xl">
            {cms.landingHeadline}
          </h1>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white/90 md:text-2xl md:leading-relaxed">
            {cms.landingSubheadline}
          </p>
          <Link
            href={cms.landingCtaLink}
            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105"
          >
            {cms.landingCtaText}
          </Link>
          {cms.trustIndicator && (
            <div className="mt-16 flex items-center justify-center gap-3 text-sm text-white/80">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="font-medium">{cms.trustIndicator}</span>
            </div>
          )}
        </div>
      </section>

      <TestimonialsSection />
    </main>
  );
}
