import type { TeamMember } from '@/types/team';
import { splitTeam } from './split-team';

function member(id: number, isManagement: boolean, isBoard: boolean): TeamMember {
  return { id, name: `M${id}`, title: 'T', bio: 'B', isManagement, isBoard, order: id };
}

describe('splitTeam (AC-T1, AC-T5)', () => {
  it('splits members into management, functions and board', () => {
    const groups = splitTeam([
      member(1, true, false),
      member(2, true, true),
      member(3, false, false),
      member(4, false, true),
    ]);
    expect(groups.management.map(m => m.id)).toEqual([1, 2]);
    expect(groups.groupFunctions.map(m => m.id)).toEqual([3]);
    expect(groups.board.map(m => m.id)).toEqual([2, 4]);
  });

  it('returns empty functions list when none', () => {
    expect(splitTeam([member(1, true, false)]).groupFunctions).toEqual([]);
  });
});
