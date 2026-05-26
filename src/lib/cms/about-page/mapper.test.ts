import { aboutPageMapper } from './mapper';
import type { CmsAboutPage } from './types';

const fixture: CmsAboutPage = {
  heroHeadline: "Building Sweden's tire services platform",
  heroSubheadline: 'We operate, not engineer.',
  storyTitle: 'Our Story',
  storyContent: [{ type: 'paragraph', children: [{ type: 'text', text: 'Story text.' }] }],
  missionTitle: 'Our Mission',
  missionStatement: 'To build the leading platform.',
  missionOurVisionLabel: 'Our Vision',
  missionVision: 'A future where workshops thrive.',
  differentiatorsSectionTitle: 'What Makes Us Different',
  differentiators: [
    { title: 'We Preserve Brands', description: 'No rebranding.' },
    { title: 'We Keep Teams', description: 'No replacements.' },
  ],
  closingTitle: 'Want to learn more?',
  closingDescription: 'Get in touch with us.',
};

describe('aboutPageMapper', () => {
  it('maps hero fields', () => {
    const result = aboutPageMapper(fixture);
    expect(result.heroHeadline).toBe(fixture.heroHeadline);
    expect(result.heroSubheadline).toBe(fixture.heroSubheadline);
  });

  it('maps story fields including blocks content', () => {
    const result = aboutPageMapper(fixture);
    expect(result.storyTitle).toBe(fixture.storyTitle);
    expect(result.storyContent).toBe(fixture.storyContent);
  });

  it('maps mission fields', () => {
    const result = aboutPageMapper(fixture);
    expect(result.missionTitle).toBe(fixture.missionTitle);
    expect(result.missionStatement).toBe(fixture.missionStatement);
    expect(result.missionOurVisionLabel).toBe(fixture.missionOurVisionLabel);
    expect(result.missionVision).toBe(fixture.missionVision);
  });

  it('maps differentiators array — length and fields', () => {
    const result = aboutPageMapper(fixture);
    expect(result.differentiators).toHaveLength(2);
    expect(result.differentiators[0].title).toBe('We Preserve Brands');
    expect(result.differentiators[0].description).toBe('No rebranding.');
  });

  it('maps closing fields', () => {
    const result = aboutPageMapper(fixture);
    expect(result.closingTitle).toBe(fixture.closingTitle);
    expect(result.closingDescription).toBe(fixture.closingDescription);
  });

  it('returns empty array when differentiators is empty', () => {
    const result = aboutPageMapper({ ...fixture, differentiators: [] });
    expect(result.differentiators).toEqual([]);
  });

  it('passes optional trustIndicator through when present', () => {
    const result = aboutPageMapper({ ...fixture, trustIndicator: 'Active & growing' });
    expect(result.trustIndicator).toBe('Active & growing');
  });
});
