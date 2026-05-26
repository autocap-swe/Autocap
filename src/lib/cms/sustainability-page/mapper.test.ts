import { sustainabilityPageMapper } from './mapper';
import type { CmsSustainabilityPage } from './types';

const fixture: CmsSustainabilityPage = {
  heroHeadline: 'Practical steps. Honest progress.',
  heroIntro: 'Sustainability in the tire service industry.',
  whereWeAreTitle: 'Where we are',
  whereWeAreDescription: 'AutoCap is in an early stage.',
  whereWeAreCurrentFocusLabel: 'Current focus areas',
  whereWeAreFocusAreas: [
    { text: 'Standardising tire recycling' },
    { text: 'Evaluating energy consumption' },
    { text: 'Consolidating logistics' },
  ],
  whereWeAreGoingTitle: "Where we're going",
  whereWeAreGoingDescription: 'As our portfolio grows.',
  whereWeAreGoingStatement: 'Efficiency and sustainability reinforce each other.',
  governanceTitle: 'Governance',
  governanceDescription: 'Oversight sits with management.',
  governanceContactText: 'For questions, contact',
  governanceContactEmail: 'kontakt@autocapgroup.se',
};

describe('sustainabilityPageMapper', () => {
  it('maps hero fields', () => {
    const result = sustainabilityPageMapper(fixture);
    expect(result.heroHeadline).toBe(fixture.heroHeadline);
    expect(result.heroIntro).toBe(fixture.heroIntro);
  });

  it('maps whereWeAre fields', () => {
    const result = sustainabilityPageMapper(fixture);
    expect(result.whereWeAreTitle).toBe(fixture.whereWeAreTitle);
    expect(result.whereWeAreDescription).toBe(fixture.whereWeAreDescription);
    expect(result.whereWeAreCurrentFocusLabel).toBe(fixture.whereWeAreCurrentFocusLabel);
  });

  it('maps whereWeAreFocusAreas text-item array — length and text', () => {
    const result = sustainabilityPageMapper(fixture);
    expect(result.whereWeAreFocusAreas).toHaveLength(3);
    expect(result.whereWeAreFocusAreas[0].text).toBe('Standardising tire recycling');
    expect(result.whereWeAreFocusAreas[2].text).toBe('Consolidating logistics');
  });

  it('maps whereWeAreGoing fields', () => {
    const result = sustainabilityPageMapper(fixture);
    expect(result.whereWeAreGoingTitle).toBe(fixture.whereWeAreGoingTitle);
    expect(result.whereWeAreGoingDescription).toBe(fixture.whereWeAreGoingDescription);
    expect(result.whereWeAreGoingStatement).toBe(fixture.whereWeAreGoingStatement);
  });

  it('maps governance fields', () => {
    const result = sustainabilityPageMapper(fixture);
    expect(result.governanceTitle).toBe(fixture.governanceTitle);
    expect(result.governanceContactEmail).toBe(fixture.governanceContactEmail);
  });

  it('returns empty array when whereWeAreFocusAreas is empty', () => {
    const result = sustainabilityPageMapper({ ...fixture, whereWeAreFocusAreas: [] });
    expect(result.whereWeAreFocusAreas).toEqual([]);
  });
});
