import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { NewsArticle } from '@/lib/cms/article/types';
import { NewsCategoryBadge } from './NewsCategoryBadge';

interface ArticleHeaderProps {
  article: NewsArticle;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const t = useTranslations('news');

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const hasImage = !!article.imageUrl;

  if (!hasImage) {
    return (
      <header className="relative overflow-hidden bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3]">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="mb-6">
            <NewsCategoryBadge category={article.category} />
          </div>
          <h1 className="mb-8 text-5xl font-black text-[#1C1C1E] md:text-6xl lg:text-7xl">
            {article.title}
          </h1>
          <div className="flex flex-col gap-1 text-base text-gray-600">
            <span className="font-medium">{article.author}</span>
            <div className="flex items-center gap-2">
              <span>{formatDate(article.publishDate)}</span>
              <span className="text-gray-400">•</span>
              <span>{t('minRead', { minutes: article.readTimeMinutes })}</span>
            </div>
          </div>
          <div className="mt-8 h-1 w-24 bg-[#C8102E]" />
        </div>
      </header>
    );
  }

  return (
    <header className="relative flex min-h-[60vh] flex-col justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={article.imageUrl!}
          alt={article.title}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative mx-auto w-full max-w-4xl px-4 py-16">
        <div className="mb-6">
          <NewsCategoryBadge category={article.category} />
        </div>
        <h1 className="mb-8 text-5xl font-black text-white md:text-6xl lg:text-7xl">
          {article.title}
        </h1>
        <div className="flex flex-col gap-1 text-base text-white/80">
          <span className="font-medium">{article.author}</span>
          <div className="flex items-center gap-2">
            <span>{formatDate(article.publishDate)}</span>
            <span className="text-white/40">•</span>
            <span>{t('minRead', { minutes: article.readTimeMinutes })}</span>
          </div>
        </div>
        <div className="mt-8 h-1 w-24 bg-[#C8102E]" />
      </div>
    </header>
  );
}
