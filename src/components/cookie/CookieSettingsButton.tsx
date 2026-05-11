'use client';

import { useTranslations } from 'next-intl';
import { useCookieConsentContext } from './CookieConsentProvider';

export function CookieSettingsButton() {
  const context = useCookieConsentContext();
  const t = useTranslations('cookie');

  const handleClick = () => {
    if (context) {
      context.openPreferences();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="text-left text-sm text-gray-400 transition-colors hover:text-white"
    >
      {t('settings')}
    </button>
  );
}
