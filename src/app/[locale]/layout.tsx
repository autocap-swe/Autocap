import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { draftMode } from 'next/headers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/layout/BackToTop';
import { CookieConsent } from '@/components/cookie/CookieConsent';
import { CookieConsentProvider } from '@/components/cookie/CookieConsentProvider';
import { LocalizedPathProvider } from '@/contexts/localizedPathContext';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'sv' }];
}

export const metadata: Metadata = {
  title: 'AutoCap Group · The Nordic Tire Services Platform',
  description:
    'AutoCap Group acquires and operates independent tire service centres across Sweden. Preserving local brands. Empowering entrepreneurs. Building scale.',
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const { isEnabled: isDraft } = await draftMode();
  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://app.autocapgroup.se/#organization',
                  name: 'AutoCap Group',
                  url: 'https://app.autocapgroup.se',
                  logo: 'https://app.autocapgroup.se/images/logo.png',
                  sameAs: ['https://www.linkedin.com/company/autocapgroup'],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://app.autocapgroup.se/#website',
                  url: 'https://app.autocapgroup.se',
                  name: 'AutoCap Group',
                  publisher: { '@id': 'https://app.autocapgroup.se/#organization' },
                  inLanguage: [locale],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {isDraft && (
          <div className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2 flex items-center gap-3 rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-lg">
            <span>Draft Preview</span>
            <a
              href={`/api/draft-disable?redirectTo=/${locale}`}
              className="rounded-full bg-white px-3 py-0.5 text-xs font-bold text-orange-600 hover:bg-orange-100"
            >
              Exit
            </a>
          </div>
        )}
        <NextIntlClientProvider messages={messages}>
          <LocalizedPathProvider>
            <CookieConsentProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <BackToTop />
              <CookieConsent />
              <GoogleAnalytics />
            </CookieConsentProvider>
          </LocalizedPathProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
