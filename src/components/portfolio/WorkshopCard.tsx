'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import type { Workshop } from '@/lib/cms/workshop/types';
import { WorkshopImagePlaceholder } from './WorkshopImagePlaceholder';

interface WorkshopCardProps {
  workshop: Workshop;
  index?: number;
}

export function WorkshopCard({ workshop, index = 0 }: WorkshopCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
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
          <h3 className="mb-3 text-2xl font-bold text-[#1C1C1E] transition-colors group-hover:text-[#C8102E]">
            {workshop.name}
          </h3>

          {/* Location */}
          <div className="mb-6 flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-[#C8102E]" />
            <span className="text-base">
              {workshop.city}, {workshop.region}
            </span>
          </div>

          {/* Year Badge */}
          <div className="mt-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F0EB] px-4 py-2">
              <Calendar className="h-4 w-4 text-[#C8102E]" />
              <span className="text-sm font-semibold text-[#1C1C1E]">
                Since {workshop.yearAcquired}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
