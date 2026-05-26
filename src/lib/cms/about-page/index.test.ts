import { getAboutPageContent } from './index';
import type { CmsAboutPage } from './types';

jest.mock('../client');
import { getContent } from '../client';
const mockedGetContent = getContent as jest.MockedFunction<typeof getContent>;

const fixture: CmsAboutPage = {
  heroHeadline: 'About AutoCap',
  heroSubheadline: 'Operators first.',
  storyTitle: 'Our Story',
  storyContent: [],
  missionTitle: 'Our Mission',
  missionStatement: 'Build the leading platform.',
  missionOurVisionLabel: 'Our Vision',
  missionVision: 'Workshops thrive.',
  differentiatorsSectionTitle: 'What Makes Us Different',
  differentiators: [{ title: 'We Preserve Brands', description: 'No rebranding.' }],
  closingTitle: 'Learn more',
  closingDescription: 'Get in touch.',
};

beforeEach(() => {
  mockedGetContent.mockReset();
});

describe('getAboutPageContent — wiring', () => {
  it('calls getContent with slug "about-page" and a mapper function', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!(fixture as CmsAboutPage)
    );

    await getAboutPageContent();

    const [slug, options] = mockedGetContent.mock.calls[0];
    expect(slug).toBe('about-page');
    expect(typeof options!.mapper).toBe('function');
    expect(options).not.toHaveProperty('fallback');
  });

  it('populates differentiators', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!(fixture as CmsAboutPage)
    );

    await getAboutPageContent();

    const [, options] = mockedGetContent.mock.calls[0];
    expect(options!.params?.populate).toBe('differentiators');
  });
});

describe('getAboutPageContent — error propagation', () => {
  it('propagates CmsUnavailableError without catching', async () => {
    mockedGetContent.mockRejectedValue(new Error('CMS down'));
    await expect(getAboutPageContent()).rejects.toThrow('CMS down');
  });
});
