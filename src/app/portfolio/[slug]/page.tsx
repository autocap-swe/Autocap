import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin, Calendar, Building2 } from 'lucide-react';
import { getWorkshopsContent, getWorkshopBySlugContent } from '@/lib/cms/workshop';

interface WorkshopDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const workshops = await getWorkshopsContent();
    return workshops.map(workshop => ({ slug: workshop.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: WorkshopDetailPageProps) {
  const { slug } = await params;
  const workshop = await getWorkshopBySlugContent(slug);

  if (!workshop) {
    return {
      title: 'Workshop Not Found',
    };
  }

  return {
    title: `${workshop.name} · AutoCap Group`,
    description: workshop.description,
  };
}

export default async function WorkshopDetailPage({ params }: WorkshopDetailPageProps) {
  const { slug } = await params;
  const workshop = await getWorkshopBySlugContent(slug);

  if (!workshop) {
    notFound();
  }

  return (
    <article className="bg-white">
      {/* Breadcrumb */}
      <nav className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-4 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/portfolio" className="text-gray-500 hover:text-gray-700">
                Portfolio
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="font-medium text-gray-900">{workshop.name}</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        {/* Back link */}
        <Link
          href="/portfolio"
          className="mb-8 inline-flex items-center font-semibold text-[#C8102E] transition-colors hover:text-[#A00D24]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Portfolio
        </Link>

        {/* Workshop Info */}
        <div className="mb-12">
          {/* Icon Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#F5F0EB] px-4 py-2">
            <Building2 className="h-5 w-5 text-[#C8102E]" />
            <span className="text-sm font-semibold text-[#1C1C1E]">Workshop Profile</span>
          </div>

          <h1 className="mb-6 text-5xl font-black text-[#1C1C1E] md:text-6xl lg:text-7xl">
            {workshop.name}
          </h1>

          {/* Decorative Line */}
          <div className="mb-8 h-1 w-24 bg-[#C8102E]" />

          {/* Location */}
          <div className="mb-6 flex items-center gap-2 text-xl text-gray-600">
            <MapPin className="h-5 w-5 text-[#C8102E]" />
            <span>
              {workshop.city}, {workshop.region}
            </span>
          </div>

          {/* Year Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F0EB] px-6 py-3">
            <Calendar className="h-5 w-5 text-[#C8102E]" />
            <span className="text-base font-semibold text-[#1C1C1E]">
              Part of AutoCap Group since {workshop.yearAcquired}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-lg mb-12 max-w-none">
          <p className="text-xl leading-relaxed text-gray-700">{workshop.description}</p>
        </div>

        {/* Standard text from copy deck */}
        <div className="mb-12 rounded-2xl bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] p-10">
          <p className="text-lg leading-relaxed text-gray-700">
            {workshop.name} operates independently under its own brand, serving its local community
            as it always has. As part of AutoCap Group, the team benefits from shared procurement,
            centralised support services, and access to a growing network of workshops across
            Sweden.
          </p>
        </div>

        {/* Website Link */}
        {workshop.localWebsite && (
          <div className="mb-16">
            <a
              href={workshop.localWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-lg font-semibold text-[#C8102E] transition-colors hover:text-[#A00D24]"
            >
              Visit workshop website
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        )}

        {/* CTA */}
        <div className="border-t border-gray-200 pt-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D8E4DC] via-[#C8D5CC] to-[#D8E4DC] p-12 text-center">
            {/* Subtle Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            <div className="relative">
              <h2 className="mb-4 text-3xl font-black text-[#1C1C1E] md:text-4xl">
                Own a tire service workshop?
              </h2>

              <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
                Learn what joining AutoCap Group could mean for you.
              </p>

              <Link
                href="/entrepreneurs"
                className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105"
              >
                For Entrepreneurs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
