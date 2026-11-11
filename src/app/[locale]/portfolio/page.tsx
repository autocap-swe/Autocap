import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CompanyPanel, Container, Eyebrow, LogoWall, RedRule, type CompanyView } from '@/components/ds';
import { WorkshopMapWrapper } from '@/components/portfolio/WorkshopMapWrapper';
import { getWorkshopsContent } from '@/lib/cms/workshop';
import { getPortfolioPageContent } from '@/lib/cms/portfolio-page';
import { buildMetadata } from '@/lib/cms/seo';
import { countByRegion, groupCompanies, type Company } from '@/lib/v2/companies';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getPortfolioPageContent(undefined, locale).catch(() => null);
  return buildMetadata(
    locale === 'sv'
      ? {
          title: 'Våra bolag · AutoCap Group',
          description: 'Däckverkstäderna i AutoCap Group: lokala varumärken i två regioner, Öst och Väst/Mellan.',
        }
      : {
          title: 'Our companies · AutoCap Group',
          description: "AutoCap Group's tire service workshops: local brands in two regions, East and West/Central.",
        },
    cms?.seo,
    locale,
    { path: '/portfolio', fallbackOgImage: cms?.heroImage }
  );
}

function hostLabel(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default async function CompaniesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tCompany, tRegions, tFilters, workshops] = await Promise.all([
    getTranslations('v2.companiesPage'),
    getTranslations('v2.company'),
    getTranslations('v2.regions'),
    getTranslations('v2.filters'),
    getWorkshopsContent(undefined, locale).catch(() => []),
  ]);

  const companies = groupCompanies(workshops);
  const regions = countByRegion(workshops);
  const workshopCount = regions.east + regions.west;
  const citiesOf = (region: 'east' | 'west') =>
    [...new Set(companies.filter(c => c.region === region).map(c => (c.key === 'skanstull' || c.key === 'tumba' ? 'Stockholm' : c.city)))].join(', ');

  const describe = (company: Company): string => {
    if (company.key === 'dackgruppen') return t('desc.dackgruppen');
    return company.workshops[0]?.description ?? '';
  };

  const views: CompanyView[] = companies.map(company => {
    const regionShort = tFilters(company.region);
    const count = company.workshops.length;
    const metaParts = [
      ...(count > 1 ? [tCompany('workshops', { count })] : []),
      company.city,
      regionShort,
      ...(company.withinDackgruppen ? [tCompany('withinDackgruppen')] : []),
    ];
    return {
      key: company.key,
      name: company.name,
      listMeta: metaParts.join(' · '),
      regionLabel: tRegions(company.region),
      description: describe(company),
      facts: [
        ...(company.founded ? [{ label: tCompany('founded'), value: String(company.founded) }] : []),
        ...(company.since ? [{ label: tCompany('since'), value: String(company.since) }] : []),
        ...(company.ledBy ? [{ label: tCompany('ledBy'), value: company.ledBy }] : []),
        ...(company.tireHotel ? [{ label: tCompany('tireHotel'), value: '✓' }] : []),
      ],
      sites: company.workshops.map(w => w.name.replace(/^Däckgruppen /, '')),
      website: company.website ? { href: company.website, label: hostLabel(company.website) } : undefined,
      imageUrl: company.imageUrl,
    };
  });

  return (
    <>
      <section className="border-b border-rule bg-white text-ink">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col gap-[18px] px-5 pb-12 pt-14 lg:px-16 lg:pb-16 lg:pt-[72px]">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <h1 className="t-h1 m-0">{t('title', { workshops: workshopCount, brands: companies.length })}</h1>
            <RedRule />
            <p className="t-lead m-0 max-w-[560px] text-text-2">{t('lead')}</p>
            <ul className="m-0 mt-4 list-none p-0">
              {(['east', 'west'] as const).map(region => (
                <li key={region} className="border-t border-rule last:border-b">
                  <a href="#companies" className="grid grid-cols-[1fr_auto] items-center gap-4 py-4 text-ink no-underline hover:text-red">
                    <span>
                      <span className="block text-lg font-semibold">{tRegions(region)}</span>
                      <span className="t-meta block text-text-2">
                        {tCompany('workshops', { count: regions[region] })} · {citiesOf(region)}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-red">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="t-meta m-0 text-text-3">{t('regionNote')}</p>
          </div>
          <div aria-label={t('mapLabel')} className="relative min-h-[420px] bg-fjord lg:min-h-full [&>*]:absolute [&>*]:inset-0 [&>*]:h-full">
            <WorkshopMapWrapper workshops={workshops} />
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-white text-ink">
        <Container className="flex flex-col gap-7 py-12 lg:py-[72px]">
          <h2 className="t-h2 m-0">{t('brandsTitle')}</h2>
          <LogoWall
            tiles={companies.map(company => ({
              key: company.key,
              name: company.name,
              city: company.city,
              region: company.region,
              tireHotel: company.tireHotel,
            }))}
            hrefBase="#"
            labels={{
              all: tFilters('all'),
              east: tFilters('east'),
              west: tFilters('west'),
              tireHotel: tFilters('tireHotel'),
              group: tFilters('label'),
            }}
          />
        </Container>
      </section>

      <section id="companies" className="scroll-mt-20 bg-white text-ink">
        <h2 className="sr-only">{t('detailTitle')}</h2>
        <div className="mx-auto max-w-[1440px]">
          <CompanyPanel companies={views} sitesLabel={tCompany('sites')} />
        </div>
      </section>
    </>
  );
}
