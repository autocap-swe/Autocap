import type { Metadata } from 'next';
import type { StrapiMedia } from './media';
import { cmsMediaUrl } from './media';

export interface CmsSeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: StrapiMedia | null;
}

const SITE_NAME = 'AutoCap Group';
export const SITE_URL = 'https://autocapgroup.se';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/autocap-og.jpg`;

/** Path per language; leave a language out when the page has no translation. */
export type LocalizedPaths = { en?: string; sv?: string };

/** Public path for a locale. English has no prefix (localePrefix: 'as-needed'). */
export function localePath(locale: string | undefined, path: string): string {
  const clean = path === '/' ? '' : path;
  if (locale === 'sv') return `/sv${clean}`;
  return clean === '' ? '/' : clean;
}

/** Absolute URL for a path in a locale. */
export function localeUrl(locale: string | undefined, path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

/** Canonical plus hreflang alternates (en, sv, x-default → en). */
export function buildAlternates(
  locale: string | undefined,
  paths: LocalizedPaths
): NonNullable<Metadata['alternates']> {
  const current = (locale === 'sv' ? paths.sv : paths.en) ?? paths.en ?? paths.sv ?? '/';
  const languages: Record<string, string> = {};
  if (paths.en !== undefined) languages.en = localeUrl('en', paths.en);
  if (paths.sv !== undefined) languages.sv = localeUrl('sv', paths.sv);
  if (paths.en !== undefined) languages['x-default'] = localeUrl('en', paths.en);
  return {
    canonical: localeUrl(locale, current),
    languages,
  };
}

/**
 * Path for a slug page in one language: the current page's slug for its own language,
 * the translated slug when one exists, otherwise undefined (no hreflang to a missing page).
 */
export function localizedSlugPath(
  base: string,
  localizedSlugs: Record<string, string> | undefined,
  target: 'en' | 'sv',
  currentLocale: string,
  currentSlug: string
): string | undefined {
  if (target === currentLocale) return `${base}/${currentSlug}`;
  const slug = localizedSlugs?.[target];
  return slug ? `${base}/${slug}` : undefined;
}

export interface BuildMetadataOptions {
  /** Same path in both languages, e.g. "/about/team". */
  path?: string;
  /** Different paths per language, e.g. localized slugs. Overrides `path`. */
  paths?: LocalizedPaths;
  /** Image used for og:image when the CMS has no SEO image, e.g. the page hero. */
  fallbackOgImage?: StrapiMedia | string | null;
}

function resolveOgImage(seo?: CmsSeo | null, fallback?: StrapiMedia | string | null): string {
  const fromSeo = cmsMediaUrl(seo?.ogImage);
  if (fromSeo) return fromSeo;
  if (typeof fallback === 'string' && fallback) return fallback;
  const fromFallback = fallback && typeof fallback !== 'string' ? cmsMediaUrl(fallback) : undefined;
  return fromFallback ?? DEFAULT_OG_IMAGE;
}

export function buildMetadata(
  defaults: Metadata,
  seo?: CmsSeo | null,
  locale?: string,
  options: BuildMetadataOptions = {}
): Metadata {
  const title = seo?.metaTitle ?? defaults.title;
  const description = seo?.metaDescription ?? (defaults.description as string | undefined);
  const ogImageUrl = resolveOgImage(seo, options.fallbackOgImage);
  const ogLocale = locale === 'sv' ? 'sv_SE' : 'en_US';
  const paths =
    options.paths ?? (options.path !== undefined ? { en: options.path, sv: options.path } : null);

  return {
    ...defaults,
    title,
    description,
    ...(paths ? { alternates: buildAlternates(locale, paths) } : {}),
    openGraph: {
      siteName: SITE_NAME,
      locale: ogLocale,
      alternateLocale: locale === 'sv' ? ['en_US'] : ['sv_SE'],
      type: 'website',
      title: (title as string) ?? undefined,
      description: description ?? undefined,
      ...(paths
        ? { url: localeUrl(locale, (locale === 'sv' ? paths.sv : paths.en) ?? paths.en ?? '/') }
        : {}),
      images: [{ url: ogImageUrl, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: (title as string) ?? undefined,
      description: description ?? undefined,
      images: [ogImageUrl],
    },
  };
}
