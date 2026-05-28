import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Breadcrumb } from '@/components/entrepreneurs/Breadcrumb';
import { InvestorContactForm } from '@/components/investors/InvestorContactForm';
import { getInvestorsPageContent } from '@/lib/cms/investors-page';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';

export const metadata: Metadata = {
  title: 'Investor Relations · AutoCap Group',
  description: 'Interested in the AutoCap opportunity? Contact our investor relations team.',
};

export default async function InvestorsContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, cms] = await Promise.all([
    getTranslations('investors'),
    getInvestorsPageContent(REVALIDATE_HIGH, locale),
  ]);

  return (
    <main className="min-h-screen bg-[#C9D8E8]">
      <section className="px-6 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb
            items={[
              { label: t('breadcrumb.home'), href: '/' },
              { label: t('breadcrumb.investmentCase'), href: '/investors' },
              { label: t('breadcrumb.investorRelations') },
            ]}
          />
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-[#1C1C1E] md:text-5xl">
              {cms.contactTitle}
            </h1>
            <p className="text-lg leading-relaxed text-gray-700">{cms.contactSubtext}</p>
          </div>
        </div>
      </section>
      <section className="px-6 pb-20 md:px-8">
        <div className="mx-auto max-w-2xl">
          <InvestorContactForm successMessage={cms.contactSuccessMessage} formLabels={cms} />
        </div>
      </section>
    </main>
  );
}
