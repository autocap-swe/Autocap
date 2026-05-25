import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsTeamMember } from './types';
import type { TeamMember } from '@/types/team';
import { teamMembersMapper } from './mapper';

export async function getTeamMembersContent(
  locale?: string,
  revalidate = REVALIDATE_HIGH
): Promise<TeamMember[]> {
  return getContent<CmsTeamMember[], TeamMember[]>('team-members', {
    revalidate,
    tags: ['team-members'],
    params: {
      'pagination[pageSize]': '50',
      'sort[0]': 'order:asc',
      populate: 'photo',
    },
    mapper: teamMembersMapper,
    locale,
  });
}
