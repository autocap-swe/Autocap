'use client';

import { useEffect } from 'react';
import { Building2, Users, TrendingUp, Target } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Kpi {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface KpiTickerProps {
  kpis: Kpi[];
}

const iconMap = [Building2, Users, TrendingUp, Target];

function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const counter = useCountUp({
    end: kpi.value,
    duration: 2000,
    prefix: kpi.prefix,
    suffix: kpi.suffix,
  });

  const { ref, isInView } = useScrollAnimation({ threshold: 0.3 });

  useEffect(() => {
    if (isInView && !counter.hasAnimated) {
      counter.animate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, counter.hasAnimated, counter.animate]);

  const Icon = iconMap[index];

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="group relative flex min-w-0 flex-col items-center p-6 text-center xl:p-8"
    >
      {/* Icon Badge */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10">
        <Icon className="h-8 w-8 text-[#C8102E]" strokeWidth={2} />
      </div>

      {/* Counter */}
      <div className="mb-3 whitespace-nowrap text-4xl font-black text-white md:text-5xl xl:text-6xl">
        {counter.value}
      </div>

      {/* Decorative Line */}
      <div className="mb-4 h-1 w-16 bg-[#C8102E] opacity-60" />

      {/* Label */}
      <div className="w-full break-words text-base leading-relaxed text-gray-400">{kpi.label}</div>
    </div>
  );
}

export function KpiTicker({ kpis }: KpiTickerProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] py-20 md:py-28">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi, index) => (
            <KpiCard key={index} kpi={kpi} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
