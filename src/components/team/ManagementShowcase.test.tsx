import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { TeamMember } from '@/types/team';
import { ManagementShowcase } from './ManagementShowcase';

const members: TeamMember[] = [
  {
    id: 1,
    name: 'Anna CEO',
    title: 'CEO',
    bio: 'Bio of Anna.',
    email: 'anna@example.com',
    isManagement: true,
    isBoard: false,
    order: 1,
  },
  {
    id: 2,
    name: 'Bo CFO',
    title: 'CFO',
    bio: 'Bio of Bo.',
    email: 'bo@example.com',
    isManagement: true,
    isBoard: false,
    order: 2,
  },
];

function panel() {
  return document.querySelector('[aria-live="polite"]') as HTMLElement;
}

describe('ManagementShowcase', () => {
  it('selects the first member by default (AC-T2)', () => {
    render(<ManagementShowcase members={members} emailLabel="E-mail" />);
    expect(panel()).toHaveTextContent('Bio of Anna.');
    expect(panel()).not.toHaveTextContent('Bio of Bo.');
    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows another member when clicked (AC-T3)', async () => {
    render(<ManagementShowcase members={members} emailLabel="E-mail" />);
    await userEvent.click(screen.getByRole('button', { name: /Bo CFO/ }));
    expect(panel()).toHaveTextContent('Bio of Bo.');
    expect(panel()).toHaveTextContent('bo@example.com');
    expect(screen.getByRole('button', { name: /Bo CFO/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders nothing without members', () => {
    const { container } = render(<ManagementShowcase members={[]} emailLabel="E-mail" />);
    expect(container).toBeEmptyDOMElement();
  });
});
