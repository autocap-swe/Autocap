'use client';

import { useTranslations } from 'next-intl';
import { NewsCard } from './NewsCard';
import type { NewsArticle } from '@/lib/cms/article/types';

interface NewsGridProps {
  articles: NewsArticle[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  const t = useTranslations('news');

  const sortedArticles = [...articles].sort((a, b) => {
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  if (sortedArticles.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
        <p className="text-xl text-gray-600">{t('emptyState')}</p>
        <p className="mt-2 text-gray-500">{t('emptyStateSubtext')}</p>
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
