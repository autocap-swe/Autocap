import createMiddleware from 'next-intl/middleware';
import { defineRouting } from 'next-intl/routing';

const svEnabled = process.env.NEXT_PUBLIC_ENABLE_SV === 'true';

export const routing = defineRouting({
  locales: svEnabled ? ['en', 'sv'] : ['en'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
