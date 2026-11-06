'use client';

import { TimelineMilestone } from './TimelineMilestone';
import { cn } from '@/lib/utils';

interface SteppedTimelineProps {
  milestones: Array<{
    year: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'future';
  }>;
}

export function SteppedTimeline({ milestones }: SteppedTimelineProps) {
  // Calculate gradient stops based on milestone statuses
  const getGradientStops = () => {
    const totalMilestones = milestones.length;

    if (totalMilestones === 0) return 'from-gray-300 to-gray-300';

    // Gradient from red (completed) through red (current) to gray (future)
    return `from-[#C8102E] via-[#C8102E] to-gray-300`;
  };

  if (milestones.length === 0) {
    return (
      <div data-testid="timeline-container" className="relative mx-auto max-w-6xl">
        <p className="text-center text-gray-500">No milestones to display</p>
      </div>
    );
  }

  return (
    <div
      data-testid="timeline-container"
      className="relative mx-auto max-w-6xl space-y-16 md:space-y-20"
    >
      {/* Timeline Spine (vertical line) - visible on mobile and desktop */}
      <div
        data-testid="timeline-spine"
        className={cn(
          'absolute left-8 top-0 z-0 block h-full w-1 md:left-1/2 md:-translate-x-1/2',
          'bg-gradient-to-b',
          getGradientStops()
        )}
        aria-hidden="true"
      />

      {/* Milestones */}
      {milestones.map((milestone, index) => {
        const isEven = index % 2 === 0;
        const alignment = isEven ? 'left' : 'right';

        return (
          <div
            key={index}
            data-testid={`milestone-wrapper-${index}`}
            className={cn(
              'relative flex flex-col',
              'md:flex-row md:justify-start',
              !isEven && 'md:justify-end'
            )}
          >
            {/* Horizontal Connector Line (desktop only) */}
            <div
              data-testid={`connector-${index}`}
              className={cn(
                'absolute top-8 z-10 hidden h-0.5 w-16 md:block',
                isEven ? 'left-1/2 ml-0.5' : 'right-1/2 mr-0.5',
                milestone.status === 'future'
                  ? 'border-b-2 border-dashed border-gray-300 bg-transparent'
                  : 'border-b-2 border-[#C8102E] bg-transparent'
              )}
              aria-hidden="true"
            />

            {/* Milestone Card - max width on desktop to create alternating layout */}
            <div className="w-full md:w-[calc(50%-4rem)]">
              <TimelineMilestone milestone={milestone} index={index} alignment={alignment} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
