'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Linkedin, Mail } from 'lucide-react';
import type { TeamMember } from '@/types/team';
import { PhotoPlaceholder } from './PhotoPlaceholder';

interface ManagementShowcaseProps {
  members: TeamMember[];
  emailLabel: string;
}

function ProfileDetails({ member, emailLabel }: { member: TeamMember; emailLabel: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-2xl font-semibold text-white md:text-3xl">{member.name}</h3>
        <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-[#C8102E]">
          {member.title}
        </p>
      </div>
      <p className="text-sm leading-relaxed text-white/80 md:text-base">{member.bio}</p>
      {member.education && <p className="text-xs text-white/60">{member.education}</p>}
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            aria-label={`${emailLabel} ${member.name}`}
            className="inline-flex items-center gap-2 text-sm text-white underline-offset-4 hover:text-[#C8102E] hover:underline"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {member.email}
          </a>
        )}
        {member.linkedInUrl && (
          <a
            href={member.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn: ${member.name}`}
            className="inline-flex items-center gap-2 text-sm text-white underline-offset-4 hover:text-[#C8102E] hover:underline"
          >
            <Linkedin className="h-4 w-4" aria-hidden />
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}

function Portrait({ member, sizes }: { member: TeamMember; sizes: string }) {
  if (!member.photoUrl) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-[#2C2C2E]">
        <PhotoPlaceholder name={member.name} size="md" />
      </div>
    );
  }
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-[#F4F4F4]">
      <Image
        src={member.photoUrl}
        alt={`${member.name}, ${member.title}`}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

/**
 * Large screens: name list on the left, the selected profile in a dark panel on the right.
 * Small screens: every profile shown in full, stacked.
 */
export function ManagementShowcase({ members, emailLabel }: ManagementShowcaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = members[selectedIndex] ?? members[0];
  if (!selected) return null;

  return (
    <>
      {/* Stacked profiles, below lg */}
      <div className="flex flex-col gap-8 lg:hidden">
        {members.map(member => (
          <article key={member.id} className="overflow-hidden bg-[#0E0E0E]">
            <Portrait member={member} sizes="100vw" />
            <div className="p-6">
              <ProfileDetails member={member} emailLabel={emailLabel} />
            </div>
          </article>
        ))}
      </div>

      {/* List + detail panel, lg and up */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,9fr)]">
        <ul className="flex flex-col border-l border-[#E4E2DE]">
          {members.map((member, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li key={member.id} className="border-b border-[#E4E2DE] last:border-b-0">
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedIndex(index)}
                  className={`-ml-px flex w-full items-center gap-4 border-l-2 py-5 pl-6 pr-4 text-left transition-colors ${
                    isSelected
                      ? 'border-[#C8102E] bg-[#F5F0EB]'
                      : 'border-transparent hover:bg-[#F5F0EB]/60'
                  }`}
                >
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden bg-[#F4F4F4]">
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <PhotoPlaceholder name={member.name} size="sm" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-lg font-semibold ${isSelected ? 'text-[#1C1C1E]' : 'text-[#1C1C1E]/70'}`}
                    >
                      {member.name}
                    </span>
                    <span className="block text-sm text-gray-500">{member.title}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className={`h-5 w-5 shrink-0 text-[#C8102E] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <div
          aria-live="polite"
          className="grid min-h-[30rem] grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-stretch bg-[#0E0E0E]"
        >
          <div className="flex flex-col justify-center p-10 xl:p-12">
            <ProfileDetails member={selected} emailLabel={emailLabel} />
          </div>
          <div className="relative">
            {selected.photoUrl ? (
              <Image
                key={selected.id}
                src={selected.photoUrl}
                alt={`${selected.name}, ${selected.title}`}
                fill
                sizes="(min-width: 1024px) 32vw, 100vw"
                className="object-contain object-bottom"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <PhotoPlaceholder name={selected.name} size="md" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
