import { getTranslations } from 'next-intl/server';
import { testimonialsContent } from '@/content/testimonials';
import { TestimonialCard } from './TestimonialCard';

export async function TestimonialsSection() {
  const t = await getTranslations('testimonials');

  const testimonials = testimonialsContent.testimonials.map(testimonial => ({
    ...testimonial,
    quote: t(`${testimonial.id}.quote`),
    keyFact: t(`${testimonial.id}.keyFact`),
  }));

  return (
    <section className="bg-[#F5F0EB] px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-center text-4xl font-black text-[#1C1C1E] md:text-5xl">
          {t('sectionTitle')}
        </h2>

        <div className="mx-auto mb-12 h-1 w-24 bg-[#C8102E]" />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
