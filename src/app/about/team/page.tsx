import type { Metadata } from 'next';
import Image from 'next/image';
import { teamContent } from '@/content/team';
import { ProfileCard } from '@/components/team/ProfileCard';

export const metadata: Metadata = {
  title: 'Leadership & Board · AutoCap Group',
  description:
    'Meet the team behind AutoCap Group — entrepreneurs, industry veterans, and investors.',
};

export default function TeamPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden px-6 py-16 md:px-12 md:py-24">
        <Image
          src="/images/Leadership%20%26%20Board.webp"
          alt="AutoCap leadership and board"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/15" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            {teamContent.hero.title}
          </h1>
          <p className="text-lg leading-relaxed text-white md:text-xl">
            {teamContent.hero.description}
          </p>
        </div>
      </section>

      {/* Management Team Section */}
      <section className="bg-white px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#1C1C1E] md:text-4xl">
            Management Team
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {teamContent.managementTeam.map(member => (
              <ProfileCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      {/* Board of Directors Section */}
      <section className="bg-gray-50 px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#1C1C1E] md:text-4xl">
            Board of Directors
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {teamContent.board.map(member => (
              <ProfileCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
