import Image from 'next/image';
import type { TeamMember } from '@/types/team';
import { PhotoPlaceholder } from './PhotoPlaceholder';

/** Portrait card for group functions: photo, name and title only. */
export function GroupFunctionCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#C9D8E8]">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={`${member.name}, ${member.title}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <PhotoPlaceholder name={member.name} size="md" />
          </div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[#1C1C1E]">{member.name}</h3>
      <p className="text-sm text-gray-600">{member.title}</p>
    </article>
  );
}
