import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getTeamMembersContent } from '@/lib/cms/team-member';
import { getTeamPageContent } from '@/lib/cms/team-page';
import { ProfileCard } from '@/components/team/ProfileCard';
import { buildMetadata } from '@/lib/cms/seo';
import { cmsMediaUrl } from '@/lib/cms/media';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const cms = await getTeamPageContent(undefined, locale).catch(() => null);
  return buildMetadata(
    {
      title: 'Leadership & Board · AutoCap Group',
      description:
        'Meet the team behind AutoCap Group — entrepreneurs, industry veterans, and investors.',
    },
    cms?.seo,
    locale
  );
}

export default async function TeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [allMembers, t, cms] = await Promise.all([
    getTeamMembersContent(locale).catch(() => []),
    getTranslations('team'),
    getTeamPageContent(undefined, locale).catch(() => null),
  ]);

  const managementTeam = allMembers.filter(m => m.isManagement);
  const board = allMembers.filter(m => m.isBoard);
  const heroImageUrl = cmsMediaUrl(cms?.heroImage);
  const heroTitle = cms?.heroTitle;
  const heroDescription = cms?.heroDescription;

  return (
    <main>
      <section
        className={`relative overflow-hidden py-20 md:py-28 ${!heroImageUrl ? 'bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E]' : ''}`}
      >
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt="Leadership & Board"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative mx-auto max-w-4xl px-6 text-center md:px-12">
          {heroTitle && (
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">{heroTitle}</h1>
          )}
          {heroDescription && (
            <p className="text-lg leading-relaxed text-white/90 md:text-xl">{heroDescription}</p>
          )}
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
