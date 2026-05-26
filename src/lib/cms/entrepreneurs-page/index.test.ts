import { getEntrepreneursPageContent } from './index';
import type { CmsEntrepreneursPage } from './types';

jest.mock('../client');
import { getContent } from '../client';
const mockedGetContent = getContent as jest.MockedFunction<typeof getContent>;

const fixture: CmsEntrepreneursPage = {
  landingHeadline: 'For Workshop Owners',
  landingSubheadline: 'Thinking of selling?',
  landingCtaText: 'Learn more',
  landingCtaLink: '/entrepreneurs/why',
  whyPageTitle: 'Why AutoCap',
  whyPageIntro: 'We do it differently.',
  whyPageIntroBold: 'Differently.',
  benefits: [{ title: 'Preserve brand', description: 'No rebranding.' }],
  closingBlockTitle: 'Start a conversation',
  closingBlockDescription: 'We would love to hear from you.',
  whyPageClosingCta: 'Contact us',
};

beforeEach(() => {
  mockedGetContent.mockReset();
});

describe('getEntrepreneursPageContent — wiring', () => {
  it('calls getContent with slug "entrepreneurs-page" and populates benefits', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!(fixture as CmsEntrepreneursPage)
    );

    await getEntrepreneursPageContent();

    const [slug, options] = mockedGetContent.mock.calls[0];
    expect(slug).toBe('entrepreneurs-page');
    expect(typeof options!.mapper).toBe('function');
    expect(options!.params?.populate).toBe('benefits');
  });
});

describe('getEntrepreneursPageContent — error propagation', () => {
  it('propagates CmsUnavailableError without catching', async () => {
    mockedGetContent.mockRejectedValue(new Error('CMS down'));
    await expect(getEntrepreneursPageContent()).rejects.toThrow('CMS down');
  });
});
