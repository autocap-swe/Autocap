export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Image from 'next/image';
import { Leaf } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getSustainabilityPageContent } from '@/lib/cms/sustainability-page';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';
import { cmsMediaUrl } from '@/lib/cms/media';
import { buildMetadata } from '@/lib/cms/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getSustainabilityPageContent(REVALIDATE_HIGH, locale);
  return buildMetadata(
    {
      title: 'Sustainability · AutoCap Group',
      description:
        'Our commitment to environmental responsibility across the Nordic tire services platform. Practical steps, honest progress towards sustainability targets.',
    },
    cms.seo,
    locale
  );
}

export default async function SustainabilityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getSustainabilityPageContent(REVALIDATE_HIGH, locale);

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[85vh] overflow-hidden">
        {cmsMediaUrl(cms.heroImage) && (
          <Image
            src={cmsMediaUrl(cms.heroImage)!}
            alt="AutoCap sustainability"
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
                <Leaf className="h-12 w-12 text-[#C8102E] md:h-16 md:w-16" strokeWidth={2} />
              </div>
            </div>
            <h1 className="mb-8 text-5xl font-black leading-[1.1] text-white md:text-6xl lg:text-7xl xl:text-8xl">
              {cms.heroHeadline}
            </h1>
            <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/90 md:text-2xl md:leading-relaxed">
              {cms.heroIntro}
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {cms.whereWeAreTitle}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mb-12 text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
            {cms.whereWeAreDescription}
          </p>
          <div>
            <p className="mb-6 text-lg font-bold text-[#1C1C1E] md:text-xl">
              {cms.whereWeAreCurrentFocusLabel}
            </p>
            <ul className="space-y-4">
              {cms.whereWeAreFocusAreas.map((area, index) => (
                <li
                  key={index}
                  className="flex gap-x-4 text-lg leading-relaxed text-gray-700 md:text-xl"
                >
                  <span
                    className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#C8102E]"
                    aria-hidden="true"
                  />
                  <span>{area.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] via-[#E5E0DB] to-[#F5F0EB] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {cms.whereWeAreGoingTitle}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <div className="space-y-6">
            <p className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {cms.whereWeAreGoingDescription}
            </p>
            <p className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {cms.whereWeAreGoingStatement}
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {cms.governanceTitle}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <div className="space-y-6">
            <p className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {cms.governanceDescription}
            </p>
            <p className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {cms.governanceContactText}{' '}
              <a
                href={`mailto:${cms.governanceContactEmail}`}
                className="font-bold text-[#C8102E] transition-colors hover:text-[#A00D25]"
              >
                {cms.governanceContactEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
