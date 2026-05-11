import { setRequestLocale } from 'next-intl/server';
import { getArticlesContent } from '@/lib/cms/article';
import { NewsPageContent } from '@/components/news/NewsPageContent';

export const metadata = {
  title: 'News & Media · AutoCap Group',
  description: 'Company updates, industry insights, and press coverage from AutoCap Group.',
};

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = await getArticlesContent(undefined, locale).catch(() => []);
  return <NewsPageContent articles={articles} />;
}
