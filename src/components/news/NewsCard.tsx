'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { formatLongDate } from '@/lib/format-date';
import { NewsCategoryBadge } from './NewsCategoryBadge';
import { NewsImagePlaceholder } from './NewsImagePlaceholder';
import type { NewsArticle } from '@/lib/cms/article/types';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const t = useTranslations('news');

  const locale = useLocale();
  const formatDate = (dateString: string): string => formatLongDate(dateString, locale);

  return (
    <Link href={`/news/${article.slug}`} className="block w-full cursor-pointer">
      <article
        className={cn(
          'group flex h-full flex-col overflow-hidden rounded-lg border-2 border-gray-200 bg-white',
          'transition-all duration-300 hover:-translate-y-1 hover:border-[#C8102E]'
        )}
        style={{
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        }}
      >
        {/* Image Section */}
        <div className="relative aspect-video w-full overflow-hidden">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <NewsImagePlaceholder />
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-6">
          {/* Category Badge */}
          <div className="mb-3">
            <NewsCategoryBadge category={article.category} />
          </div>

          {/* Title */}
          <h2 className="mb-3 text-xl font-bold text-[#1C1C1E] line-clamp-2">{article.title}</h2>

          {/* Excerpt */}
          <p className="mb-4 text-gray-600 line-clamp-3">{article.excerpt}</p>

          {/* Footer */}
          <div className="mt-auto flex flex-col gap-0.5 text-sm text-gray-600">
            <span className="truncate font-medium">{article.author}</span>
            <div className="flex items-center">
              <span>{formatDate(article.publishDate)}</span>
              <span className="mx-2">•</span>
              <span>{t('minRead', { minutes: article.readTimeMinutes })}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
