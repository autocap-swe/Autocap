'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type Category = 'All' | 'Company News' | 'Press Release' | 'Industry Insights' | 'Media Coverage';

interface CategoryFilterProps {
  selectedCategory: Category;
  onFilterChange: (category: Category) => void;
}

const CATEGORIES: { value: Category; key: string }[] = [
  { value: 'All', key: 'all' },
  { value: 'Company News', key: 'companyNews' },
  { value: 'Press Release', key: 'pressRelease' },
  { value: 'Industry Insights', key: 'industryInsights' },
  { value: 'Media Coverage', key: 'mediaCoverage' },
];

export function CategoryFilter({ selectedCategory, onFilterChange }: CategoryFilterProps) {
  const t = useTranslations('news.categories');

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {CATEGORIES.map(({ value, key }) => {
        const isSelected = selectedCategory === value;

        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={cn(
              'rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200',
              'border-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:ring-offset-2',
              isSelected
                ? 'border-[#C8102E] bg-[#C8102E] text-white shadow-md'
                : 'border-gray-300 bg-white text-gray-700 hover:border-[#C8102E]'
            )}
          >
            {t(key)}
          </button>
        );
      })}
    </div>
  );
}
