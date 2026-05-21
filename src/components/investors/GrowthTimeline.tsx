import type { GrowthMilestone } from '@/types/investors';
import { CheckCircle2, Circle } from 'lucide-react';

interface GrowthTimelineProps {
  milestones: readonly GrowthMilestone[];
}

export function GrowthTimeline({ milestones }: GrowthTimelineProps) {
  return (
    <div className="space-y-8">
      {milestones.map(milestone => {
        const isCompleted = milestone.status === 'completed';
        const Icon = isCompleted ? CheckCircle2 : Circle;

        return (
          <div key={milestone.period} className="flex gap-6">
            {/* Icon */}
            <div className="flex-shrink-0">
              <Icon
                className={`h-8 w-8 ${isCompleted ? 'text-[#C8102E]' : 'text-gray-400'}`}
                strokeWidth={2}
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div
                className={`mb-2 text-lg font-bold ${
                  isCompleted ? 'text-[#C8102E]' : 'text-gray-600'
                } md:text-xl`}
              >
                {milestone.period}
              </div>
              <p className="text-base leading-relaxed text-gray-700 md:text-lg">
                {milestone.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
