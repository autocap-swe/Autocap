import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadershipPanel, type Leader } from './LeadershipPanel';

const leaders: Leader[] = [
  { id: 1, name: 'Anna Ceo', title: 'CEO', bio: 'Bio of Anna.', email: 'anna@example.com' },
  { id: 2, name: 'Bo Cfo', title: 'CFO', bio: 'Bio of Bo.', email: 'bo@example.com' },
];

function panel() {
  return document.querySelector('article[aria-live="polite"]') as HTMLElement;
}

describe('LeadershipPanel (AC-V2-T1)', () => {
  it('shows the first leader by default', () => {
    render(<LeadershipPanel leaders={leaders} listLabel="Leadership" />);
    expect(panel()).toHaveTextContent('Bio of Anna.');
    expect(screen.getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows another leader with e-mail when clicked', async () => {
    render(<LeadershipPanel leaders={leaders} listLabel="Leadership" />);
    await userEvent.click(screen.getByRole('button', { name: /Bo Cfo/ }));
    expect(panel()).toHaveTextContent('Bio of Bo.');
    expect(panel()).toHaveTextContent('bo@example.com');
  });
});
