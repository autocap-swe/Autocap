'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { MapPin, Calendar } from 'lucide-react';
import type { Workshop } from '@/lib/cms/workshop/types';
import { WorkshopImagePlaceholder } from './WorkshopImagePlaceholder';

interface WorkshopCardProps {
  workshop: Workshop;
  /** @deprecated Ignored; entrance animations were removed. */
  index?: number;
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  const t = useTranslations('portfolio.card');

  return (
    <div>
      <Link
        href={`/portfolio/${workshop.slug}`}
        className="group relative block h-full overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-[#C8102E]/20 hover:shadow-xl"
      >
        {/* Image Section */}
        <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-[#F0DADA]">
          {workshop.imageUrl ? (
            <Image
              src={workshop.imageUrl}
              alt={workshop.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <WorkshopImagePlaceholder />
          )}
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8102E]/0 to-[#C8102E]/0 opacity-0 transition-opacity duration-300 group-hover:from-[#C8102E]/5 group-hover:to-transparent group-hover:opacity-100" />

        <div className="relative flex flex-col p-8">
          {/* Workshop Name */}
          <h3 className="mb-3 line-clamp-2 break-words text-xl font-bold text-[#1C1C1E] transition-colors group-hover:text-[#C8102E] sm:text-2xl">
            {workshop.name}
          </h3>

          {/* Location */}
          <div className="mb-6 flex min-w-0 items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 shrink-0 text-[#C8102E]" />
            <span className="truncate text-base">
              {workshop.city}, {workshop.region}
            </span>
          </div>

          {/* Founded / In the group since */}
          <dl className="mt-auto flex flex-wrap gap-2">
            {workshop.yearFounded ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F0EB] px-4 py-2">
                <dt className="text-sm text-gray-600">{t('founded')}</dt>
                <dd className="text-sm font-semibold text-[#1C1C1E]">{workshop.yearFounded}</dd>
              </div>
            ) : null}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F0EB] px-4 py-2">
              <Calendar className="h-4 w-4 text-[#C8102E]" aria-hidden="true" />
              <dt className="text-sm text-gray-600">{t('inGroupSince')}</dt>
              <dd className="text-sm font-semibold text-[#1C1C1E]">{workshop.yearAcquired}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </div>
  );
}
