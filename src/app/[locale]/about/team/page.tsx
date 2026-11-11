import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Eyebrow, LeadershipPanel, PageHeader, Section, type Leader } from '@/components/ds';
import { getTeamMembersContent } from '@/lib/cms/team-member';
import { getTeamPageContent } from '@/lib/cms/team-page';
import { buildMetadata } from '@/lib/cms/seo';
import { EMAIL_FALLBACK, PORTRAIT_FALLBACK } from '@/lib/v2/people';

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
  const [t, tInv, members] = await Promise.all([
    getTranslations('v2.team'),
    getTranslations('v2.investors.gov'),
    getTeamMembersContent(locale).catch(() => []),
  ]);

  const management = members.filter(member => member.isManagement);
  const leaders: Leader[] = [
    ...management.map(member => ({
      id: member.id,
      name: member.name,
      title: member.title,
      bio: member.bio,
      education: member.education,
      email: member.email ?? EMAIL_FALLBACK[member.name],
      linkedInUrl: member.linkedInUrl,
      photoUrl: PORTRAIT_FALLBACK[member.name] ?? member.photoUrl,
    })),
    // Group Accounting Manager is not in the CMS yet; text from the published news item.
    ...(management.length > 0
      ? [
          {
            id: 'jolanta-kelly',
            name: 'Jolanta Kelly',
            title: t('jolantaTitle'),
            bio: t('jolantaBio'),
            photoUrl: PORTRAIT_FALLBACK['Jolanta Kelly'],
          },
        ]
      : []),
  ];

  const boardFromCms = members.filter(member => member.isBoard);
  const board = boardFromCms.map(member => ({
      id: String(member.id),
      name: member.name,
      role: member.isManagement ? t('boardMember') : member.title,
      text: member.isManagement ? `${member.title}. ${t('bioUnderLeadership')}` : member.bio,
      photoUrl: PORTRAIT_FALLBACK[member.name] ?? member.photoUrl,
    }));

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} lead={t('lead')} />

      <section className="border-b border-rule bg-white">
        <div className="mx-auto max-w-[1440px]">
          <LeadershipPanel leaders={leaders} listLabel={t('listLabel')} />
        </div>
      </section>

      <Section tone="birch">
        <Eyebrow className="mb-2">{t('boardEyebrow')}</Eyebrow>
        <h2 className="t-h2-sm m-0 mb-7">{t('boardTitle')}</h2>
        <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {board.map(member => (
            <li key={member.id} className="flex flex-col bg-white">
              <div className="relative h-[260px] bg-rule">
                {member.photoUrl && (
                  <Image
                    src={member.photoUrl}
                    alt={`${member.name}, ${member.role}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top saturate-[0.85]"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 p-5">
                <strong className="text-lg font-semibold">{member.name}</strong>
                <span className="t-meta text-red">{member.role}</span>
                <span className="mt-1.5 text-sm leading-[1.5] text-text-2">{member.text}</span>
              </div>
            </li>
          ))}
        </ul>
        <table className="mt-8 w-full max-w-[720px] border-collapse text-[15px]">
          <tbody>
            {[
              [t('auditor'), tInv('auditorValue')],
              [t('legal'), tInv('legalValue')],
            ].map(([label, value]) => (
              <tr key={label} className="border-t border-on-dark-2 last:border-b">
                <th scope="row" className="py-3 pr-6 text-left align-top font-semibold">
                  {label}
                </th>
                <td className="py-3 text-text-2">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </>
  );
}
