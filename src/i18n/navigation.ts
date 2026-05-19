import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

const routing = defineRouting({
  locales: ['en', 'sv'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export const { Link, useRouter, usePathname, redirect, permanentRedirect } =
  createNavigation(routing);
