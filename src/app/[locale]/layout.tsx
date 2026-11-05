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
import { COMPANY_INFO } from '@/lib/constants';
import { DEFAULT_OG_IMAGE, SITE_URL } from '@/lib/cms/seo';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'sv' }];
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: {
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: 'AutoCap Group' }],
  },
  title: "AutoCap Group · Sweden's tire services platform",
  description:
    'AutoCap Group acquires and operates independent tire service centres across Sweden. Preserving local brands. Empowering entrepreneurs. Building scale.',
  icons: {
    icon: [
      { url: '/AutoCap_Favicon.png', sizes: '16x16', type: 'image/png' },
      { url: '/AutoCap_Favicon@2x.png', sizes: '32x32', type: 'image/png' },
      { url: '/AutoCap_Favicon@3x.png', sizes: '48x48', type: 'image/png' },
    ],
  },
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
                  '@id': `${SITE_URL}/#organization`,
                  name: 'AutoCap Group',
                  legalName: COMPANY_INFO.name,
                  url: SITE_URL,
                  logo: `${SITE_URL}/logos/autocap-dark.png`,
                  image: DEFAULT_OG_IMAGE,
                  email: COMPANY_INFO.email,
                  identifier: {
                    '@type': 'PropertyValue',
                    propertyID: 'Organisationsnummer',
                    value: COMPANY_INFO.orgNumber,
                  },
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Nybrogatan 7',
                    postalCode: '114 34',
                    addressLocality: 'Stockholm',
                    addressCountry: 'SE',
                  },
                  areaServed: 'SE',
                  sameAs: [COMPANY_INFO.linkedInUrl],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://autocapgroup.se/#website',
                  url: SITE_URL,
                  name: 'AutoCap Group',
                  publisher: { '@id': `${SITE_URL}/#organization` },
                  inLanguage: locale === 'sv' ? 'sv-SE' : 'en',
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
