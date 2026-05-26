import { investorsPageMapper } from './mapper';
import type { CmsInvestorsPage } from './types';

const fixture: CmsInvestorsPage = {
  landingHeadline: 'Invest in Sweden',
  landingSubheadline: 'Fragmented market. Proven playbook.',
  landingCtaText: 'View investment case',
  landingCtaLink: '/investors/why',
};

describe('investorsPageMapper', () => {
  it('maps landing headline and subheadline', () => {
    const result = investorsPageMapper(fixture);
    expect(result.landingHeadline).toBe(fixture.landingHeadline);
    expect(result.landingSubheadline).toBe(fixture.landingSubheadline);
  });

  it('maps CTA text and link', () => {
    const result = investorsPageMapper(fixture);
    expect(result.landingCtaText).toBe(fixture.landingCtaText);
    expect(result.landingCtaLink).toBe(fixture.landingCtaLink);
  });

  it('passes optional trustIndicator through when present', () => {
    const result = investorsPageMapper({ ...fixture, trustIndicator: 'Founder-led' });
    expect(result.trustIndicator).toBe('Founder-led');
  });

  it('leaves trustIndicator undefined when absent', () => {
    const result = investorsPageMapper(fixture);
    expect(result.trustIndicator).toBeUndefined();
  });
});
