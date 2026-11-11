import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLink, ButtonLink, Container, Eyebrow, PageHeader, Quotes, Section } from '@/components/ds';
import { ContactForm } from '@/components/entrepreneurs/ContactForm';
import { getEntrepreneursPageContent } from '@/lib/cms/entrepreneurs-page';
import { getTestimonialsContent } from '@/lib/cms/testimonial';
import { REVALIDATE_HIGH } from '@/lib/cms/revalidate';
import { buildMetadata, OG_IMAGES } from '@/lib/cms/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getEntrepreneursPageContent(REVALIDATE_HIGH, locale);
  return buildMetadata(
    {
      title: 'For Workshop Owners · AutoCap Group',
      description:
        'Thinking of selling? AutoCap preserves your brand, keeps your team, and offers fair value.',
    },
    cms.seo,
    locale,
    { path: '/entrepreneurs', fallbackOgImage: OG_IMAGES.entrepreneurs }
  );
}

const STAY_KEYS = ['stay1', 'stay2', 'stay3', 'stay4'] as const;
const ADD_KEYS = ['add1', 'add2', 'add3', 'add4'] as const;
const WEEK_KEYS = ['w1', 'w2', 'w3'] as const;
const DAY_KEYS = ['d1', 'd2', 'd3'] as const;

function Timeline({ steps }: { steps: { label: string; text: string }[] }) {
  return (
    <ol className="m-0 grid list-none grid-cols-1 p-0 lg:grid-cols-3">
      {steps.map((step, index) => (
        <li
          key={step.label}
          className={`flex flex-col gap-2 border-t-2 border-ink py-6 lg:pr-9 ${index > 0 ? 'lg:pl-0' : ''}`}
        >
          <span className="t-meta font-semibold text-red">{step.label}</span>
          <span className="text-[17px] leading-[1.5]">{step.text}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function EntrepreneursPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tHome, cms, testimonials] = await Promise.all([
    getTranslations('v2.entrepreneurs'),
    getTranslations('v2.home'),
    getEntrepreneursPageContent(REVALIDATE_HIGH, locale),
    getTestimonialsContent(locale).catch(() => []),
  ]);

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={cms.landingHeadline} lead={cms.landingSubheadline}>
        <div className="mt-2 flex flex-wrap items-center gap-6">
          <ButtonLink href="#talk">{t('talkCta')}</ButtonLink>
          <ArrowLink href={cms.landingCtaLink}>{cms.landingCtaText}</ArrowLink>
          <ArrowLink href="/entrepreneurs/process">{t('processLink')}</ArrowLink>
        </div>
      </PageHeader>

      <Section>
        <h2 className="t-h2 m-0 mb-8">{t('compareTitle')}</h2>
        <div className="grid grid-cols-1 border-t border-ink lg:grid-cols-2">
          {[
            { title: t('compareStay'), keys: STAY_KEYS },
            { title: t('compareAdd'), keys: ADD_KEYS },
          ].map((column, index) => (
            <div key={column.title} className={index > 0 ? 'lg:border-l lg:border-rule lg:pl-9' : 'lg:pr-9'}>
              <h3 className="t-eyebrow m-0 py-4 text-red">{column.title}</h3>
              <ul className="m-0 list-none p-0">
                {column.keys.map(key => (
                  <li key={key} className="border-t border-rule py-4 text-[17px]">
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="fjord">
        <h2 className="t-h2-sm m-0 mb-7">{t('weeksTitle')}</h2>
        <Timeline steps={WEEK_KEYS.map(key => ({ label: t(key), text: t(`${key}Text`) }))} />
        <h2 className="t-h2-sm m-0 mb-7 mt-12">{t('daysTitle')}</h2>
        <Timeline steps={DAY_KEYS.map(key => ({ label: t(key), text: t(`${key}Text`) }))} />
        <p className="t-meta m-0 mt-4 text-text-2">{t('draftNote')}</p>
      </Section>

      <Quotes
        title={t('quotesTitle')}
        quotes={testimonials.map(item => ({
          id: item.id,
          text: item.quote,
          name: item.ownerName,
          meta: `${item.workshopName} · ${item.city} · ${tHome('quotes.joined', { date: item.acquisitionDate })}`,
        }))}
      />

      <section id="talk" className="scroll-mt-20 bg-birch text-ink">
        <Container className="grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1fr_1.2fr] lg:py-[72px]">
          <div className="flex flex-col gap-4">
            <Eyebrow>{t('formEyebrow')}</Eyebrow>
            <h2 className="t-h2 m-0">{t('formTitle')}</h2>
            <p className="t-lead m-0 max-w-[440px] text-text-2">{t('formLead')}</p>
          </div>
          <ContactForm successMessage={cms.contactSuccessMessage} formLabels={cms} />
        </Container>
      </section>
    </>
  );
}
