import { entrepreneursPageMapper } from './mapper';
import type { CmsEntrepreneursPage } from './types';

const fixture: CmsEntrepreneursPage = {
  landingHeadline: 'For Workshop Owners',
  landingSubheadline: 'Thinking of selling?',
  landingCtaText: 'Learn more',
  landingCtaLink: '/entrepreneurs/why',
  whyPageTitle: 'Why AutoCap',
  whyPageIntro: 'We do it differently.',
  whyPageIntroBold: 'Differently.',
  benefits: [
    { title: 'Preserve your brand', description: 'We keep your name.' },
    { title: 'Keep your team', description: 'No replacements.' },
  ],
  closingBlockTitle: 'Start a conversation',
  closingBlockDescription: 'We would love to hear from you.',
  whyPageClosingCta: 'Contact us',
};

describe('entrepreneursPageMapper', () => {
  it('maps landing fields', () => {
    const result = entrepreneursPageMapper(fixture);
    expect(result.landingHeadline).toBe(fixture.landingHeadline);
    expect(result.landingSubheadline).toBe(fixture.landingSubheadline);
    expect(result.landingCtaText).toBe(fixture.landingCtaText);
    expect(result.landingCtaLink).toBe(fixture.landingCtaLink);
  });

  it('maps why-page fields', () => {
    const result = entrepreneursPageMapper(fixture);
    expect(result.whyPageTitle).toBe(fixture.whyPageTitle);
    expect(result.whyPageIntro).toBe(fixture.whyPageIntro);
    expect(result.whyPageIntroBold).toBe(fixture.whyPageIntroBold);
  });

  it('maps benefits array — length and fields', () => {
    const result = entrepreneursPageMapper(fixture);
    expect(result.benefits).toHaveLength(2);
    expect(result.benefits[0].title).toBe('Preserve your brand');
    expect(result.benefits[1].description).toBe('No replacements.');
  });

  it('maps closing block fields', () => {
    const result = entrepreneursPageMapper(fixture);
    expect(result.closingBlockTitle).toBe(fixture.closingBlockTitle);
    expect(result.closingBlockDescription).toBe(fixture.closingBlockDescription);
    expect(result.whyPageClosingCta).toBe(fixture.whyPageClosingCta);
  });

  it('returns empty array when benefits is empty', () => {
    const result = entrepreneursPageMapper({ ...fixture, benefits: [] });
    expect(result.benefits).toEqual([]);
  });

  it('passes optional trustIndicator through when present', () => {
    const result = entrepreneursPageMapper({ ...fixture, trustIndicator: 'Active & growing' });
    expect(result.trustIndicator).toBe('Active & growing');
  });

  it('passes optional whyPageBadge through when present', () => {
    const result = entrepreneursPageMapper({ ...fixture, whyPageBadge: 'For you' });
    expect(result.whyPageBadge).toBe('For you');
  });
});
