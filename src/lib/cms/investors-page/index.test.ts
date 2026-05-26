import { getInvestorsPageContent } from './index';
import type { CmsInvestorsPage } from './types';

jest.mock('../client');
import { getContent } from '../client';
const mockedGetContent = getContent as jest.MockedFunction<typeof getContent>;

const fixture: CmsInvestorsPage = {
  landingHeadline: 'Invest in Sweden',
  landingSubheadline: 'Fragmented market.',
  landingCtaText: 'View case',
  landingCtaLink: '/investors/why',
};

beforeEach(() => {
  mockedGetContent.mockReset();
});

describe('getInvestorsPageContent — wiring', () => {
  it('calls getContent with slug "investors-page" and a mapper', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!(fixture as CmsInvestorsPage)
    );

    await getInvestorsPageContent();

    const [slug, options] = mockedGetContent.mock.calls[0];
    expect(slug).toBe('investors-page');
    expect(typeof options!.mapper).toBe('function');
  });
});

describe('getInvestorsPageContent — error propagation', () => {
  it('propagates CmsUnavailableError without catching', async () => {
    mockedGetContent.mockRejectedValue(new Error('CMS down'));
    await expect(getInvestorsPageContent()).rejects.toThrow('CMS down');
  });
});
