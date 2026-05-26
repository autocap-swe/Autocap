import { homepageMapper } from './mapper';
import type { CmsHomepage } from './types';

const fixture: CmsHomepage = {
  heroHeadline: 'The Nordic Tire Services Platform',
  heroSubheadline: 'We acquire and grow tire workshops.',
  heroCta1Text: 'For Entrepreneurs',
  heroCta1Link: '/entrepreneurs',
  heroCta2Text: 'For Investors',
  heroCta2Link: '/investors',
  ceoQuoteText: 'We build something different.',
  ceoQuoteAttribution: 'David Knape, CEO',
  footerCtaHeadline: 'Ready to start?',
  footerCtaSubtext: 'We would love to hear from you.',
  footerCtaButtonText: 'Get in touch',
  footerCtaButtonLink: '/contact',
};

describe('homepageMapper', () => {
  it('maps heroHeadline and heroSubheadline', () => {
    const result = homepageMapper(fixture);
    expect(result.heroHeadline).toBe(fixture.heroHeadline);
    expect(result.heroSubheadline).toBe(fixture.heroSubheadline);
  });

  it('maps CTA fields', () => {
    const result = homepageMapper(fixture);
    expect(result.heroCta1Text).toBe(fixture.heroCta1Text);
    expect(result.heroCta1Link).toBe(fixture.heroCta1Link);
    expect(result.heroCta2Text).toBe(fixture.heroCta2Text);
    expect(result.heroCta2Link).toBe(fixture.heroCta2Link);
  });

  it('maps ceoQuoteText and ceoQuoteAttribution', () => {
    const result = homepageMapper(fixture);
    expect(result.ceoQuoteText).toBe(fixture.ceoQuoteText);
    expect(result.ceoQuoteAttribution).toBe(fixture.ceoQuoteAttribution);
  });

  it('maps footerCta fields', () => {
    const result = homepageMapper(fixture);
    expect(result.footerCtaHeadline).toBe(fixture.footerCtaHeadline);
    expect(result.footerCtaSubtext).toBe(fixture.footerCtaSubtext);
    expect(result.footerCtaButtonText).toBe(fixture.footerCtaButtonText);
    expect(result.footerCtaButtonLink).toBe(fixture.footerCtaButtonLink);
  });
});
