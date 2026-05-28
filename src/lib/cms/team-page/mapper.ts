import type { CmsTeamPage, TeamPageContent } from './types';

export function teamPageMapper(cms: CmsTeamPage): TeamPageContent {
  return { ...cms };
}
