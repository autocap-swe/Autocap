export const dynamic = 'force-dynamic';

import Image from 'next/image';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import {
  ArrowLink,
  ButtonLink,
  Container,
  Eyebrow,
  FactBand,
  HeroVideo,
  LogoWall,
  NewsOnDark,
  PhotoBand,
  Quotes,
  TwoDoors,
} from '@/components/ds';
import { getHomepageContent } from '@/lib/cms/homepage';
import { getArticlesContent } from '@/lib/cms/article';
import { getKpiTickerContent } from '@/lib/cms/kpi-ticker';
import { getWorkshopsContent } from '@/lib/cms/workshop';
import { getTestimonialsContent } from '@/lib/cms/testimonial';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';
import { cmsMediaUrl } from '@/lib/cms/media';
import { buildMetadata } from '@/lib/cms/seo';
import { groupCompanies } from '@/lib/v2/companies';
import { formatMonthYear } from '@/lib/v2/short-date';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getHomepageContent(REVALIDATE_HIGH, locale);
  return buildMetadata(
    locale === 'sv'
      ? {
          title: 'AutoCap Group · Den nordiska plattformen för däckservice',
          description:
            'AutoCap Group förvärvar och utvecklar däckverkstäder i Sverige. Lokala namn och team behålls, med en stark grupp i ryggen.',
        }
      : {
          title: 'AutoCap Group · The Nordic tire services platform',
          description:
            'AutoCap Group acquires and develops tire service workshops across Sweden. Local names and teams stay, with a strong group behind them.',
        },
    cms.seo,
    locale,
    { path: '/' }
  );
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tFilters, cms, articles, kpis, workshops, testimonials] = await Promise.all([
    getTranslations('v2.home'),
    getTranslations('v2.filters'),
    getHomepageContent(REVALIDATE_HIGH, locale),
    getArticlesContent(REVALIDATE_HIGH, locale).catch(() => []),
    getKpiTickerContent(REVALIDATE_HIGH, locale).catch(() => null),
    getWorkshopsContent(REVALIDATE_HIGH, locale).catch(() => []),
    getTestimonialsContent(locale).catch(() => []),
  ]);

  const companies = groupCompanies(workshops);
  const workshopCount = companies.reduce((sum, company) => sum + company.workshops.length, 0);
  const featured = companies.find(company => company.key === 'dackgruppen') ?? companies[0];
  // People count comes from the published KPI row in the CMS; never hard-coded here.
  const people = kpis?.[1];
  const bandImage =
    workshops.find(w => w.name.includes('Brunna'))?.imageUrl ??
    workshops.find(w => w.imageUrl)?.imageUrl ??
    '/images/hero-workshop.jpg';

  const facts = [
    { value: String(workshopCount), unit: t('facts.workshops') },
    { value: String(companies.length), unit: t('facts.companies') },
    ...(people ? [{ value: `${people.prefix ?? ''}${people.value}${people.suffix ?? ''}`, unit: t('facts.people') }] : []),
    { value: '2', unit: t('facts.regions') },
  ];

  return (
    <>
      <HeroVideo
        videoUrl={cmsMediaUrl(cms.heroVideo)}
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
      >
        <ButtonLink href="/entrepreneurs">{t('cta1')}</ButtonLink>
        <ButtonLink href="/investors" variant="outline-light">
          {t('cta2')}
        </ButtonLink>
      </HeroVideo>

      <TwoDoors
        doors={[
          {
            eyebrow: t('doorOwners.eyebrow'),
            title: t('doorOwners.title'),
            text: t('doorOwners.text'),
            linkLabel: t('doorOwners.link'),
            href: '/entrepreneurs',
          },
          {
            eyebrow: t('doorInvestors.eyebrow'),
            title: t('doorInvestors.title'),
            text: t('doorInvestors.text'),
            linkLabel: t('doorInvestors.link'),
            href: '/investors',
          },
        ]}
      />

      {workshopCount > 0 && <FactBand facts={facts} dateLine={t('facts.dateLine')} />}

      {companies.length > 0 && (
        <section className="bg-white text-ink">
          <Container className="flex flex-col gap-7 py-12 lg:py-[72px]">
            <div>
              <Eyebrow className="mb-2">{t('companies.eyebrow')}</Eyebrow>
              <h2 className="t-h2 m-0">{t('companies.title')}</h2>
            </div>
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[3fr_2fr]">
              <LogoWall
                tiles={companies.map(company => ({
                  key: company.key,
                  name: company.name,
                  city: company.city,
                  region: company.region,
                  tireHotel: company.tireHotel,
                }))}
                hrefBase="/portfolio#"
                filters={['all', 'east', 'west']}
                labels={{
                  all: tFilters('all'),
                  east: tFilters('east'),
                  west: tFilters('west'),
                  tireHotel: tFilters('tireHotel'),
                  group: tFilters('label'),
                }}
                moreLabel={t('companies.all', { count: workshopCount })}
              />
              {featured && (
                <figure className="m-0 flex flex-col bg-birch">
                  {featured.imageUrl && (
                    <div className="relative h-[150px]">
                      <Image
                        src={featured.imageUrl}
                        alt={featured.name}
                        fill
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        className="object-cover saturate-[0.7]"
                      />
                    </div>
                  )}
                  <figcaption className="flex flex-col gap-2 px-6 pb-6 pt-[22px]">
                    <strong className="text-xl font-semibold">{featured.name}</strong>
                    <span className="text-[15px] text-text-2">{t('companies.featuredText')}</span>
                    <ArrowLink href="/portfolio" className="text-sm">
                      {t('companies.all', { count: workshopCount })}
                    </ArrowLink>
                  </figcaption>
                </figure>
              )}
            </div>
          </Container>
        </section>
      )}

      <PhotoBand imageUrl={bandImage} eyebrow={t('photoBand.eyebrow')} title={t('photoBand.title')} />

      <Quotes
        title={t('quotes.title')}
        quotes={testimonials.map(item => ({
          id: item.id,
          text: item.quote,
          name: item.ownerName,
          meta: `${item.workshopName} · ${item.city} · ${t('quotes.joined', { date: item.acquisitionDate })}`,
        }))}
      />

      <NewsOnDark
        eyebrow={t('news.eyebrow')}
        title={t('news.title')}
        allLabel={t('news.all')}
        rows={articles.slice(0, 3).map(article => ({
          slug: article.slug,
          title: article.title,
          date: formatMonthYear(article.publishDate, locale),
        }))}
        aside={
          <>
            <h3 className="m-0 text-[26px] font-normal leading-tight tracking-[-0.02em] text-white">
              {t('news.followTitle')}
            </h3>
            <p className="m-0 text-[15px] text-on-dark-2">{t('news.followText')}</p>
            <div>
              <ButtonLink href="/news/media-kit" variant="light">
                {t('news.followCta')}
              </ButtonLink>
            </div>
          </>
        }
      />
    </>
  );
}
