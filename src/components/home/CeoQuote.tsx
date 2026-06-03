'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface CeoQuoteProps {
  text: string;
  attribution: string;
  bgImageUrl?: string | null;
}

export function CeoQuote({ text, attribution, bgImageUrl }: CeoQuoteProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] via-[#EDE8E3] to-[#F5F0EB] py-24 md:py-32">
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

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Quote Icon */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="rounded-xl bg-white p-3">
              <Quote className="h-8 w-8 text-[#C8102E]" strokeWidth={2} />
            </div>
          </div>

          <blockquote>
            <p className="mb-8 text-3xl font-bold leading-relaxed text-[#1C1C1E] md:text-4xl md:leading-relaxed lg:text-5xl lg:leading-relaxed">
              &ldquo;{text}&rdquo;
            </p>

            {/* Decorative Line */}
            <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

            <footer className="text-xl font-semibold text-[#1C1C1E]/70">— {attribution}</footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
