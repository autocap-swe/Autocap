'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { forwardRef } from 'react';
import { useLocale } from 'next-intl';

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onExpire: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileWidgetProps>(
  ({ onToken, onExpire }, ref) => {
    const locale = useLocale();
    if (!SITE_KEY) return null;

    return (
      <Turnstile
        ref={ref}
        siteKey={SITE_KEY}
        onSuccess={onToken}
        onExpire={onExpire}
        options={{ theme: 'light', size: 'normal', language: locale }}
      />
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';

export { TurnstileWidget };
export type { TurnstileInstance };
