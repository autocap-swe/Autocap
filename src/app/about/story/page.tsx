import type { Metadata } from 'next';
import Image from 'next/image';
import { storyContent } from '@/content/story';
import { StorySection } from '@/components/about/StorySection';
import { PullQuote } from '@/components/about/PullQuote';
import { SteppedTimeline } from '@/components/about/SteppedTimeline';

export const metadata: Metadata = {
  title: storyContent.metadata.title,
  description: storyContent.metadata.description,
};

export default function StoryPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden py-20 md:py-32">
        <Image
          src="/images/Our%20Story.webp"
          alt="AutoCap our story"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
          <h1 className="text-4xl font-black text-white md:text-5xl lg:text-6xl">
            {storyContent.hero.headline}
          </h1>
          <div className="mx-auto mt-8 h-1 w-24 bg-[#C8102E]" />
        </div>
      </section>

      {/* Opening Section */}
      <section className="w-full bg-[#F5F0EB] py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-black text-[#1C1C1E] md:mb-12 md:text-4xl lg:text-5xl">
            {storyContent.opening.headline}
          </h2>
          <div className="space-y-6">
            {storyContent.opening.paragraphs.map((paragraph, index) => (
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

      {/* Pull Quote */}
      <PullQuote
        text={storyContent.opening.quote.text}
        attribution={storyContent.opening.quote.attribution}
        title={storyContent.opening.quote.title}
      />

      {/* Model Section - Dusk background */}
      <StorySection
        title={storyContent.model.title}
        paragraphs={storyContent.model.paragraphs}
        background="dusk"
      />

      {/* Vision Section - Linen background */}
      <StorySection
        title={storyContent.vision.title}
        paragraphs={storyContent.vision.paragraphs}
        background="linen"
      />

      {/* Timeline Section */}
      <section className="w-full bg-[#EDE4D8] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-black text-[#1C1C1E] md:mb-16 md:text-4xl lg:text-5xl">
            {storyContent.timeline.title}
          </h2>
          <SteppedTimeline milestones={storyContent.timeline.milestones} />
        </div>
      </section>
    </main>
  );
}
