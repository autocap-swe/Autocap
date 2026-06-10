import type { CmsTeamMember } from './types';
import type { TeamMember } from '@/types/team';

const CMS_URL = (process.env.CMS_API_URL ?? 'http://localhost:1337').replace(/\/$/, '');

function resolveUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${CMS_URL}${url}`;
}

export function teamMemberMapper(cms: CmsTeamMember): TeamMember {
  return {
    id: cms.id,
    name: cms.name,
    title: cms.title,
    bio: cms.bio,
    education: cms.education ?? undefined,
    photoUrl: resolveUrl(cms.photo?.url),
    linkedInUrl: cms.linkedInUrl ?? undefined,
    isManagement: cms.isManagement ?? false,
    isBoard: cms.isBoard ?? false,
    order: cms.order,
  };
}

export function teamMembersMapper(items: CmsTeamMember[]): TeamMember[] {
  return items.map(teamMemberMapper);
}
