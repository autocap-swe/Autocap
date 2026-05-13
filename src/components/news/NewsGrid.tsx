import { NewsCard } from './NewsCard';
import type { NewsArticle } from '@/lib/cms/article/types';

interface NewsGridProps {
  articles: NewsArticle[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  // Sort articles by publishDate descending (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  // Empty state
  if (sortedArticles.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
        <p className="text-xl text-gray-600">No news articles available at the moment.</p>
        <p className="mt-2 text-gray-500">Check back soon for updates!</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {sortedArticles.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
