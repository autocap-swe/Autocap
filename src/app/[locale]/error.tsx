'use client';

import * as Sentry from '@sentry/nextjs';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  const t = useTranslations('error');

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-[#F0DADA] p-6">
            <AlertCircle className="h-12 w-12 text-[#C8102E]" />
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-black text-[#1C1C1E] md:text-5xl">{t('heading')}</h1>

        <div className="mx-auto mb-6 h-1 w-24 bg-[#C8102E]" />

        <p className="mx-auto mb-8 text-lg text-gray-600 md:text-xl">{t('description')}</p>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00D25] px-6 py-3 font-bold text-white transition-all duration-300 hover:scale-105"
        >
          <RefreshCw className="h-5 w-5" />
          {t('cta')}
        </button>
      </div>
    </div>
  );
}
