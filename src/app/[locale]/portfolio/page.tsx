import { MapPin, Building2 } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { WorkshopMapWrapper } from '@/components/portfolio/WorkshopMapWrapper';
import { WorkshopGrid } from '@/components/portfolio/WorkshopGrid';
import { getWorkshopsContent } from '@/lib/cms/workshop';

export const metadata = {
  title: 'Our Portfolio · AutoCap Group',
  description:
    "12 tire service workshops across Sweden. Explore AutoCap Group's growing portfolio.",
};

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [workshops, t] = await Promise.all([
    getWorkshopsContent(undefined, locale).catch(() => []),
    getTranslations('portfolio'),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#E4E2DE] via-[#D8D6D2] to-[#E4E2DE] py-20 md:py-28">
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
            <Building2 className="h-5 w-5 text-[#C8102E]" />
            <span className="text-sm font-semibold text-[#C8102E]">{t('badge')}</span>
          </div>

          <h1 className="mb-6 text-5xl font-black text-[#1C1C1E] md:text-6xl lg:text-7xl">
            {t('title')}
          </h1>

          <div className="mb-8 h-1 w-24 bg-[#C8102E]" />

          <p className="max-w-3xl text-xl leading-relaxed text-gray-700 md:text-2xl">
            {t('description')}
          </p>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E4E2DE]">
              <MapPin className="h-6 w-6 text-[#C8102E]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1C1C1E]">{t('mapSectionTitle')}</h2>
          </div>

          <WorkshopMapWrapper workshops={workshops} />
        </div>
      </section>

      <WorkshopGrid workshops={workshops} />
    </>
  );
}
