import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { investorsContent } from '@/content/investors';

export const metadata = {
  title: 'Investors · AutoCap Group',
  description:
    "Consolidating Sweden's fragmented tire service market. Explore the investment case and team.",
};

export default function InvestorsPage() {
  const { landing } = investorsContent;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 py-24 md:px-8">
        <Image
          src="/images/Investors.webp"
          alt="AutoCap tire workshop"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Icon Badge */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="rounded-2xl bg-white p-4">
              <TrendingUp className="h-12 w-12 text-[#C8102E] md:h-16 md:w-16" strokeWidth={2} />
            </div>
          </div>

          {/* Headline */}
          <h1 className="mb-8 text-5xl font-black leading-[1.1] text-white md:text-6xl lg:text-7xl xl:text-8xl">
            {landing.headline}
          </h1>

          {/* Decorative Line */}
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

          {/* Subheadline */}
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-white md:text-2xl md:leading-relaxed">
            {landing.subheadline}
          </p>

          {/* Trust Indicator */}
          <div className="mt-16 flex items-center justify-center gap-3 text-sm text-white">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-medium">Confidential · Professional · Institutional-grade</span>
          </div>

          {/* CTA Button */}
          <div className="mt-8">
            <Link
              href={landing.ctaLink}
              className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105"
            >
              {landing.ctaText}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
