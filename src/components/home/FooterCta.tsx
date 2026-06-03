'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface FooterCtaProps {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
  bgImageUrl?: string | null;
}

export function FooterCta({ headline, subtext, ctaText, ctaLink, bgImageUrl }: FooterCtaProps) {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      {bgImageUrl && <Image src={bgImageUrl} alt="" fill className="object-cover" />}
      {bgImageUrl && <div className="absolute inset-0 bg-black/40" />}
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon Badge */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="rounded-xl bg-[#F5F0EB] p-3">
              <MessageCircle className="h-8 w-8 text-[#C8102E]" strokeWidth={2} />
            </div>
          </div>

          <h2 className="mb-6 text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {headline}
          </h2>

          {/* Decorative Line */}
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

          <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-[#1C1C1E]/70 md:text-2xl">
            {subtext}
          </p>

          <Link
            href={ctaLink}
            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-10 py-5 text-xl font-bold text-white transition-all duration-300 hover:scale-105"
          >
            {ctaText}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
