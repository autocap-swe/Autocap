import type { NewsArticle } from '@/lib/cms/article/types';
import { NewsCategoryBadge } from './NewsCategoryBadge';

interface ArticleHeaderProps {
  article: NewsArticle;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header className="bg-gradient-to-br from-[#F5F0EB] to-[#EDE8E3] py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6">
          <NewsCategoryBadge category={article.category} />
        </div>

        <h1 className="mb-8 font-black text-5xl text-[#1C1C1E] md:text-6xl lg:text-7xl">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-base text-gray-600">
          <span>{article.author}</span>
          <span className="text-gray-400">•</span>
          <span>{formatDate(article.publishDate)}</span>
          <span className="text-gray-400">•</span>
          <span>{article.readTimeMinutes} min read</span>
        </div>

        <div className="mt-8 h-1 w-24 rounded-full border-4 border-[#C8102E]" />
      </div>
    </header>
  );
}
