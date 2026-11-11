import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { COMPANY_INFO } from '@/lib/constants';
import { CookieSettingsButton } from '@/components/cookie/CookieSettingsButton';
import { Container } from '@/components/ds';
import { Wordmark } from './Wordmark';

const columnLink = 'text-on-dark-2 no-underline transition-colors hover:text-white';

export async function Footer() {
  const [t, tNav] = await Promise.all([getTranslations('footer'), getTranslations('nav')]);
  const year = new Date().getFullYear();
  const ir = COMPANY_INFO.investorRelations;

  const columns = [
    {
      title: t('companySection'),
      links: [
        { href: '/portfolio', label: tNav('ourCompanies') },
        { href: '/about/team', label: tNav('about.leadershipBoard') },
        { href: '/about/story', label: tNav('about.ourStory') },
        { href: '/sustainability', label: tNav('sustainability') },
      ],
    },
    {
      title: tNav('entrepreneurs.label'),
      links: [
        { href: '/entrepreneurs', label: tNav('entrepreneurs.overview') },
        { href: '/entrepreneurs/process', label: tNav('entrepreneurs.howItWorks') },
        { href: '/entrepreneurs/contact', label: tNav('entrepreneurs.contact') },
      ],
    },
    {
      title: t('investorsMediaSection'),
      links: [
        { href: '/investors', label: tNav('investors') },
        { href: '/news', label: tNav('newsShort') },
        { href: '/news/media-kit', label: tNav('news.mediaKit') },
        { href: '/contact', label: tNav('contact') },
      ],
    },
  ];

  return (
    <footer className="bg-ink text-[14px] text-on-dark-2">
      <Container className="pb-12 pt-10 lg:pt-12">
        <div className="grid grid-cols-1 gap-8 pb-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-2">
            <span>
              {COMPANY_INFO.name} · {t('orgNumberLabel')} {COMPANY_INFO.orgNumber}
            </span>
            <span>{t('bottomBar')}</span>
            <span>
              <span aria-label={t('investorRelationsAria')}>{t('investorRelationsLabel')}:</span>{' '}
              <a href={`mailto:${ir.email}`} className={columnLink}>
                {ir.name}, {ir.role}
              </a>
            </span>
            <a
              href={COMPANY_INFO.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('linkedInAria')}
              className="text-white no-underline hover:text-red"
            >
              LinkedIn →
            </a>
          </div>
          {columns.map(column => (
            <div key={column.title} className="flex flex-col gap-2">
              <h2 className="m-0 text-[14px] font-semibold tracking-normal text-white">{column.title}</h2>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {column.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className={columnLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-rule-dark pt-7">
          <Wordmark tone="white" className="h-14 sm:h-20 lg:h-28" />
          <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span>© {year} {COMPANY_INFO.name}</span>
            <Link href="/privacy-policy" className={columnLink}>
              {t('privacyPolicy')}
            </Link>
            <Link href="/cookies" className={columnLink}>
              {t('cookiePolicy')}
            </Link>
            <CookieSettingsButton />
          </p>
        </div>
      </Container>
    </footer>
  );
}
