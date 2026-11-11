/**
 * Default next-intl mocks for component tests: real English messages, no provider needed.
 * A test file that calls jest.mock('next-intl', …) itself replaces these.
 */
const React = require('react');
const messages = require('../../messages/en.json');

function translator(namespace) {
  const { createTranslator } = require('use-intl/core');
  return createTranslator({ locale: 'en', messages, namespace });
}

jest.mock('next-intl', () => ({
  useTranslations: namespace => translator(namespace),
  useLocale: () => 'en',
  useMessages: () => messages,
  NextIntlClientProvider: ({ children }) => children,
}));

jest.mock('next-intl/server', () => ({
  getTranslations: async input => translator(typeof input === 'string' ? input : input?.namespace),
  getLocale: async () => 'en',
  getMessages: async () => messages,
  setRequestLocale: () => {},
}));

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...rest }) => React.createElement('a', { href: String(href), ...rest }, children),
  usePathname: () => '/',
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn(), back: jest.fn() }),
  redirect: jest.fn(),
  permanentRedirect: jest.fn(),
}));
