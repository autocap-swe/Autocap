import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { storyContent } from '@/content/story';
import { StorySection } from '@/components/about/StorySection';
import { PullQuote } from '@/components/about/PullQuote';
import { SteppedTimeline } from '@/components/about/SteppedTimeline';

export const metadata: Metadata = {
  title: storyContent.metadata.title,
  description: storyContent.metadata.description,
};

export default async function StoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('story');

  const openingParagraphs = storyContent.opening.paragraphs.map((_, i) =>
    t(`opening.paragraphs.${i}`)
  );
  const modelParagraphs = storyContent.model.paragraphs.map((_, i) => t(`model.paragraphs.${i}`));
  const visionParagraphs = storyContent.vision.paragraphs.map((_, i) =>
    t(`vision.paragraphs.${i}`)
  );
  const milestones = storyContent.timeline.milestones.map((m, i) => ({
    ...m,
    year: t(`timeline.milestones.${i}.year`),
    title: t(`timeline.milestones.${i}.title`),
    description: t(`timeline.milestones.${i}.description`),
  }));

  return (
    <main className="min-h-screen">
      <section className="w-full bg-gradient-to-br from-[#EDE4D8] to-[#F5F0EB] py-20 md:py-32">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <h1 className="text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {t('hero.headline')}
          </h1>
          <div className="mx-auto mt-8 h-1 w-24 bg-[#C8102E]" />
        </div>
      </section>

      <section className="w-full bg-[#F5F0EB] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-black text-[#1C1C1E] md:mb-12 md:text-4xl lg:text-5xl">
            {t('opening.headline')}
          </h2>
          <div className="space-y-6">
            {openingParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg leading-relaxed text-gray-700 md:text-xl md:leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <PullQuote
        text={t('opening.quote.text')}
        attribution={t('opening.quote.attribution')}
        title={t('opening.quote.title')}
      />

      <StorySection title={t('model.title')} paragraphs={modelParagraphs} background="dusk" />
      <StorySection title={t('vision.title')} paragraphs={visionParagraphs} background="linen" />

      <section className="w-full bg-[#EDE4D8] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-black text-[#1C1C1E] md:mb-16 md:text-4xl lg:text-5xl">
            {t('timeline.title')}
          </h2>
          <SteppedTimeline milestones={milestones} />
        </div>
      </section>
    </main>
  );
}
