import { storyPageMapper } from './mapper';
import type { CmsStoryPage } from './types';

const fixture: CmsStoryPage = {
  heroHeadline: 'Two brothers. One industry.',
  openingHeadline: 'A clear opportunity.',
  openingContent: [{ type: 'paragraph', children: [{ type: 'text', text: 'Opening.' }] }],
  pullQuoteText: "We didn't want to build another chain.",
  pullQuoteAttribution: 'Nicklas Knape',
  pullQuoteAttributionTitle: 'COO & Head of M&A',
  modelTitle: 'The model',
  modelContent: [{ type: 'paragraph', children: [{ type: 'text', text: 'Model text.' }] }],
  visionTitle: "Where we're going",
  visionContent: [{ type: 'paragraph', children: [{ type: 'text', text: 'Vision text.' }] }],
  timelineTitle: 'Our Journey',
  timelineMilestones: [
    { year: '2024', title: 'Founded', description: 'AutoCap established.', status: 'completed' },
    {
      year: 'Oct 2025',
      title: 'First acquisition',
      description: 'Däckpoint joins.',
      status: 'completed',
    },
    { year: '2026–2027', title: 'Scaling', description: 'Target 25+ workshops.', status: 'future' },
  ],
};

describe('storyPageMapper', () => {
  it('maps hero and opening headline', () => {
    const result = storyPageMapper(fixture);
    expect(result.heroHeadline).toBe(fixture.heroHeadline);
    expect(result.openingHeadline).toBe(fixture.openingHeadline);
  });

  it('maps blocks content fields', () => {
    const result = storyPageMapper(fixture);
    expect(result.openingContent).toBe(fixture.openingContent);
    expect(result.modelContent).toBe(fixture.modelContent);
    expect(result.visionContent).toBe(fixture.visionContent);
  });

  it('maps pull quote fields', () => {
    const result = storyPageMapper(fixture);
    expect(result.pullQuoteText).toBe(fixture.pullQuoteText);
    expect(result.pullQuoteAttribution).toBe(fixture.pullQuoteAttribution);
    expect(result.pullQuoteAttributionTitle).toBe(fixture.pullQuoteAttributionTitle);
  });

  it('maps timelineMilestones — length and fields', () => {
    const result = storyPageMapper(fixture);
    expect(result.timelineMilestones).toHaveLength(3);
    expect(result.timelineMilestones[0].year).toBe('2024');
    expect(result.timelineMilestones[0].status).toBe('completed');
  });

  it('preserves future status on milestone', () => {
    const result = storyPageMapper(fixture);
    const future = result.timelineMilestones.find(m => m.status === 'future');
    expect(future).toBeDefined();
    expect(future?.year).toBe('2026–2027');
  });

  it('returns empty array when timelineMilestones is empty', () => {
    const result = storyPageMapper({ ...fixture, timelineMilestones: [] });
    expect(result.timelineMilestones).toEqual([]);
  });
});
