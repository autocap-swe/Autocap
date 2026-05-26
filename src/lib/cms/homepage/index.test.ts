import { getHomepageContent } from './index';
import type { CmsHomepage } from './types';

jest.mock('../client');
import { getContent } from '../client';
const mockedGetContent = getContent as jest.MockedFunction<typeof getContent>;

const fixture: CmsHomepage = {
  heroHeadline: 'The Nordic Platform',
  heroSubheadline: 'We grow workshops.',
  heroCta1Text: 'Entrepreneurs',
  heroCta1Link: '/entrepreneurs',
  heroCta2Text: 'Investors',
  heroCta2Link: '/investors',
  ceoQuoteText: 'Quote text.',
  ceoQuoteAttribution: 'CEO Name',
  footerCtaHeadline: 'Get in touch',
  footerCtaSubtext: 'We would love to hear from you.',
  footerCtaButtonText: 'Contact us',
  footerCtaButtonLink: '/contact',
};

beforeEach(() => {
  mockedGetContent.mockReset();
});

describe('getHomepageContent — wiring', () => {
  it('calls getContent with slug "homepage" and a mapper function', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!(fixture as CmsHomepage)
    );

    await getHomepageContent();

    expect(mockedGetContent).toHaveBeenCalledTimes(1);
    const [slug, options] = mockedGetContent.mock.calls[0];
    expect(slug).toBe('homepage');
    expect(typeof options!.mapper).toBe('function');
    expect(options).not.toHaveProperty('fallback');
  });

  it('returns mapped content from the fixture', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!(fixture as CmsHomepage)
    );

    const result = await getHomepageContent();

    expect(result.heroHeadline).toBe(fixture.heroHeadline);
    expect(result.ceoQuoteText).toBe(fixture.ceoQuoteText);
    expect(result.footerCtaButtonLink).toBe(fixture.footerCtaButtonLink);
  });
});

describe('getHomepageContent — error propagation', () => {
  it('propagates CmsUnavailableError without catching', async () => {
    mockedGetContent.mockRejectedValue(new Error('CMS down'));
    await expect(getHomepageContent()).rejects.toThrow('CMS down');
  });
});
