import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Building2, CheckCircle2 } from 'lucide-react';
import { aboutContent } from '@/content/about';
import { ValueCard } from '@/components/about/ValueCard';

export const metadata: Metadata = {
  title: 'About AutoCap Group · Built by entrepreneurs, run with discipline',
  description:
    'Nordic consolidation platform for tire service centres — founder-led, privately held, and built to grow.',
};

export default function AboutPage() {
  const { hero, story, mission, values, differentiators, closing } = aboutContent;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] overflow-hidden">
        <Image
          src="/images/Company%20Overview.webp"
          alt="AutoCap company overview"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative flex min-h-[85vh] items-center justify-center px-6 py-24 md:px-8">
          <div className="mx-auto max-w-5xl text-center">
            {/* Icon Badge */}
            <div className="mb-8 inline-flex items-center justify-center">
              <div className="rounded-2xl bg-white p-4">
                <Building2 className="h-12 w-12 text-[#C8102E] md:h-16 md:w-16" strokeWidth={2} />
              </div>
            </div>

            {/* Headline */}
            <h1 className="mb-8 text-5xl font-black leading-[1.1] text-white md:text-6xl lg:text-7xl xl:text-8xl">
              {hero.headline}
            </h1>

            {/* Decorative Line */}
            <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

            {/* Subheadline */}
            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white md:text-2xl md:leading-relaxed">
              {hero.subheadline}
            </p>

            {/* Trust Indicator */}
            <div className="mt-16 flex items-center justify-center gap-3 text-sm text-white">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="font-medium">12 Workshops · ~50 Employees · ~200 MSEK Revenue</span>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {story.title}
          </h2>

          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

          <div className="space-y-6">
            {story.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#EDE4D8] via-[#DDD3C8] to-[#EDE4D8] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center md:px-8">
          <h2 className="mb-12 text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {mission.title}
          </h2>

          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

          <p className="mb-12 text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
            {mission.statement}
          </p>

          {/* Vision */}
          <div className="rounded-2xl bg-white/50 p-8 md:p-12">
            <h3 className="mb-4 text-2xl font-bold text-[#1C1C1E] md:text-3xl">Our Vision</h3>
            <p className="text-lg leading-relaxed text-gray-700 md:text-xl">{mission.vision}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      {values.map((value, index) => (
        <ValueCard key={value.id} value={value} index={index} />
      ))}

      {/* Differentiators */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] py-20 md:py-28">
        <div className="mx-auto max-w-5xl px-6 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {differentiators.title}
          </h2>

          <div className="mx-auto mb-12 h-1 w-24 bg-[#C8102E]" />

          {/* Differentiators Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {differentiators.items.map(item => (
              <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
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

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] px-6 py-20 md:px-8 md:py-28">
        {/* Decorative Glow */}
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8102E] opacity-20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Building2 className="h-8 w-8 text-[#C8102E]" />
            </div>
          </div>

          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl lg:text-6xl">
            {closing.title}
          </h2>

          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-300 md:text-2xl">
            {closing.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            {closing.ctas.map((cta, index) => (
              <Link
                key={index}
                href={cta.href}
                className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 md:px-10 md:py-5 md:text-xl"
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
