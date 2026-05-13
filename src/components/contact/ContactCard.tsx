import Link from 'next/link';
import type { ContactCardData } from '@/lib/cms/contact/types';

export function ContactCard({ title, description, ctaText, ctaLink, bgColor }: ContactCardData) {
  return (
    <Link
      href={ctaLink}
      className={`block rounded-lg ${bgColor} p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}
    >
      <h2 className="mb-4 text-2xl font-bold text-[#1C1C1E]">{title}</h2>
      <p className="mb-6 text-lg leading-relaxed text-gray-700">{description}</p>
      <span className="inline-block font-semibold text-[#C8102E] hover:underline">{ctaText}</span>
    </Link>
  );
}
