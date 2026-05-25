import type { Metadata } from 'next';
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
      <section className="bg-[#EDE4D8] px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold text-[#1C1C1E] md:text-5xl">{t('hero.title')}</h1>
          <p className="text-lg leading-relaxed text-gray-700 md:text-xl">
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
