'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { NAVIGATION_LINKS } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSelector } from './LanguageSelector';

type NavLink = {
  label: string;
  href: string;
  submenu?: readonly { label: string; href: string }[];
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const t = useTranslations('nav');

  const navLabel: Record<string, string> = {
    '/': t('home'),
    '/about': t('about.label'),
    '/portfolio': t('portfolio'),
    '/entrepreneurs': t('entrepreneurs'),
    '/investors': t('investors'),
    '/news': t('newsMedia'),
    '/sustainability': t('sustainability'),
    '/contact': t('contact'),
  };

  const submenuLabel: Record<string, string> = {
    '/about': t('about.companyOverview'),
    '/about/story': t('about.ourStory'),
    '/about/team': t('about.leadershipBoard'),
  };

  const translatedLinks = NAVIGATION_LINKS.map(link => ({
    ...link,
    label: navLabel[link.href] ?? link.label,
    submenu:
      'submenu' in link && link.submenu
        ? link.submenu.map(sub => ({ ...sub, label: submenuLabel[sub.href] ?? sub.label }))
        : undefined,
  }));

  const toggleMobileSubmenu = (label: string) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === label ? null : label);
  };

  const isLinkActive = (link: NavLink) => {
    if (link.submenu) {
      // Check if any submenu item is active
      return link.submenu.some(
        sublink => pathname === sublink.href || pathname.startsWith(sublink.href + '/')
      );
    }
    return pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Global">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex xl:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">AutoCap Group</span>
              <Image
                src="/logos/autocap-dark.png"
                alt="AutoCap"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Mobile/tablet menu button */}
          <div className="flex xl:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{mobileMenuOpen ? t('closeMenu') : t('openMenu')}</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden xl:flex xl:items-center xl:gap-x-8">
            {translatedLinks.map(link => {
              const isActive = isLinkActive(link);

              if ('submenu' in link && link.submenu) {
                const isOpen = desktopDropdownOpen === link.href;
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setDesktopDropdownOpen(link.href)}
                    onMouseLeave={() => setDesktopDropdownOpen(null)}
                  >
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold transition-all ${
                        isActive ? 'text-[#C8102E]' : 'text-gray-700'
                      }`}
                    >
                      <Link
                        href={link.href}
                        className={
                          isActive ? 'border-b-2 border-[#C8102E]' : 'hover:text-[#C8102E]'
                        }
                        onClick={() => setDesktopDropdownOpen(null)}
                      >
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-label={`${link.label} submenu`}
                        className="flex items-center hover:text-[#C8102E]"
                        onClick={() => setDesktopDropdownOpen(isOpen ? null : link.href)}
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="absolute left-0 top-full z-50 pt-2">
                        <div className="w-56 rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-200">
                          {link.submenu.map(sublink => {
                            const isSubmenuActive = pathname === sublink.href;
                            return (
                              <Link
                                key={sublink.href}
                                href={sublink.href}
                                className={`block px-4 py-2 text-sm transition-colors ${
                                  isSubmenuActive
                                    ? 'text-[#C8102E] font-semibold bg-gray-50'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => setDesktopDropdownOpen(null)}
                              >
                                {sublink.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Regular link
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-[#C8102E] border-b-2 border-[#C8102E]'
                      : 'text-gray-700 hover:text-[#C8102E]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {process.env.NEXT_PUBLIC_ENABLE_SV === 'true' && <LanguageSelector className="ml-4" />}
          </div>
        </div>

        {/* Mobile/tablet menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden">
            <div className="max-h-[calc(100dvh-5rem)] overflow-y-auto space-y-2 pb-6 pt-6">
              {translatedLinks.map(link => {
                const isActive = isLinkActive(link);

                if ('submenu' in link && link.submenu) {
                  // Mobile submenu
                  return (
                    <div key={link.href}>
                      <button
                        onClick={() => toggleMobileSubmenu(link.label)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-semibold transition-colors hover:bg-gray-50 ${
                          isActive ? 'bg-gray-50 text-[#C8102E]' : 'text-gray-900'
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            mobileSubmenuOpen === link.label ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {mobileSubmenuOpen === link.label && (
                        <div className="ml-4 mt-2 space-y-2">
                          {link.submenu.map(sublink => {
                            // Use exact match for submenu items to avoid /about matching /about/team
                            const isSubmenuActive = pathname === sublink.href;
                            return (
                              <Link
                                key={sublink.href}
                                href={sublink.href}
                                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                  isSubmenuActive
                                    ? 'bg-gray-50 text-[#C8102E] font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {sublink.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular mobile link
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block rounded-lg px-3 py-2 text-base font-semibold transition-colors hover:bg-gray-50 ${
                      isActive ? 'bg-gray-50 text-[#C8102E]' : 'text-gray-900'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Language Selector in Mobile Menu */}
              {process.env.NEXT_PUBLIC_ENABLE_SV === 'true' && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <LanguageSelector className="justify-center" />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
