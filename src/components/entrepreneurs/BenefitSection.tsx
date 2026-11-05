'use client';

import { Store, Users, TrendingUp, Building2, BadgeCheck } from 'lucide-react';

interface BenefitSectionProps {
  benefit: {
    id: number;
    title: string;
    description: string;
  };
  index: number;
}

// Map benefit IDs to icons
const iconMap = {
  1: Store,
  2: Users,
  3: TrendingUp,
  4: Building2,
  5: BadgeCheck,
};

export function BenefitSection({ benefit, index }: BenefitSectionProps) {
  // Alternate background with subtle gradients
  // Start with Linen White to avoid repeating green (header is also green)
  const bgGradient =
    index % 2 === 0
      ? 'bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3]'
      : 'bg-gradient-to-br from-[#D8E4DC] to-[#C8D5CC]';

  const Icon = iconMap[benefit.id as keyof typeof iconMap];

  return (
    <section className={`${bgGradient} relative overflow-hidden py-20 md:py-28`}>
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
                <span className="text-5xl font-black text-white md:text-6xl">{benefit.id}</span>
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
              {benefit.title}
            </h3>
            <p className="text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
              {benefit.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
