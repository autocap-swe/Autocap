'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NewsCategoryBadge } from './NewsCategoryBadge';
import { NewsImagePlaceholder } from './NewsImagePlaceholder';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { NewsArticle } from '@/lib/cms/article/types';
import { cn } from '@/lib/utils';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const { ref, isInView } = useScrollAnimation();

  // Format date to human-readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/news/${article.slug}`} className="cursor-pointer">
      <article
        ref={ref as React.RefObject<HTMLElement>}
        className={cn(
          'group overflow-hidden rounded-lg border-2 border-gray-200 bg-white',
          'transition-all duration-300 hover:-translate-y-1 hover:border-[#C8102E]',
          'opacity-0 translate-y-4',
          isInView && 'opacity-100 translate-y-0'
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
        <div className="p-6">
          {/* Category Badge */}
          <div className="mb-3">
            <NewsCategoryBadge category={article.category} />
          </div>

          {/* Title */}
          <h2 className="mb-3 text-xl font-bold text-[#1C1C1E] line-clamp-2">{article.title}</h2>

          {/* Excerpt */}
          <p className="mb-4 text-gray-600 line-clamp-3">{article.excerpt}</p>

          {/* Footer */}
          <div className="flex items-center text-sm text-gray-600">
            <span>{article.author}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(article.publishDate)}</span>
            <span className="mx-2">•</span>
            <span>{article.readTimeMinutes} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
