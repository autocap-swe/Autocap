import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { mediaKitContent } from '@/content/media-kit';
import { AssetDownloadCard } from '@/components/news/AssetDownloadCard';
import { PressContact } from '@/components/news/PressContact';

export const metadata: Metadata = {
  title: mediaKitContent.metadata.title,
  description: mediaKitContent.metadata.description,
};

export default async function MediaKitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('mediaKit');

  const categories = mediaKitContent.categories.map((cat, ci) => ({
    ...cat,
    title: t(`categories.${ci}.title`),
    description: t(`categories.${ci}.description`),
    assets: cat.assets.map((asset, ai) => ({
      ...asset,
      name: t(`categories.${ci}.assets.${ai}.name`),
      description: t(`categories.${ci}.assets.${ai}.description`),
    })),
  }));

  return (
    <main className="min-h-screen">
      <section className="w-full bg-[#F0DADA] py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h1 className="mb-6 text-4xl font-black text-[#1C1C1E] md:text-5xl lg:text-6xl">
            {t('hero.headline')}
          </h1>
          <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
            {t('hero.description')}
          </p>
          <div className="mx-auto mt-8 h-1 w-24 bg-[#C8102E]" />
        </div>
      </section>

      <section className="w-full bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {categories.map((category, index) => (
              <AssetDownloadCard key={index} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <PressContact
            title={t('pressContact.title')}
            description={t('pressContact.description')}
            email={mediaKitContent.pressContact.email}
          />
        </div>
      </section>
    </main>
  );
}
