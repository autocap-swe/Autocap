import type { CmsPrivacyPolicy, PrivacyPolicy } from './types';

export function privacyPolicyMapper(cms: CmsPrivacyPolicy): PrivacyPolicy {
  return {
    lastUpdated: cms.lastUpdated,
    contactEmail: cms.contactEmail,
    version: cms.version,
    sections: cms.sections.map(section => ({
      id: section.sectionId,
      title: section.title,
      content: section.content
        .split('\n\n')
        .map(p => p.trim())
        .filter(Boolean),
    })),
  };
}
