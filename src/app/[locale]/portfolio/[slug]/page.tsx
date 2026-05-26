import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getWorkshopsContent, getWorkshopBySlugContent } from '@/lib/cms/workshop';
import { WorkshopHero } from '@/components/portfolio/WorkshopHero';

interface WorkshopDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const workshops = await getWorkshopsContent().catch(() => []);
  return workshops.map(workshop => ({ slug: workshop.slug }));
}

export async function generateMetadata({ params }: WorkshopDetailPageProps) {
  const { locale, slug } = await params;
  const workshop = await getWorkshopBySlugContent(slug, undefined, locale).catch(() => null);

  if (!workshop) {
    return { title: 'Workshop Not Found' };
  }

  return {
    title: `${workshop.name} · AutoCap Group`,
    description: workshop.description,
  };
}

export default async function WorkshopDetailPage({ params }: WorkshopDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [workshop, t] = await Promise.all([
    getWorkshopBySlugContent(slug, undefined, locale).catch(() => null),
    getTranslations('portfolio'),
  ]);

  if (!workshop) {
    notFound();
  }

  return (
    <article className="bg-white">
      <WorkshopHero
        name={workshop.name}
        city={workshop.city}
        region={workshop.region}
        imageUrl={workshop.imageUrl ?? null}
        workshopProfileBadge={t('detail.workshopProfileBadge')}
      />

      {/* Breadcrumb */}
      <nav className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-4 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                {t('detail.breadcrumbHome')}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/portfolio" className="text-gray-500 hover:text-gray-700">
                {t('detail.breadcrumbPortfolio')}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="font-medium text-gray-900">{workshop.name}</li>
          </ol>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-20">
        <Link
          href="/portfolio"
          className="mb-8 inline-flex items-center font-semibold text-[#C8102E] transition-colors hover:text-[#A00D24]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          {t('detail.backToPortfolio')}
        </Link>

        <div className="mb-12 flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F0EB] px-6 py-3">
            <Calendar className="h-5 w-5 text-[#C8102E]" />
            <span className="text-base font-semibold text-[#1C1C1E]">
              {t('detail.partOfGroupSince', { year: workshop.yearAcquired })}
            </span>
          </div>

          {workshop.localWebsite && (
            <a
              href={workshop.localWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-base font-semibold text-[#C8102E] transition-colors hover:text-[#A00D24]"
            >
              {t('detail.visitWebsite')}
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="prose prose-lg mb-12 max-w-none">
          <p className="text-xl leading-relaxed text-gray-700">{workshop.description}</p>
        </div>

        <div className="mb-12 rounded-2xl bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] p-10">
          <p className="text-lg leading-relaxed text-gray-700">
            {t('detail.groupBlurb', { name: workshop.name })}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D8E4DC] via-[#C8D5CC] to-[#D8E4DC] p-12 text-center">
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
                {t('detail.ctaTitle')}
              </h2>

              <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-700">
                {t('detail.ctaDescription')}
              </p>

              <Link
                href="/entrepreneurs"
                className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105"
              >
                {t('detail.ctaButton')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
