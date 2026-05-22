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
    <footer className="bg-[#1C1C1E] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Company info */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Image
                src="/logos/autocap-white.png"
                alt="AutoCap Group"
                width={160}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{t('tagline')}</p>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t('companySection')}</h3>
            <ul className="space-y-3">
              {footerSections.company.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For You links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t('forYouSection')}</h3>
            <ul className="space-y-3">
              {footerSections.forYou.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t('resourcesSection')}</h3>
            <ul className="space-y-3">
              {footerSections.resources.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {t('privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
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
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400 text-center md:text-left">
            {COMPANY_INFO.name} · {t('bottomBar')} — {t('tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
