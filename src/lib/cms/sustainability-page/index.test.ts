import { getSustainabilityPageContent } from './index';
import type { CmsSustainabilityPage } from './types';

jest.mock('../client');
import { getContent } from '../client';
const mockedGetContent = getContent as jest.MockedFunction<typeof getContent>;

const fixture: CmsSustainabilityPage = {
  heroHeadline: 'Practical steps.',
  heroIntro: 'Sustainability in tire service.',
  whereWeAreTitle: 'Where we are',
  whereWeAreDescription: 'Early stage.',
  whereWeAreCurrentFocusLabel: 'Focus areas',
  whereWeAreFocusAreas: [{ text: 'Recycling' }],
  whereWeAreGoingTitle: "Where we're going",
  whereWeAreGoingDescription: 'Growing portfolio.',
  whereWeAreGoingStatement: 'Efficiency and responsibility reinforce each other.',
  governanceTitle: 'Governance',
  governanceDescription: 'Oversight with management.',
  governanceContactText: 'For questions, contact',
  governanceContactEmail: 'kontakt@autocapgroup.se',
};

beforeEach(() => {
  mockedGetContent.mockReset();
});

describe('getSustainabilityPageContent — wiring', () => {
  it('calls getContent with slug "sustainability-page" and populates focus areas', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!(fixture as CmsSustainabilityPage)
    );

    await getSustainabilityPageContent();

    const [slug, options] = mockedGetContent.mock.calls[0];
    expect(slug).toBe('sustainability-page');
    expect(typeof options!.mapper).toBe('function');
    expect(options!.params?.populate).toBe('whereWeAreFocusAreas');
  });
});

describe('getSustainabilityPageContent — error propagation', () => {
  it('propagates CmsUnavailableError without catching', async () => {
    mockedGetContent.mockRejectedValue(new Error('CMS down'));
    await expect(getSustainabilityPageContent()).rejects.toThrow('CMS down');
  });
});
