'use client';

import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import type { AudienceCard } from '@/content/homepage';

interface AudienceCardsProps {
  cards: AudienceCard[];
}

export function AudienceCards({ cards }: AudienceCardsProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={card.ctaLink}
                className="group block h-full rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: card.backgroundColor }}
              >
                <div className="flex h-full flex-col">
                  <h3 className="text-2xl font-bold text-[#1C1C1E] mb-4">{card.headline}</h3>
                  <p className="text-[#1C1C1E]/80 leading-relaxed mb-6 flex-grow">
                    {card.description}
                  </p>
                  <div className="text-[#C8102E] font-semibold group-hover:translate-x-1 transition-transform duration-200">
                    {card.ctaText}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
