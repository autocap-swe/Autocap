import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
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
                  '@id': 'https://autocapgroup.se/#organization',
                  name: 'AutoCap Group',
                  url: 'https://autocapgroup.se',
                  logo: 'https://autocapgroup.se/images/logo.png',
                  sameAs: ['https://www.linkedin.com/company/autocapgroup'],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://autocapgroup.se/#website',
                  url: 'https://autocapgroup.se',
                  name: 'AutoCap Group',
                  publisher: { '@id': 'https://autocapgroup.se/#organization' },
                  inLanguage: [locale],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
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
