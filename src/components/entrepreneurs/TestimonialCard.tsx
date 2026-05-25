import Image from 'next/image';
import type { Testimonial } from '@/types/testimonial';
import { PhotoPlaceholder } from '@/components/team/PhotoPlaceholder';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md">
      {/* Owner Portrait */}
      <div className="flex justify-center pt-8">
        {testimonial.ownerPhotoUrl ? (
          <Image
            src={testimonial.ownerPhotoUrl}
            alt={`${testimonial.ownerName} from ${testimonial.workshopName}`}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
        ) : (
          <PhotoPlaceholder name={testimonial.ownerName} size="md" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col p-6">
        {/* Quote */}
        <blockquote className="mb-4 text-left text-lg leading-relaxed text-gray-700">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Attribution */}
        <p className="mb-2 text-left font-semibold text-[#1C1C1E]">
          {testimonial.ownerName}, {testimonial.workshopName}
        </p>

        {/* Key Fact */}
        <p className="text-sm font-semibold text-[#C8102E]">{testimonial.keyFact}</p>
      </div>
    </article>
  );
}
