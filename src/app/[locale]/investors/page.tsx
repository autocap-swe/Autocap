export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLink, Container, Eyebrow, RedRule, Section } from '@/components/ds';
import { InvestorContactForm } from '@/components/investors/InvestorContactForm';
import { getInvestorsPageContent } from '@/lib/cms/investors-page';
import { getKpiTickerContent } from '@/lib/cms/kpi-ticker';
import { getWorkshopsContent } from '@/lib/cms/workshop';
import { getTeamMembersContent } from '@/lib/cms/team-member';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';
import { buildMetadata, OG_IMAGES } from '@/lib/cms/seo';
import { COMPANY_INFO } from '@/lib/constants';
import { countByRegion, groupCompanies } from '@/lib/v2/companies';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getInvestorsPageContent(REVALIDATE_HIGH, locale);
  return buildMetadata(
    locale === 'sv'
      ? {
          title: 'Investerare · AutoCap Group',
          description:
            'AutoCap Group konsoliderar Sveriges oberoende däckservicebransch. Investeringscaset, modellen, bolagsstyrning och IR-kontakt.',
        }
      : {
          title: 'Investors · AutoCap Group',
          description:
            "AutoCap Group is consolidating Sweden's independent tire service industry. The investment case, the model, governance and IR contact.",
        },
    cms.seo,
    locale,
    { path: '/investors', fallbackOgImage: OG_IMAGES.investors }
  );
}

const ICONS: ReactNode[] = [
  <svg key="1" aria-hidden="true" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="18" cy="18" r="15" />
    <path d="M18 3v15l10 8" />
  </svg>,
  <svg key="2" aria-hidden="true" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 28c6-10 10-10 14-4s8 6 14-8" />
    <path d="M4 32h28" />
  </svg>,
  <svg key="3" aria-hidden="true" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="14" width="8" height="18" />
    <rect x="14" y="8" width="8" height="24" />
    <rect x="24" y="3" width="8" height="29" />
  </svg>,
  <svg key="4" aria-hidden="true" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="5" />
    <circle cx="25" cy="14" r="4" />
    <path d="M3 30c2-6 6-9 9-9s7 3 9 9M20 30c1-4 3-6 5-6s4 2 5 6" />
  </svg>,
];

function Figure({ value, unit }: { value: string; unit: string }) {
  return (
    <div className="flex items-baseline gap-3.5">
      <dt className="t-meta order-2 whitespace-pre-line border-l border-rule-dark-2 pl-3.5 text-on-dark-2">{unit}</dt>
      <dd className="t-figure-lg order-1 m-0">{value}</dd>
    </div>
  );
}

function MiniBar({ label, value, percent }: { label: string; value: string; percent: number }) {
  return (
    <div className="mt-5 flex flex-col gap-1.5" aria-hidden="true">
      <span className="t-meta text-text-3">{label}</span>
      <div className="h-2 w-full bg-rule">
        <div className="h-2 bg-ink" style={{ width: `${percent}%` }} />
      </div>
      <span className="t-meta font-semibold">{value}</span>
    </div>
  );
}

