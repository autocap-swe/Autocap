'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { Cookie, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCookieConsentContext } from './CookieConsentProvider';
import type { CookiePreferences } from '@/lib/cookieConsent';

export function CookieConsent() {
  const context = useCookieConsentContext();
  const t = useTranslations('cookie');

  // Local state for modal - must be called before any early returns
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(
    context?.preferences || { necessary: true, analytics: false, marketing: false }
  );

  // Sync local preferences when modal opens or global preferences change
  useEffect(() => {
    if (context?.preferences) {
      setLocalPreferences(context.preferences);
    }
  }, [context?.preferences, context?.showPreferencesModal]);

  if (!context) {
    return null;
  }

  const {
    showBanner,
    showPreferencesModal,
    acceptAll,
    openPreferences,
    closePreferences,
    setCustomPreferences,
  } = context;

  const handleSavePreferences = () => {
    setCustomPreferences(localPreferences);
  };

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-700 bg-[#1C1C1E] px-6 py-6 shadow-2xl"
          role="dialog"
          aria-label="Cookie consent banner"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              {/* Icon and Message */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Cookie className="h-6 w-6 text-[#C8102E]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-gray-200 md:text-base">
                    {t('bannerText')}{' '}
                    <Link
                      href="/privacy-policy"
                      className="font-semibold text-white underline transition-colors hover:text-[#C8102E]"
                    >
                      {t('privacyPolicy')}
                    </Link>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:flex-shrink-0">
                <button
                  onClick={openPreferences}
                  className="rounded-md border border-gray-600 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:border-gray-500 hover:bg-gray-800"
                >
                  {t('managePreferences')}
                </button>
                <button
                  onClick={acceptAll}
                  className="rounded-md bg-[#C8102E] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#A00D25]"
                >
                  {t('acceptAll')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Cookie preferences"
          onClick={closePreferences}
        >
          <div
            className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl md:p-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#1C1C1E]">{t('preferencesTitle')}</h2>
                <p className="mt-2 text-sm text-gray-600">{t('preferencesDescription')}</p>
              </div>
              <button
                onClick={closePreferences}
                className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600"
                aria-label="Close preferences"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cookie Categories */}
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1C1C1E]">{t('necessaryTitle')}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t('necessaryDescription')}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {t('alwaysActive')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="rounded-md border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1C1C1E]">{t('analyticsTitle')}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t('analyticsDescription')}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={localPreferences.analytics}
                        onChange={e =>
                          setLocalPreferences({
                            ...localPreferences,
                            analytics: e.target.checked,
                          })
                        }
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#C8102E] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="rounded-md border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1C1C1E]">{t('marketingTitle')}</h3>
                    <p className="mt-1 text-sm text-gray-600">{t('marketingDescription')}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={localPreferences.marketing}
                        onChange={e =>
                          setLocalPreferences({
                            ...localPreferences,
                            marketing: e.target.checked,
                          })
                        }
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#C8102E] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={closePreferences}
                className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSavePreferences}
                className="rounded-md bg-[#C8102E] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#A00D25]"
              >
                {t('savePreferences')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
