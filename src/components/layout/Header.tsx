'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LanguageSelector } from './LanguageSelector';
import { Wordmark } from './Wordmark';

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

/** Pages whose hero is a full-bleed video or photo: the header sits transparent on top. */
export const OVERLAY_PATHS: readonly string[] = ['/'];

function useNavItems(): NavItem[] {
  const t = useTranslations('nav');
  return [
    { href: '/portfolio', label: t('ourCompanies') },
    {
      href: '/entrepreneurs',
      label: t('entrepreneurs.label'),
      children: [
        { href: '/entrepreneurs', label: t('entrepreneurs.overview') },
        { href: '/entrepreneurs/process', label: t('entrepreneurs.howItWorks') },
        { href: '/entrepreneurs/why', label: t('entrepreneurs.whyAutoCap') },
        { href: '/entrepreneurs/contact', label: t('entrepreneurs.contact') },
      ],
    },
    { href: '/investors', label: t('investors') },
    {
      href: '/about',
      label: t('about.label'),
      children: [
        { href: '/about', label: t('about.companyOverview') },
        { href: '/about/story', label: t('about.ourStory') },
        { href: '/about/team', label: t('about.leadershipBoard') },
        { href: '/sustainability', label: t('sustainability') },
      ],
    },
    {
      href: '/news',
      label: t('newsShort'),
      children: [
        { href: '/news', label: t('news.overview') },
        { href: '/news/media-kit', label: t('news.mediaKit') },
      ],
    },
    { href: '/contact', label: t('contact') },
  ];
}

function isActive(pathname: string, item: NavItem): boolean {
  const hrefs = [item.href, ...(item.children?.map(child => child.href) ?? [])];
  return hrefs.some(href => pathname === href || pathname.startsWith(`${href}/`));
}

export function Header({ overlay }: { overlay?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const items = useNavItems();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const isOverlay = overlay ?? OVERLAY_PATHS.includes(pathname);
  const svEnabled = process.env.NEXT_PUBLIC_ENABLE_SV === 'true';

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const shell = isOverlay
    ? 'absolute inset-x-0 top-0 z-50 text-white'
    : 'sticky top-0 z-50 border-b border-rule bg-white text-ink';

  return (
    <header className={shell}>
      <nav aria-label="Global" className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-6 px-5 lg:px-16">
        <Link href="/" className="no-underline">
          <Wordmark tone={isOverlay ? 'white' : 'dark'} className="h-8" />
        </Link>

        <ul className="m-0 hidden list-none items-center gap-8 p-0 xl:flex">
          {items.map(item => {
            const active = isActive(pathname, item);
            const activeClass = active ? 'text-red' : 'hover:text-red';
            if (!item.children) {
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? 'page' : undefined} className={`text-sm font-medium no-underline ${activeClass}`}>
                    {item.label}
                  </Link>
                </li>
              );
            }
            const open = openDropdown === item.href;
            return (
              <li
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenDropdown(open ? null : item.href)}
                  className={`min-h-11 text-sm font-medium ${activeClass}`}
                >
                  {item.label}
                </button>
                {open && (
                  <ul className="absolute left-[-16px] top-full m-0 w-60 list-none border border-rule bg-white p-0 py-2 text-ink">
                    {item.children.map(child => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          aria-current={pathname === child.href ? 'page' : undefined}
                          className={`block px-4 py-2.5 text-sm no-underline hover:bg-birch ${pathname === child.href ? 'font-semibold text-red' : ''}`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          {svEnabled && (
            <li>
              <LanguageSelector variant="toggle" />
            </li>
          )}
        </ul>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center xl:hidden"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="sr-only">{mobileOpen ? t('closeMenu') : t('openMenu')}</span>
          {mobileOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-rule bg-white text-ink xl:hidden">
          <ul className="m-0 list-none px-5 py-4">
            {items.map(item => (
              <li key={item.href} className="border-b border-rule py-3">
                <Link href={item.href} className={`text-lg font-medium no-underline ${isActive(pathname, item) ? 'text-red' : ''}`}>
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="m-0 mt-2 list-none p-0">
                    {item.children
                      .filter(child => child.href !== item.href)
                      .map(child => (
                        <li key={child.href}>
                          <Link href={child.href} className="block py-1.5 text-[15px] text-text-2 no-underline">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            ))}
            {svEnabled && (
              <li className="pt-3">
                <LanguageSelector variant="toggle" />
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
