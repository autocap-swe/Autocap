'use client';

import { Link } from '@/i18n/navigation';
import { ArrowLeft, Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ArticleActions() {
  const t = useTranslations('news');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="my-8 flex gap-4">
      <Link
        href="/news"
        className="flex items-center gap-2 text-[#C8102E] transition-colors hover:text-[#A00D24]"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>{t('backToNews')}</span>
      </Link>

      <button
        onClick={handlePrint}
        className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
        aria-label="Print"
      >
        <Printer className="h-5 w-5" />
        <span>{t('print')}</span>
      </button>
    </div>
  );
}
