export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { getStoryPageContent } from '@/lib/cms/story-page';
import { CmsRichText } from '@/components/ui/CmsRichText';
import { PullQuote } from '@/components/about/PullQuote';
import { SteppedTimeline } from '@/components/about/SteppedTimeline';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';
import { cmsMediaUrl } from '@/lib/cms/media';
import { buildMetadata } from '@/lib/cms/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getStoryPageContent(REVALIDATE_HIGH, locale);
  return buildMetadata(
    {
      title: 'Our Story · AutoCap Group',
      description:
        'How two brothers saw an opportunity to build a different kind of tire service group in Sweden.',
    },
    cms.seo,
    locale
  );
}

export default async function StoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cms = await getStoryPageContent(REVALIDATE_HIGH, locale);

  return (
    <main className="min-h-screen">
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#EDE4D8] to-[#F5F0EB] py-20 md:py-32">
        {cmsMediaUrl(cms.heroImage) && (
          <Image
            src={cmsMediaUrl(cms.heroImage)!}
            alt="Our story"
            fill
            className="object-cover"
            priority
          />
        )}
        {cmsMediaUrl(cms.heroImage) && <div className="absolute inset-0 bg-black/30" />}
        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
          <h1
            className={`text-4xl font-black md:text-5xl lg:text-6xl ${cmsMediaUrl(cms.heroImage) ? 'text-white' : 'text-[#1C1C1E]'}`}
          >
            {cms.heroHeadline}
          </h1>
          <div className="mx-auto mt-8 h-1 w-24 bg-[#C8102E]" />
        </div>
      </section>

      <section className="w-full bg-[#F5F0EB] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-black text-[#1C1C1E] md:mb-12 md:text-4xl lg:text-5xl">
            {cms.openingHeadline}
          </h2>
          <div className="prose prose-xl max-w-none text-gray-700">
            <CmsRichText content={cms.openingContent} />
          </div>
        </div>
      </section>

      <PullQuote
        text={cms.pullQuoteText}
        attribution={cms.pullQuoteAttribution}
        title={cms.pullQuoteAttributionTitle}
      />

      <section className="w-full bg-[#EDE4D8] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-black text-[#1C1C1E] md:mb-12 md:text-4xl lg:text-5xl">
            {cms.modelTitle}
          </h2>
          <div className="prose prose-xl max-w-none text-gray-700">
            <CmsRichText content={cms.modelContent} />
          </div>
        </div>
      </section>

      <section className="w-full bg-[#F5F0EB] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-black text-[#1C1C1E] md:mb-12 md:text-4xl lg:text-5xl">
            {cms.visionTitle}
          </h2>
          <div className="prose prose-xl max-w-none text-gray-700">
            <CmsRichText content={cms.visionContent} />
          </div>
        </div>
      </section>

      <section className="w-full bg-[#EDE4D8] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-black text-[#1C1C1E] md:mb-16 md:text-4xl lg:text-5xl">
            {cms.timelineTitle}
          </h2>
          <SteppedTimeline milestones={cms.timelineMilestones} />
        </div>
      </section>
    </main>
  );
}
