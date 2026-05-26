export const dynamic = 'force-dynamic';

import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { KpiTicker } from '@/components/home/KpiTicker';
import { AudienceCards } from '@/components/home/AudienceCards';
import { LatestNewsStrip } from '@/components/home/LatestNewsStrip';
import { CeoQuote } from '@/components/home/CeoQuote';
import { FooterCta } from '@/components/home/FooterCta';
import type { Metadata } from 'next';
import { getHomepageContent } from '@/lib/cms/homepage';
import { getArticlesContent } from '@/lib/cms/article';
import { getKpiTickerContent } from '@/lib/cms/kpi-ticker';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';
import { cmsMediaUrl } from '@/lib/cms/media';
import { buildMetadata } from '@/lib/cms/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getHomepageContent(REVALIDATE_HIGH, locale);
  return buildMetadata(
    {
      title: 'AutoCap Group · Nordic Tire Services Platform',
      description: 'AutoCap acquires and grows tire service workshops across the Nordic region.',
    },
    cms.seo,
    locale
  );
}

const AUDIENCE_CARD_CONFIG = [
  { ctaLink: '/entrepreneurs', backgroundColor: '#D8E4DC' },
  { ctaLink: '/investors', backgroundColor: '#C9D8E8' },
  { ctaLink: '/portfolio', backgroundColor: '#E4E2DE' },
];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [cms, articles, cmsKpis] = await Promise.all([
    getHomepageContent(REVALIDATE_HIGH, locale),
    getArticlesContent(REVALIDATE_HIGH, locale).catch(() => []),
    getKpiTickerContent(REVALIDATE_HIGH, locale).catch(() => null),
  ]);

  const cards = AUDIENCE_CARD_CONFIG.map((config, i) => ({
    ...config,
    headline: cms.audienceCards?.[i]?.headline ?? '',
    description: cms.audienceCards?.[i]?.description ?? '',
    ctaText: cms.audienceCards?.[i]?.ctaText ?? '',
  }));

  return (
    <>
      <Hero
        headline={cms.heroHeadline}
        subheadline={cms.heroSubheadline}
        videoUrl={cmsMediaUrl(cms.heroVideo)}
        cta1Text={cms.heroCta1Text}
        cta1Link={cms.heroCta1Link}
        cta2Text={cms.heroCta2Text}
        cta2Link={cms.heroCta2Link}
      />
      {cmsKpis && <KpiTicker kpis={cmsKpis} />}
      <AudienceCards cards={cards} />
      <LatestNewsStrip articles={articles} />
      <CeoQuote text={cms.ceoQuoteText} attribution={cms.ceoQuoteAttribution} />
      <FooterCta
        headline={cms.footerCtaHeadline}
        subtext={cms.footerCtaSubtext}
        ctaText={cms.footerCtaButtonText}
        ctaLink={cms.footerCtaButtonLink}
      />
    </>
  );
}
