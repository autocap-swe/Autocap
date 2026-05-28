import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { COMPANY_INFO, NAVIGATION_LINKS } from '@/lib/constants';
import { CookieSettingsButton } from '@/components/cookie/CookieSettingsButton';

export async function Footer() {
  const [t, tNav] = await Promise.all([getTranslations('footer'), getTranslations('nav')]);

  const navLabel: Record<string, string> = {
    '/': tNav('home'),
    '/about': tNav('about.label'),
    '/portfolio': tNav('portfolio'),
    '/entrepreneurs': tNav('entrepreneurs'),
    '/investors': tNav('investors'),
    '/news': tNav('newsMedia'),
    '/sustainability': tNav('sustainability'),
    '/contact': tNav('contact'),
  };

  const translatedLinks = NAVIGATION_LINKS.map(link => ({
    href: link.href,
    label: navLabel[link.href] ?? link.label,
  }));

  const footerSections = {
    company: translatedLinks.slice(0, 3),
    forYou: translatedLinks.slice(3, 5),
    resources: translatedLinks.slice(5),
  };

  return (
    <footer className="bg-[#1C1C1E] text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:gap-8">
          {/* Company info */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image
                src="/logos/autocap-white.png"
                alt="AutoCap Group"
                width={128}
                height={32}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{t('tagline')}</p>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-medium mb-3 uppercase tracking-wide text-gray-300">
              {t('companySection')}
            </h3>
            <ul className="space-y-2">
              {footerSections.company.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For You links */}
          <div>
            <h3 className="text-sm font-medium mb-3 uppercase tracking-wide text-gray-300">
              {t('forYouSection')}
            </h3>
            <ul className="space-y-2">
              {footerSections.forYou.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-medium mb-3 uppercase tracking-wide text-gray-300">
              {t('resourcesSection')}
            </h3>
            <ul className="space-y-2">
              {footerSections.resources.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {t('cookiePolicy')}
                </Link>
              </li>
              <li>
                <CookieSettingsButton />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-gray-700/40 pt-6">
          <p className="text-xs text-gray-400 text-center md:text-left">
            {COMPANY_INFO.name} · {t('bottomBar')} — {t('tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
