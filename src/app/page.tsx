import { Hero } from '@/components/home/Hero';
import { KpiTicker } from '@/components/home/KpiTicker';
import { AudienceCards } from '@/components/home/AudienceCards';
import { LatestNewsStrip } from '@/components/home/LatestNewsStrip';
import { CeoQuote } from '@/components/home/CeoQuote';
import { FooterCta } from '@/components/home/FooterCta';
import { homepageContent, audienceCards } from '@/content/homepage';
import { getArticlesContent } from '@/lib/cms/article';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';

export default async function HomePage() {
  const articles = await getArticlesContent(REVALIDATE_HIGH).catch(() => []);

  return (
    <>
      <Hero {...homepageContent.hero} />
      <KpiTicker kpis={homepageContent.kpis} />
      <AudienceCards cards={audienceCards} />
      <LatestNewsStrip articles={articles} />
      <CeoQuote {...homepageContent.ceoQuote} />
      <FooterCta {...homepageContent.footerCta} />
    </>
  );
}
