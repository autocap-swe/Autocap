'use client';

import { useState } from 'react';
import Image from 'next/image';

export interface Leader {
  id: number | string;
  name: string;
  title: string;
  bio: string;
  education?: string;
  email?: string;
  linkedInUrl?: string;
  photoUrl?: string;
}

function Details({ leader }: { leader: Leader }) {
  return (
    <div className="flex flex-col gap-3.5">
      <h2 className="m-0 text-[32px] font-light leading-[1.05] tracking-[-0.03em] text-white lg:text-4xl">
        {leader.name}
      </h2>
      <p className="t-eyebrow m-0 text-red">{leader.title}</p>
      <p className="m-0 whitespace-pre-line text-[15px] leading-[1.55] text-on-dark-2">{leader.bio}</p>
      {leader.education && <p className="t-meta m-0 text-text-3">{leader.education}</p>}
      <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
        {leader.email && (
          <a href={`mailto:${leader.email}`} className="text-white underline-offset-4 hover:underline">
            {leader.email}
          </a>
        )}
        {leader.linkedInUrl && (
          <a
            href={leader.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn: ${leader.name}`}
            className="text-on-dark-2 no-underline hover:text-white"
          >
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}

function Portrait({ leader, sizes, className }: { leader: Leader; sizes: string; className?: string }) {
  if (!leader.photoUrl) return <div className={`bg-ink-2 ${className ?? ''}`} />;
  return (
    <div className={`relative overflow-hidden bg-ink-2 ${className ?? ''}`}>
      <Image
        src={leader.photoUrl}
        alt={`${leader.name}, ${leader.title}`}
        fill
        sizes={sizes}
        className="object-cover object-top saturate-[0.85]"
      />
    </div>
  );
}

/** Leadership list with a detail panel on black (lg+); every profile in full below lg. */
export function LeadershipPanel({ leaders, listLabel }: { leaders: Leader[]; listLabel: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = leaders[selectedIndex] ?? leaders[0];
  if (!selected) return null;

  return (
    <>
      <div className="flex flex-col lg:hidden">
        {leaders.map(leader => (
          <article key={leader.id} className="bg-ink">
            <Portrait leader={leader} sizes="100vw" className="aspect-square w-full" />
            <div className="px-5 py-8">
              <Details leader={leader} />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden min-h-[560px] lg:grid lg:grid-cols-[2fr_3fr]">
        <ul aria-label={listLabel} className="m-0 flex list-none flex-col border-r border-rule py-10 pl-16 pr-12">
          {leaders.map((leader, index) => {
            const active = index === selectedIndex;
            return (
              <li key={leader.id} className="border-b border-rule last:border-b-0">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedIndex(index)}
                  className="grid w-full grid-cols-[56px_1fr_auto] items-center gap-4 py-4 text-left"
                >
                  <Portrait leader={leader} sizes="56px" className="h-14 w-14" />
                  <span>
                    <span className={`block text-lg ${active ? 'font-semibold text-ink' : 'text-text-2'}`}>
                      {leader.name}
                    </span>
                    <span className={`t-meta block ${active ? 'text-red' : 'text-text-2'}`}>{leader.title}</span>
                  </span>
                  <span aria-hidden="true" className={active ? 'text-red' : 'text-text-3'}>
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <article aria-live="polite" className="grid grid-cols-2 bg-ink">
          <div className="flex flex-col justify-center p-12">
            <Details leader={selected} />
          </div>
          <Portrait key={selected.id} leader={selected} sizes="30vw" className="min-h-[420px]" />
        </article>
      </div>
    </>
  );
}
