export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Image from 'next/image';
import { Building2, CheckCircle2 } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { getAboutPageContent } from '@/lib/cms/about-page';
import { CmsRichText } from '@/components/ui/CmsRichText';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';
import { cmsMediaUrl } from '@/lib/cms/media';
import { buildMetadata } from '@/lib/cms/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getAboutPageContent(REVALIDATE_HIGH, locale);
  return buildMetadata(
    {
      title: 'About AutoCap Group · Built by entrepreneurs, run with discipline',
      description:
        'Nordic consolidation platform for tire service centres — founder-led, privately held, and built to grow.',
    },
    cms.seo,
    locale
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getAboutPageContent(REVALIDATE_HIGH, locale);

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-[#EDE4D8] via-[#DDD3C8] to-[#EDE4D8]">
        {cmsMediaUrl(cms.heroImage) && (
          <Image
            src={cmsMediaUrl(cms.heroImage)!}
            alt="AutoCap about"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/15" />

        <div className="relative flex min-h-[85vh] items-center justify-center px-6 py-24 md:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-8 inline-flex items-center justify-center">
              <div className="rounded-2xl bg-white p-4">
                <Building2 className="h-12 w-12 text-[#C8102E] md:h-16 md:w-16" strokeWidth={2} />
              </div>
            </div>

            <h1 className="mb-8 text-5xl font-black leading-[1.1] text-[#1C1C1E] md:text-6xl lg:text-7xl xl:text-8xl">
              {cms.heroHeadline}
            </h1>

            <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {cms.heroSubheadline}
            </p>

            {cms.trustIndicator && (
              <div className="mt-16 flex items-center justify-center gap-3 text-sm text-gray-600">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-medium">{cms.trustIndicator}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {cms.storyTitle}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <div className="prose prose-xl max-w-none text-gray-700">
            <CmsRichText content={cms.storyContent} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#EDE4D8] via-[#DDD3C8] to-[#EDE4D8] py-20 md:py-28">
        {cmsMediaUrl(cms.missionBgImage) && (
          <Image src={cmsMediaUrl(cms.missionBgImage)!} alt="" fill className="object-cover" />
        )}
        {cmsMediaUrl(cms.missionBgImage) && <div className="absolute inset-0 bg-black/40" />}
        <div className="relative mx-auto max-w-4xl px-6 text-center md:px-8">
          <h2 className="mb-12 text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {cms.missionTitle}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mb-12 text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
            {cms.missionStatement}
          </p>
          <div className="rounded-2xl bg-white/50 p-8 md:p-12">
            <h3 className="mb-4 text-2xl font-bold text-[#1C1C1E] md:text-3xl">
              {cms.missionOurVisionLabel}
            </h3>
            <p className="text-lg leading-relaxed text-gray-700 md:text-xl">{cms.missionVision}</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] py-20 md:py-28">
        {cmsMediaUrl(cms.differentiatorsBgImage) && (
          <Image
            src={cmsMediaUrl(cms.differentiatorsBgImage)!}
            alt=""
            fill
            className="object-cover"
          />
        )}
        {cmsMediaUrl(cms.differentiatorsBgImage) && (
          <div className="absolute inset-0 bg-black/40" />
        )}
        <div className="relative mx-auto max-w-5xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {cms.differentiatorsSectionTitle}
          </h2>
          <div className="mx-auto mb-12 h-1 w-24 bg-[#C8102E]" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {cms.differentiators.map((item, index) => (
              <div key={index} className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
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
        {cmsMediaUrl(cms.closingBgImage) && (
          <Image src={cmsMediaUrl(cms.closingBgImage)!} alt="" fill className="object-cover" />
        )}
        {cmsMediaUrl(cms.closingBgImage) && <div className="absolute inset-0 bg-black/60" />}
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8102E] opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-[#C8102E]" />
            </div>
          </div>
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl lg:text-6xl">
            {cms.closingTitle}
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
            {cms.closingDescription}
          </p>
        </div>
      </section>
    </main>
  );
}
