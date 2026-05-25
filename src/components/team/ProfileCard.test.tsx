import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { TeamMember } from '@/types/team';
import { ProfileCard } from './ProfileCard';

describe('ProfileCard', () => {
  const mockMemberWithPhoto: TeamMember = {
    id: 1,
    name: 'Test User',
    title: 'Chief Test Officer',
    bio: 'Experienced testing professional with a track record of finding bugs and ensuring quality.',
    education: 'B.Sc. Computer Science',
    photoUrl: '/images/team/test-user.jpg',
    linkedInUrl: 'https://linkedin.com/in/testuser',
    category: 'management',
    order: 1,
  };

  const mockMemberWithoutPhoto: TeamMember = {
    id: 2,
    name: 'No Photo User',
    title: 'Director of Privacy',
    bio: 'Privacy-focused professional who prefers not to share photos.',
    education: 'M.Sc. Data Protection',
    photoUrl: undefined,
    linkedInUrl: undefined,
    category: 'board',
    order: 2,
  };

  describe('AC-003: Profile Card Structure', () => {
    it('renders all profile card elements when all data provided', () => {
      render(<ProfileCard member={mockMemberWithPhoto} />);

      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Chief Test Officer')).toBeInTheDocument();
      expect(screen.getByText(/Experienced testing professional/)).toBeInTheDocument();
      expect(screen.getByText('B.Sc. Computer Science')).toBeInTheDocument();
    });

    it('renders photo placeholder when photoUrl is not provided', () => {
      render(<ProfileCard member={mockMemberWithoutPhoto} />);

      // Should render placeholder with initials
      expect(screen.getByText('NU')).toBeInTheDocument();
    });

    it('hides education when not provided', () => {
      const memberWithoutEducation = { ...mockMemberWithPhoto, education: undefined };
      render(<ProfileCard member={memberWithoutEducation} />);

      // Education should not be in document
      expect(screen.queryByText('B.Sc. Computer Science')).not.toBeInTheDocument();
    });

    it('hides LinkedIn link when not provided', () => {
      render(<ProfileCard member={mockMemberWithoutPhoto} />);

      // Should not have any links
      const links = screen.queryAllByRole('link');
      expect(links).toHaveLength(0);
    });
  });

  describe('AC-011: LinkedIn Link Interaction', () => {
    it('opens LinkedIn link in new tab with security attributes', () => {
      render(<ProfileCard member={mockMemberWithPhoto} />);

      const linkedInLink = screen.getByRole('link', { name: /LinkedIn profile/i });
      expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/in/testuser');
      expect(linkedInLink).toHaveAttribute('target', '_blank');
      expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('has accessible aria-label for LinkedIn link', () => {
      render(<ProfileCard member={mockMemberWithPhoto} />);

      const linkedInLink = screen.getByRole('link');
      expect(linkedInLink).toHaveAttribute('aria-label', 'LinkedIn profile for Test User');
    });
  });

  describe('AC-016: Keyboard Navigation', () => {
    it('allows keyboard focus on LinkedIn link', async () => {
      const user = userEvent.setup();
      render(<ProfileCard member={mockMemberWithPhoto} />);

      const linkedInLink = screen.getByRole('link');

      // Tab to link
      await user.tab();
      expect(linkedInLink).toHaveFocus();
    });
  });

  describe('AC-017: Screen Reader Support', () => {
    it('provides accessible labels for all elements', () => {
      const { container } = render(<ProfileCard member={mockMemberWithPhoto} />);

      // Name should be in a heading
      const nameHeading = screen.getByRole('heading', { name: 'Test User' });
      expect(nameHeading).toBeInTheDocument();

      // Photo should have alt text
      const img = container.querySelector('img');
      if (img) {
        expect(img).toHaveAttribute('alt', 'Test User, Chief Test Officer');
      }
    });
  });

  describe('AC-018: Content Structure and Styling', () => {
    it('applies consistent card styling', () => {
      const { container } = render(<ProfileCard member={mockMemberWithPhoto} />);

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('bg-white');
      expect(card.className).toContain('rounded');
      expect(card.className).toContain('shadow');
    });

    it('applies AutoCap Red color to title', () => {
      render(<ProfileCard member={mockMemberWithPhoto} />);

      const title = screen.getByText('Chief Test Officer');
      expect(title.className).toContain('text-[#C8102E]');
    });
  });
});
