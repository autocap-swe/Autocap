import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getAboutPageContent } from '@/lib/cms/about-page';
import { getKpiTickerContent } from '@/lib/cms/kpi-ticker';
import { getWorkshopsContent } from '@/lib/cms/workshop';
import { KpiTicker } from '@/components/home/KpiTicker';
import { WorkshopMapWrapper } from '@/components/portfolio/WorkshopMapWrapper';
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
    locale,
    { path: '/about', fallbackOgImage: cms.heroImage }
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [cms, kpis, workshops, tPortfolio] = await Promise.all([
    getAboutPageContent(REVALIDATE_HIGH, locale),
    getKpiTickerContent(REVALIDATE_HIGH, locale).catch(() => null),
    getWorkshopsContent(REVALIDATE_HIGH, locale).catch(() => []),
    getTranslations('portfolio'),
  ]);

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
            <h1 className="mb-8 hyphens-manual break-words text-4xl font-black leading-[1.1] text-[#1C1C1E] md:text-6xl lg:text-7xl xl:text-8xl">
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

      {/* "What makes us different" was removed (duplicate of Entrepreneurs/why); key figures and the map show the same point with facts. */}
      {kpis && <KpiTicker kpis={kpis} />}

      {workshops.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4E2DE]">
                <MapPin className="h-6 w-6 text-[#C8102E]" />
              </div>
              <h2 className="text-3xl font-bold text-[#1C1C1E]">{tPortfolio('mapSectionTitle')}</h2>
            </div>
            <WorkshopMapWrapper workshops={workshops} />
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] px-6 py-20 md:px-8 md:py-28">
        {cmsMediaUrl(cms.closingBgImage) && (
          <Image src={cmsMediaUrl(cms.closingBgImage)!} alt="" fill className="object-cover" />
        )}
        {cmsMediaUrl(cms.closingBgImage) && <div className="absolute inset-0 bg-black/60" />}
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8102E] opacity-20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
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
