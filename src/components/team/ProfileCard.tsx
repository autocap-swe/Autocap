import Image from 'next/image';
import { Linkedin, Mail } from 'lucide-react';
import type { TeamMember } from '@/types/team';
import { PhotoPlaceholder } from './PhotoPlaceholder';

interface ProfileCardProps {
  member: TeamMember;
  /** Overrides the member's own title, e.g. "Board Member" for a manager who also sits on the board. */
  titleOverride?: string;
  /** Show initials when there is no photo. Off for the board: photo or nothing. */
  showPlaceholder?: boolean;
  /** Hide the bio, used when the same person is already presented in another section. */
  hideBio?: boolean;
  emailLabel?: string;
}

export function ProfileCard({
  member,
  titleOverride,
  showPlaceholder = true,
  hideBio = false,
  emailLabel = 'E-mail',
}: ProfileCardProps) {
  const title = titleOverride ?? member.title;
  const showPhotoArea = Boolean(member.photoUrl) || showPlaceholder;

  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-8 shadow-sm">
      {/* Photo or Placeholder */}
      {showPhotoArea && (
        <div className="mb-6">
          {member.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={`${member.name}, ${title}`}
              width={160}
              height={160}
              className="rounded-full object-cover"
            />
          ) : (
            <PhotoPlaceholder name={member.name} size="md" />
          )}
        </div>
      )}

      {/* Name */}
      <h3 className="mb-2 text-center text-2xl font-bold text-[#1C1C1E]">{member.name}</h3>

      {/* Title */}
      <p className="mb-4 text-center font-semibold text-[#C8102E]">{title}</p>

      {/* Bio */}
      {!hideBio && (
        <p className="mb-4 text-center text-sm leading-relaxed text-gray-700">{member.bio}</p>
      )}

      {/* Education */}
      {!hideBio && member.education && (
        <p className="mb-4 text-center text-xs text-gray-500">{member.education}</p>
      )}

      {/* E-mail */}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          aria-label={`${emailLabel} ${member.name}`}
          className="mb-2 inline-flex items-center gap-2 text-sm text-[#1C1C1E] transition-colors hover:text-[#C8102E] hover:underline"
        >
          <Mail className="h-4 w-4" />
          <span>{member.email}</span>
        </a>
      )}

      {/* LinkedIn Link */}
      {member.linkedInUrl && (
        <a
          href={member.linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`LinkedIn profile for ${member.name}`}
          className="inline-flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-800 hover:underline"
        >
          <Linkedin className="h-4 w-4" />
          <span>LinkedIn</span>
        </a>
      )}
    </div>
  );
}
