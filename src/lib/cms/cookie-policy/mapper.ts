import type { CmsCookiePolicy, CookiePolicy } from './types';

export function cookiePolicyMapper(cms: CmsCookiePolicy): CookiePolicy {
  return {
    lastUpdated: cms.lastUpdated,
    contactEmail: cms.contactEmail,
    heroDescription: cms.heroDescription,
    contactTitle: cms.contactTitle,
    contactDescription: cms.contactDescription,
    sections: cms.sections.map(section => ({
      id: section.sectionId,
      title: section.title,
      content: section.content
        .split('\n\n')
        .map(p => p.trim())
        .filter(Boolean),
    })),
    seo: cms.seo,
  };
}
