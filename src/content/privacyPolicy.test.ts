import { privacyPolicyMapper } from '@/lib/cms/privacy-policy/mapper';
import type { CmsPrivacyPolicy } from '@/lib/cms/privacy-policy/types';

const mockCms: CmsPrivacyPolicy = {
  lastUpdated: '2026-04-01T00:00:00.000Z',
  contactEmail: 'kontakt@autocapgroup.se',
  sections: [
    {
      sectionId: 'introduction',
      title: '1. Introduction',
      content: 'First paragraph.\n\nSecond paragraph.',
    },
    {
      sectionId: 'data-we-collect',
      title: '2. Data We Collect',
      content: 'Only paragraph.',
    },
  ],
};

describe('privacyPolicyMapper', () => {
  it('maps lastUpdated and contactEmail', () => {
    const result = privacyPolicyMapper(mockCms);
    expect(result.lastUpdated).toBe('2026-04-01T00:00:00.000Z');
    expect(result.contactEmail).toBe('kontakt@autocapgroup.se');
  });

  it('splits content on double newline into paragraphs array', () => {
    const result = privacyPolicyMapper(mockCms);
    expect(result.sections[0].content).toEqual(['First paragraph.', 'Second paragraph.']);
  });

  it('single paragraph section returns array of one', () => {
    const result = privacyPolicyMapper(mockCms);
    expect(result.sections[1].content).toEqual(['Only paragraph.']);
  });

  it('maps sectionId to id', () => {
    const result = privacyPolicyMapper(mockCms);
    expect(result.sections[0].id).toBe('introduction');
    expect(result.sections[1].id).toBe('data-we-collect');
  });

  it('preserves title', () => {
    const result = privacyPolicyMapper(mockCms);
    expect(result.sections[0].title).toBe('1. Introduction');
  });

  it('filters empty paragraphs from extra newlines', () => {
    const cms: CmsPrivacyPolicy = {
      ...mockCms,
      sections: [{ sectionId: 'test', title: 'Test', content: 'A\n\n\n\nB' }],
    };
    const result = privacyPolicyMapper(cms);
    expect(result.sections[0].content).toEqual(['A', 'B']);
  });
});
