import Image from 'next/image';
import { Linkedin } from 'lucide-react';
import type { TeamMember } from '@/types/team';
import { PhotoPlaceholder } from './PhotoPlaceholder';

interface ProfileCardProps {
  member: TeamMember;
}

export function ProfileCard({ member }: ProfileCardProps) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-8 shadow-sm">
      {/* Photo or Placeholder */}
      <div className="mb-6">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={`${member.name}, ${member.title}`}
            width={160}
            height={160}
            className="rounded-full object-cover"
          />
        ) : (
          <PhotoPlaceholder name={member.name} size="md" />
        )}
      </div>

      {/* Name */}
      <h3 className="mb-2 text-center text-2xl font-bold text-[#1C1C1E]">{member.name}</h3>

      {/* Title */}
      <p className="mb-4 text-center font-semibold text-[#C8102E]">{member.title}</p>

      {/* Bio */}
      <p className="mb-4 text-center text-sm leading-relaxed text-gray-700">{member.bio}</p>

      {/* Education */}
      {member.education && (
        <p className="mb-4 text-center text-xs text-gray-500">{member.education}</p>
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
