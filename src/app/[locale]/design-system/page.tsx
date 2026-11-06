import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import {
  ArrowLink,
  ButtonLink,
  Container,
  Eyebrow,
  FactBand,
  PageHeader,
  RedRule,
  Section,
  TwoDoors,
} from '@/components/ds';

export const metadata: Metadata = {
  title: 'Design system · AutoCap Group',
  robots: { index: false, follow: false },
};

/** Reference page for the v2 design system. Preview deployments only, never production. */
export default async function DesignSystemPage({ params }: { params: Promise<{ locale: string }> }) {
  if (process.env.VERCEL_ENV === 'production') notFound();
  const { locale } = await params;
  setRequestLocale(locale);

  const colours = [
    ['ink', '#111111', 'bg-ink'],
    ['ink-2', '#1E1D1B', 'bg-ink-2'],
    ['red', '#C8102E', 'bg-red'],
    ['birch', '#F4F1EC', 'bg-birch'],
    ['fjord', '#E6EDF3', 'bg-fjord'],
    ['rule', '#E5E1DA', 'bg-rule'],
    ['text-2', '#5A5753', 'bg-text-2'],
    ['text-3', '#8C877F', 'bg-text-3'],
    ['on-dark-2', '#BDB8AF', 'bg-on-dark-2'],
  ] as const;

  return (
    <>
      <PageHeader
        eyebrow="Design system v2"
        title="White, black and red"
        lead="Thin, large type. Figures with their unit beside them. Lines instead of cards. No scroll effects, no hyphenation, no shadows. Placeholder copy from the design sketch."
      />

      <Section ruled>
        <Eyebrow className="mb-6">Colour</Eyebrow>
        <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-9">
          {colours.map(([name, hex, cls]) => (
            <li key={name} className="flex flex-col gap-2">
              <span className={`h-16 border border-rule ${cls}`} />
              <span className="t-meta font-semibold">{name}</span>
              <span className="t-meta text-text-3">{hex}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section ruled>
        <Eyebrow className="mb-8">Typography · Manrope 300/400/500/600</Eyebrow>
        <div className="flex flex-col gap-8">
          <p className="t-hero m-0">Building the Nordic tire services platform</p>
          <h2 className="t-h1 m-0">Leadership</h2>
          <h2 className="t-h2 m-0">Seven local brands. One platform.</h2>
          <h2 className="t-h2-sm m-0">Your name stays on the door.</h2>
          <h3 className="t-h3 m-0">Recurring, non-discretionary demand</h3>
          <p className="t-lead m-0 max-w-[620px] text-text-2">
            We acquire profitable, owner-led tire workshops and keep what makes them work: the name, the team and the customers.
          </p>
          <p className="t-body m-0 max-w-[620px]">
            Retirement, growth or a stronger partner. We buy the whole company, keep the brand and the team, and you stay an owner in the group if you want to.
          </p>
          <p className="t-meta m-0 text-text-3">6 November 2026 · 3 min read</p>
          <RedRule />
        </div>
      </Section>

      <Section ruled>
        <Eyebrow className="mb-6">Buttons and links</Eyebrow>
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href="/entrepreneurs">Thinking of selling?</ButtonLink>
          <ButtonLink href="/investors" variant="outline">
            The investment case
          </ButtonLink>
          <ArrowLink href="/entrepreneurs/why">What we look for</ArrowLink>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4 bg-ink p-8">
          <ButtonLink href="/entrepreneurs/contact" variant="light">
            Subscribe
          </ButtonLink>
          <ButtonLink href="/investors" variant="outline-light">
            The investment case
          </ButtonLink>
        </div>
      </Section>

      <TwoDoors
        doors={[
          {
            eyebrow: 'For workshop owners',
            title: 'Your name stays on the door.',
            text: 'Retirement, growth or a stronger partner. We buy the whole company, keep the brand and the team, and you stay an owner in the group if you want to.',
            linkLabel: 'What we look for',
            href: '/entrepreneurs',
          },
          {
            eyebrow: 'For investors',
            title: 'A fragmented market. A platform built to consolidate it.',
            text: '2,200 companies, the largest under 5 %. Non-discretionary, recurring revenue. Board, auditor and monthly reporting in place.',
            linkLabel: 'The investment case',
            href: '/investors',
          },
        ]}
      />

      <FactBand
        facts={[
          { value: '13', unit: 'Workshops\nin Sweden' },
          { value: '7', unit: 'Companies acquired\nin 15 months' },
          { value: '~50', unit: 'People\nin the group' },
          { value: '2', unit: 'Regions: East\nand West/Central' },
        ]}
        dateLine="Figures as of November 2026 · Updated when a deal is announced"
      />

      <Section tone="birch">
        <Eyebrow className="mb-2">Birch section</Eyebrow>
        <h2 className="t-h2-sm m-0">People, sellers, board</h2>
      </Section>
      <Section tone="fjord">
        <Eyebrow className="mb-2">Fjord section</Eyebrow>
        <h2 className="t-h2-sm m-0">Investors, model, data</h2>
      </Section>

      <PageHeader
        tone="ink"
        eyebrow="Investors"
        title="A platform built to consolidate a fragmented market"
        lead="Dark page header variant, used on Investors with figures underneath."
      />

      <Container className="py-12">
        <p className="t-meta m-0 text-text-3">This page is only available on preview deployments.</p>
      </Container>
    </>
  );
}
