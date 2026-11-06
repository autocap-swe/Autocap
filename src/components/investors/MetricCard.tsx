'use client';

import { Building2, Users, TrendingUp, Target, MapPin } from 'lucide-react';

interface MetricCardProps {
  metric: {
    value: string;
    label: string;
    icon: string;
  };
  /** @deprecated Ignored; entrance animations were removed. */
  index?: number;
}

export function MetricCard({ metric }: MetricCardProps) {
  // Map icon names to components
  const iconMap = {
    Building2: Building2,
    Users: Users,
    TrendingUp: TrendingUp,
    Target: Target,
    MapPin: MapPin,
  };

  const Icon = iconMap[metric.icon as keyof typeof iconMap];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 md:p-10">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C9D8E8]/0 to-[#C9D8E8]/0 opacity-0 transition-opacity duration-300 hover:from-[#C9D8E8]/10 hover:to-transparent hover:opacity-100" />

      <div className="relative">
        {/* Icon */}
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#C9D8E8]/30">
          <Icon className="h-7 w-7 text-[#C8102E]" />
        </div>

        {/* Value */}
        <div className="mb-3 text-6xl font-black text-[#1C1C1E] md:text-7xl">{metric.value}</div>

        {/* Decorative Line */}
        <div className="mb-4 h-1 w-16 bg-gradient-to-r from-[#C8102E] to-transparent" />

        {/* Label */}
        <p className="text-base font-semibold text-gray-700 md:text-lg">{metric.label}</p>
      </div>
    </div>
  );
}
