'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Zap,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  Heart,
  type LucideIcon,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface InvestmentPillarProps {
  pillar: {
    id: number;
    icon?: string;
    title: string;
    description: string;
  };
  index: number;
}

const iconMap: Partial<Record<string, LucideIcon>> = {
  Target,
  TrendingUp,
  Zap,
  Users,
  ShoppingCart,
  Settings,
  BarChart3,
  Heart,
};

const fallbackIcons: LucideIcon[] = [Target, TrendingUp, Zap, Users, ShoppingCart, Settings];

export function InvestmentPillar({ pillar, index }: InvestmentPillarProps) {
  const { ref, isInView } = useScrollAnimation({ threshold: 0.2 });

  // Alternate background with subtle gradients
  // Start with Linen White to avoid repeating fjord blue (header is also fjord)
  const bgGradient =
    index % 2 === 0
      ? 'bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3]'
      : 'bg-gradient-to-br from-[#C9D8E8] to-[#B8C7D7]';

  const resolved = pillar.icon ? iconMap[pillar.icon] : undefined;
  const Icon: LucideIcon = resolved ?? fallbackIcons[(pillar.id - 1) % fallbackIcons.length];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`${bgGradient} relative overflow-hidden py-20 md:py-28`}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 md:px-8">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
          {/* Large Number Badge + Icon */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* Number Badge */}
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C8102E] to-[#A00D25] md:h-28 md:w-28">
                <span className="text-5xl font-black text-white md:text-6xl">{pillar.id}</span>
              </div>
              {/* Icon Badge */}
              <div className="absolute -bottom-3 -right-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white">
                <Icon className="h-7 w-7 text-[#C8102E]" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3 className="mb-4 text-3xl font-bold leading-tight text-[#1C1C1E] md:text-4xl lg:text-5xl">
              {pillar.title}
            </h3>
            <p className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {pillar.description}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
