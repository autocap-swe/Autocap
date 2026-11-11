// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Errors and a sample of page-load timings only. Session Replay is off (decision in the
  // v2 brief, 2026-11-11): it records visitor sessions and adds its recorder to every page.
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // No IP addresses, cookies or request bodies attached to events.
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
