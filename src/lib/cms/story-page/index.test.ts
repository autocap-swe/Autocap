import { getStoryPageContent } from './index';
import type { CmsStoryPage } from './types';

jest.mock('../client');
import { getContent } from '../client';
const mockedGetContent = getContent as jest.MockedFunction<typeof getContent>;

const fixture: CmsStoryPage = {
  heroHeadline: 'Two brothers.',
  openingHeadline: 'A clear opportunity.',
  openingContent: [],
  pullQuoteText: 'We saw a third option.',
  pullQuoteAttribution: 'Nicklas Knape',
  pullQuoteAttributionTitle: 'COO',
  modelTitle: 'The model',
  modelContent: [],
  visionTitle: "Where we're going",
  visionContent: [],
  timelineTitle: 'Our Journey',
  timelineMilestones: [
    { year: '2024', title: 'Founded', description: 'Established.', status: 'completed' },
  ],
};

beforeEach(() => {
  mockedGetContent.mockReset();
});

describe('getStoryPageContent — wiring', () => {
  it('calls getContent with slug "story-page" and a mapper', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!(fixture as CmsStoryPage)
    );

    await getStoryPageContent();

    const [slug, options] = mockedGetContent.mock.calls[0];
    expect(slug).toBe('story-page');
    expect(typeof options!.mapper).toBe('function');
    expect(options!.params?.populate).toBe('timelineMilestones');
  });
});

describe('getStoryPageContent — error propagation', () => {
  it('propagates CmsUnavailableError without catching', async () => {
    mockedGetContent.mockRejectedValue(new Error('CMS down'));
    await expect(getStoryPageContent()).rejects.toThrow('CMS down');
  });
});
