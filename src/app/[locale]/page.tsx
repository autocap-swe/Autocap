import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { KpiTicker } from '@/components/home/KpiTicker';
import { AudienceCards } from '@/components/home/AudienceCards';
import { LatestNewsStrip } from '@/components/home/LatestNewsStrip';
import { CeoQuote } from '@/components/home/CeoQuote';
import { FooterCta } from '@/components/home/FooterCta';
import { homepageContent, audienceCards } from '@/content/homepage';
import { getArticlesContent } from '@/lib/cms/article';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [articles, t] = await Promise.all([
    getArticlesContent(REVALIDATE_HIGH, locale).catch(() => []),
    getTranslations('homepage'),
  ]);

  const hero = {
    ...homepageContent.hero,
    headline: t('hero.headline'),
    subheadline: t('hero.subheadline'),
    cta1Text: t('hero.cta1Text'),
    cta2Text: t('hero.cta2Text'),
  };

  const kpis = homepageContent.kpis.map((kpi, i) => ({
    ...kpi,
    label: t(`kpis.${i}.label`),
    ...(kpi.prefix !== undefined && { prefix: t(`kpis.${i}.prefix`) }),
    ...(kpi.suffix !== undefined && { suffix: t(`kpis.${i}.suffix`) }),
  }));

  const cards = audienceCards.map((card, i) => ({
    ...card,
    headline: t(`audienceCards.${i}.headline`),
    description: t(`audienceCards.${i}.description`),
    ctaText: t(`audienceCards.${i}.ctaText`),
  }));

  const ceoQuote = {
    ...homepageContent.ceoQuote,
    text: t('ceoQuote.text'),
    attribution: t('ceoQuote.attribution'),
  };

  const footerCta = {
    ...homepageContent.footerCta,
    headline: t('footerCta.headline'),
    subtext: t('footerCta.subtext'),
    ctaText: t('footerCta.ctaText'),
  };

  return (
    <>
      <Hero {...hero} />
      <KpiTicker kpis={kpis} />
      <AudienceCards cards={cards} />
      <LatestNewsStrip articles={articles} />
      <CeoQuote {...ceoQuote} />
      <FooterCta {...footerCta} />
    </>
  );
}
