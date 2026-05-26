import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getTeamMembersContent } from '@/lib/cms/team-member';
import { ProfileCard } from '@/components/team/ProfileCard';

export const metadata: Metadata = {
  title: 'Leadership & Board · AutoCap Group',
  description:
    'Meet the team behind AutoCap Group — entrepreneurs, industry veterans, and investors.',
};

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('team');

  const allMembers = await getTeamMembersContent(locale).catch(() => []);
  const managementTeam = allMembers.filter(m => m.category === 'management');
  const board = allMembers.filter(m => m.category === 'board');

  return (
    <main>
      <section className="relative overflow-hidden py-20 md:py-28">
        <Image
          src="/images/Leadership & Board.webp"
          alt="Leadership & Board"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-4xl px-6 text-center md:px-12">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">{t('hero.title')}</h1>
          <p className="text-lg leading-relaxed text-white/90 md:text-xl">
            {t('hero.description')}
          </p>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#1C1C1E] md:text-4xl">
            {t('managementTeam.title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {managementTeam.map(member => (
              <ProfileCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-[#1C1C1E] md:text-4xl">
            {t('board.title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {board.map(member => (
              <ProfileCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
