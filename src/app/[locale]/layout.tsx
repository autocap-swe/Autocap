import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/layout/BackToTop';
import { CookieConsent } from '@/components/cookie/CookieConsent';
import { CookieConsentProvider } from '@/components/cookie/CookieConsentProvider';

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
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <CookieConsentProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <BackToTop />
            <CookieConsent />
          </CookieConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
