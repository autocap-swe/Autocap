import type { CmsEntrepreneursPage, EntrepreneursPageContent } from './types';

export function entrepreneursPageMapper(cms: CmsEntrepreneursPage): EntrepreneursPageContent {
  return { ...cms };
}
