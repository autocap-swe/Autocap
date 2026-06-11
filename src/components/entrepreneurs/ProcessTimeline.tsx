'use client';

import { ProcessStep } from './ProcessStep';

interface ProcessTimelineProps {
  steps: Array<{
    number: number;
    title: string;
    description: string;
    timeline: string;
  }>;
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Vertical connecting line */}
      <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#C8102E] via-[#C8102E]/40 to-transparent" />

      <div className="space-y-6 md:space-y-8">
        {steps.map((step, index) => (
          <ProcessStep
            key={step.number}
            step={step}
            index={index}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
