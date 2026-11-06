import { render, screen } from '@testing-library/react';
import type { TeamMember } from '@/types/team';
import { GroupFunctionCard } from './GroupFunctionCard';

const member: TeamMember = {
  id: 7,
  name: 'Jo Accountant',
  title: 'Group Accounting Manager',
  bio: 'Hidden bio.',
  photoUrl: '/images/team/jo.jpg',
  isManagement: false,
  isBoard: false,
  order: 7,
};

describe('GroupFunctionCard (AC-T4)', () => {
  it('shows name and title, no bio', () => {
    render(<GroupFunctionCard member={member} />);
    expect(screen.getByText('Jo Accountant')).toBeInTheDocument();
    expect(screen.getByText('Group Accounting Manager')).toBeInTheDocument();
    expect(screen.queryByText('Hidden bio.')).not.toBeInTheDocument();
    expect(screen.getByAltText('Jo Accountant, Group Accounting Manager')).toBeInTheDocument();
  });

  it('shows initials without photo', () => {
    render(<GroupFunctionCard member={{ ...member, photoUrl: undefined }} />);
    expect(screen.queryByRole('img', { name: /Jo Accountant, Group/ })).not.toBeInTheDocument();
  });
});
