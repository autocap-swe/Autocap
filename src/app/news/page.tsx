import { getArticlesContent } from '@/lib/cms/article';
import { NewsPageContent } from '@/components/news/NewsPageContent';

export const metadata = {
  title: 'News & Media · AutoCap Group',
  description: 'Company updates, industry insights, and press coverage from AutoCap Group.',
};

export default async function NewsPage() {
  const articles = await getArticlesContent().catch(() => []);
  return <NewsPageContent articles={articles} />;
}