export default async function InvestorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tRegions, cms, kpis, workshops, members] = await Promise.all([
    getTranslations('v2.investors'),
    getTranslations('v2.regions'),
    getInvestorsPageContent(REVALIDATE_HIGH, locale),
    getKpiTickerContent(REVALIDATE_HIGH, locale).catch(() => null),
    getWorkshopsContent(REVALIDATE_HIGH, locale).catch(() => []),
    getTeamMembersContent(locale).catch(() => []),
  ]);

  const companies = groupCompanies(workshops);
  const regions = countByRegion(workshops);
  const workshopCount = regions.east + regions.west;
  const revenue = kpis?.[2];
  const management = members.filter(member => member.isManagement);
  const boardFromCms = members.filter(member => member.isBoard);
  const board = [
    ...boardFromCms.map(member => member.name),
  ];
  const chair = boardFromCms.find(member => /chair|ordf/i.test(member.title))?.name;
  const ir = COMPANY_INFO.investorRelations;

  const pillars = [
    { title: t('case.p1Title'), text: t('case.p1Text'), bar: { label: t('case.p1Bar'), value: t('case.p1BarValue'), percent: 5 } },
    { title: t('case.p2Title'), text: t('case.p2Text'), bar: { label: t('case.p2Bar'), value: t('case.p2BarValue'), percent: 38 } },
    { title: t('case.p3Title'), text: t('case.p3Text') },
    { title: t('case.p4Title'), text: t('case.p4Text') },
  ];
  const steps = [
    { title: t('model.s1Title'), text: t('model.s1Text') },
    { title: t('model.s2Title'), text: t('model.s2Text') },
    { title: t('model.s3Title'), text: t('model.s3Text') },
  ];
  const clusterPoints = [
    { title: t('cluster.b1Title'), text: t('cluster.b1Text') },
    { title: t('cluster.b2Title'), text: t('cluster.b2Text') },
    { title: t('cluster.b3Title'), text: t('cluster.b3Text') },
  ];
  const anchors = [
    { href: '#case', label: t('anchors.case') },
    { href: '#model', label: t('anchors.model') },
    { href: '#governance', label: t('anchors.governance') },
    { href: '#contact', label: t('anchors.contact') },
  ];

  return (
    <>
      <header className="bg-ink text-white">
        <Container className="flex flex-col gap-10 pb-12 pt-14 lg:pb-16 lg:pt-[72px]">
          <div className="flex flex-col gap-[18px]">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <h1 className="t-h1 m-0 max-w-[16ch] text-white">{t('title')}</h1>
            <RedRule />
            <p className="t-lead m-0 max-w-[680px] text-on-dark-2">{t('lead')}</p>
            <nav aria-label={t('eyebrow')} className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
              {anchors.map(anchor => (
                <a key={anchor.href} href={anchor.href} className="text-white underline-offset-4 hover:underline">
                  {anchor.label}
                </a>
              ))}
            </nav>
          </div>
          <dl className="m-0 grid grid-cols-1 gap-8 border-t border-rule-dark-2 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            <Figure value={String(workshopCount)} unit={t('facts.workshops')} />
            <Figure value={String(companies.length)} unit={t('facts.companies')} />
            <Figure value={revenue ? `${revenue.prefix ?? ''}${revenue.value}` : '[CFO]'} unit={t('facts.revenue')} />
            <Figure value="2" unit={t('facts.regions')} />
          </dl>
        </Container>
      </header>

      <Section id="case" className="scroll-mt-20">
        <Eyebrow className="mb-2">{t('case.eyebrow')}</Eyebrow>
        <h2 className="t-h2 m-0 mb-10">{t('case.title')}</h2>
        <div className="grid grid-cols-1 border-l border-t border-rule md:grid-cols-2">
          {pillars.map((pillar, index) => (
            <article key={pillar.title} className="flex flex-col border-b border-r border-rule p-6 lg:p-10">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.1em] text-text-3">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-ink">{ICONS[index]}</span>
              </div>
              <h3 className="t-h3 m-0 mb-3">{pillar.title}</h3>
              <p className="m-0 text-[15px] leading-[1.55] text-text-2">{pillar.text}</p>
              {pillar.bar && <MiniBar {...pillar.bar} />}
            </article>
          ))}
        </div>
      </Section>

      <Section tone="fjord" id="model" className="scroll-mt-20">
        <Eyebrow className="mb-2">{t('model.eyebrow')}</Eyebrow>
        <h2 className="t-h2 m-0 mb-10">{t('model.title')}</h2>
        <ol className="m-0 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <li key={step.title} className="border-t border-ink pt-5">
              <span className="block text-[40px] font-light leading-none tracking-[-0.03em]">{index + 1}</span>
              <h3 className="m-0 mb-2 mt-4 text-[22px] font-medium leading-tight tracking-[-0.02em]">{step.title}</h3>
              <p className="m-0 text-[15px] leading-[1.55] text-text-2">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Eyebrow>{t('cluster.eyebrow')}</Eyebrow>
            <h2 className="t-h2 m-0">{t('cluster.title')}</h2>
            <p className="t-body m-0 text-text-2">{t('cluster.text1')}</p>
            <p className="t-body m-0 text-text-2">{t('cluster.text2')}</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(['east', 'west'] as const).map(region => (
                <div key={region} className="flex flex-col gap-2 bg-ink p-6 text-white">
                  <span className="t-eyebrow text-red">{tRegions(region)}</span>
                  <span className="t-figure-md">{regions[region]}</span>
                  <span className="t-meta text-on-dark-2">{t(region === 'east' ? 'cluster.eastText' : 'cluster.westText')}</span>
                </div>
              ))}
            </div>
            <ul className="m-0 list-none p-0">
              {clusterPoints.map(point => (
                <li key={point.title} className="flex flex-col gap-0.5 border-t border-rule py-3.5 last:border-b sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <strong className="font-semibold">{point.title}</strong>
                  <span className="text-sm text-text-2 sm:text-right">{point.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="birch" id="governance" className="scroll-mt-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <Eyebrow>{t('gov.eyebrow')}</Eyebrow>
            <h2 className="t-h2 m-0">{t('gov.title')}</h2>
            <p className="t-body m-0 max-w-[640px] text-text-2">{t('gov.text')}</p>
            <table className="mt-2 w-full border-collapse text-[15px]">
              <tbody>
                {[
                  [t('gov.board'), board.map(name => (name === chair ? `${name} (${t('gov.chair')})` : name)).join(', ')],
                  [t('gov.auditor'), t('gov.auditorValue')],
                  [t('gov.legal'), t('gov.legalValue')],
                  [t('gov.structure'), t('gov.structureValue')],
                ].map(([label, value]) => (
                  <tr key={label} className="border-t border-on-dark-2 last:border-b">
                    <th scope="row" className="w-[38%] py-3 pr-6 text-left align-top font-semibold">
                      {label}
                    </th>
                    <td className="py-3 text-text-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3">
            <Eyebrow>{t('gov.management')}</Eyebrow>
            <ul className="m-0 list-none p-0">
              {management.map(member => (
                <li key={member.id} className="border-t border-on-dark-2 last:border-b">
                  <Link href="/about/team" className="flex items-center justify-between gap-4 py-3.5 text-ink no-underline hover:text-red">
                    <span>
                      <strong className="font-semibold">{member.name}</strong>{' '}
                      <span className="text-text-2">· {member.title}</span>
                    </span>
                    <span aria-hidden="true" className="text-red">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <ArrowLink href="/about/team" className="mt-2">
              {t('gov.teamLink')}
            </ArrowLink>
          </div>
        </div>
      </Section>

      <Section tone="ink" id="contact" className="scroll-mt-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Eyebrow>{t('ir.eyebrow')}</Eyebrow>
            <h2 className="t-h2 m-0 text-white">{t('ir.title')}</h2>
            <p className="t-body m-0 max-w-[520px] text-on-dark-2">{t('ir.text')}</p>
            <address className="mt-2 not-italic text-[15px] text-on-dark-2">
              <strong className="font-semibold text-white">{ir.name}</strong>, {ir.role} ·{' '}
              <a href={`mailto:${ir.email}`} className="text-white underline-offset-4 hover:underline">
                {ir.email}
              </a>
            </address>
          </div>
          <div>
            <h3 className="m-0 mb-4 text-[22px] font-medium tracking-[-0.02em] text-white">{t('ir.formTitle')}</h3>
            <InvestorContactForm successMessage={cms.contactSuccessMessage || t('ir.success')} formLabels={cms} />
          </div>
        </div>
      </Section>
    </>
  );
}
