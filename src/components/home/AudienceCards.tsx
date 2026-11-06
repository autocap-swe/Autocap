'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
interface AudienceCard {
  headline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
  imageUrl?: string;
}

interface AudienceCardsProps {
  cards: AudienceCard[];
}

export function AudienceCards({ cards }: AudienceCardsProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <div key={index}>
              <Link
                href={card.ctaLink}
                className="group flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: card.backgroundColor }}
              >
                {card.imageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={card.imageUrl}
                      alt={card.headline}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex flex-grow flex-col p-8">
                  <h3 className="mb-4 text-2xl font-bold text-[#1C1C1E]">{card.headline}</h3>
                  <p className="mb-6 flex-grow leading-relaxed text-[#1C1C1E]/80">
                    {card.description}
                  </p>
                  <div className="font-semibold text-[#C8102E] transition-transform duration-200 group-hover:translate-x-1">
                    {card.ctaText}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
