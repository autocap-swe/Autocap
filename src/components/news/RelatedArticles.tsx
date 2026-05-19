'use client';

import { useTranslations } from 'next-intl';
import { NewsCard } from './NewsCard';
import type { NewsArticle } from '@/lib/cms/article/types';

interface RelatedArticlesProps {
  articles: NewsArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  const t = useTranslations('news');

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-3xl font-bold text-[#1C1C1E]">{t('relatedReading')}</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
