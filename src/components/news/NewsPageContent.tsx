'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Newspaper, FileText } from 'lucide-react';
import { NewsGrid } from '@/components/news/NewsGrid';
import { CategoryFilter } from '@/components/news/CategoryFilter';
import type { NewsArticle } from '@/lib/cms/article/types';

type Category = 'All' | 'Company News' | 'Press Release' | 'Industry Insights' | 'Media Coverage';

interface NewsPageContentProps {
  articles: NewsArticle[];
}

export function NewsPageContent({ articles }: NewsPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'All') return articles;
    return articles.filter(article => article.category === selectedCategory);
  }, [selectedCategory, articles]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center px-6 py-24 md:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Icon Badge */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <Newspaper className="h-12 w-12 text-[#C8102E] md:h-16 md:w-16" strokeWidth={2} />
            </div>
          </div>

          {/* Headline */}
          <h1 className="mb-8 text-5xl font-black leading-[1.1] text-[#1C1C1E] md:text-6xl lg:text-7xl xl:text-8xl">
            News & Media
          </h1>

          {/* Decorative Line */}
          <div className="mx-auto mb-8 h-1 w-24 bg-[#C8102E]" />

          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-700 md:text-2xl md:leading-relaxed">
            Company updates, industry insights, and press coverage
          </p>

          {/* Media Kit Link */}
          <div className="mb-12">
            <Link
              href="/news/media-kit"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#C8102E] shadow-sm transition-all hover:shadow-md hover:bg-gray-50"
            >
              <FileText className="h-5 w-5" />
              Media Kit & Press Resources
            </Link>
          </div>

          {/* Category Filter */}
          <div className="mx-auto max-w-4xl">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onFilterChange={setSelectedCategory}
            />
          </div>
        </div>
      </section>

      {/* News Grid Section */}
      <NewsGrid articles={filteredArticles} />
    </main>
  );
}
