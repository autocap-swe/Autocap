import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getTeamMembersContent } from '@/lib/cms/team-member';
import { getTeamPageContent } from '@/lib/cms/team-page';
import { ProfileCard } from '@/components/team/ProfileCard';
import { ManagementShowcase } from '@/components/team/ManagementShowcase';
import { GroupFunctionCard } from '@/components/team/GroupFunctionCard';
import { splitTeam } from '@/components/team/split-team';
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
    locale,
    { path: '/about/team', fallbackOgImage: cms?.heroImage }
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

  const { management, groupFunctions, board } = splitTeam(allMembers);
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
          <h2 className="mb-10 text-3xl font-bold text-[#1C1C1E] md:mb-12 md:text-4xl">
            {t('managementTeam.title')}
          </h2>
          <ManagementShowcase members={management} emailLabel={t('emailLabel')} />
        </div>
      </section>

      {groupFunctions.length > 0 && (
        <section className="bg-[#F5F0EB] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-10 text-3xl font-bold text-[#1C1C1E] md:mb-12 md:text-4xl">
              {t('groupFunctions.title')}
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {groupFunctions.map(member => (
                <GroupFunctionCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-3xl font-bold text-[#1C1C1E] md:mb-12 md:text-4xl">
            {t('board.title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {board.map(member => (
              <ProfileCard
                key={member.id}
                member={{ ...member, email: undefined }}
                titleOverride={member.isManagement ? t('board.memberTitle') : undefined}
                hideBio={member.isManagement}
                showPlaceholder={false}
                emailLabel={t('emailLabel')}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
