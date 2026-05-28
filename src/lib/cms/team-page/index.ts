import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsTeamPage, TeamPageContent } from './types';
import { teamPageMapper } from './mapper';

export async function getTeamPageContent(
  revalidate = REVALIDATE_HIGH,
  locale?: string
): Promise<TeamPageContent> {
  return getContent<CmsTeamPage, TeamPageContent>('team-page', {
    revalidate,
    mapper: teamPageMapper,
    locale,
    tags: ['team-page'],
    params: { populate: 'heroImage,seo' },
  });
}
