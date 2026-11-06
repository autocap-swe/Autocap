import type { TeamMember } from '@/types/team';

export interface TeamGroups {
  management: TeamMember[];
  groupFunctions: TeamMember[];
  board: TeamMember[];
}

/** Group functions are people who are neither in management nor on the board. */
export function splitTeam(members: TeamMember[]): TeamGroups {
  return {
    management: members.filter(member => member.isManagement),
    groupFunctions: members.filter(member => !member.isManagement && !member.isBoard),
    board: members.filter(member => member.isBoard),
  };
}
