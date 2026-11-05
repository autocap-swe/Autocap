import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/cms/seo';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getArticlesContent } from '@/lib/cms/article';
import { NewsPageContent } from '@/components/news/NewsPageContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seoPages.news' });
  return buildMetadata({ title: t('title'), description: t('description') }, null, locale, {
    path: '/news',
  });
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = await getArticlesContent(undefined, locale).catch(() => []);
  return <NewsPageContent articles={articles} />;
}
