import type { MetadataRoute } from 'next';
import { getArticlesContent } from '@/lib/cms/article';
import { getWorkshopsContent } from '@/lib/cms/workshop';
import { localeUrl } from '@/lib/cms/seo';

const LOCALES = ['en', 'sv'] as const;
type Locale = (typeof LOCALES)[number];

// Every page under src/app/[locale]/ except dynamic [slug] routes.
// English URLs have no prefix (localePrefix: 'as-needed'); Swedish URLs start with /sv.
export const STATIC_ROUTES = [
  '/',
  '/about',
  '/about/story',
  '/about/team',
  '/portfolio',
  '/entrepreneurs',
  '/entrepreneurs/process',
  '/entrepreneurs/why',
  '/entrepreneurs/contact',
  '/investors',
  '/investors/why',
  '/investors/metrics',
  '/investors/contact',
  '/news',
  '/news/media-kit',
  '/sustainability',
  '/contact',
  '/privacy-policy',
  '/cookies',
] as const;

function priorityFor(route: string): number {
  if (route === '/') return 1;
  if (route === '/privacy-policy' || route === '/cookies') return 0.3;
  return 0.8;
}

/** One entry per language, each listing both language versions as alternates. */
function pairEntries(
  paths: Partial<Record<Locale, string>>,
  extra: Omit<MetadataRoute.Sitemap[number], 'url' | 'alternates'>
): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    const path = paths[locale];
    if (path) languages[locale] = localeUrl(locale, path);
  }
  return LOCALES.filter(locale => paths[locale]).map(locale => ({
    url: localeUrl(locale, paths[locale] as string),
    alternates: { languages },
    ...extra,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    entries.push(
      ...pairEntries(
        { en: route, sv: route },
        {
          changeFrequency: route === '/' || route === '/news' ? 'weekly' : 'monthly',
          priority: priorityFor(route),
        }
      )
    );
  }

  // News: English articles carry the slug of their Swedish translation (and vice versa).
  const [articlesEn, articlesSv] = await Promise.all(
    LOCALES.map(locale => getArticlesContent(undefined, locale).catch(() => []))
  );
  const seenSvSlugs = new Set<string>();
  for (const article of articlesEn) {
    if (!article.slug) continue;
    const svSlug = article.localizedSlugs?.sv;
    if (svSlug) seenSvSlugs.add(svSlug);
    entries.push(
      ...pairEntries(
        { en: `/news/${article.slug}`, sv: svSlug ? `/news/${svSlug}` : undefined },
        { lastModified: article.publishDate, changeFrequency: 'monthly', priority: 0.6 }
      )
    );
  }
  for (const article of articlesSv) {
    if (!article.slug || seenSvSlugs.has(article.slug)) continue;
    entries.push(
      ...pairEntries(
        { sv: `/news/${article.slug}` },
        { lastModified: article.publishDate, changeFrequency: 'monthly', priority: 0.6 }
      )
    );
  }

  // Workshops: slugs can differ per language.
  const workshops = await getWorkshopsContent(undefined, 'en').catch(() => []);
  for (const workshop of workshops) {
    if (!workshop.slug) continue;
    const svSlug = workshop.localizedSlugs?.sv;
    entries.push(
      ...pairEntries(
        { en: `/portfolio/${workshop.slug}`, sv: `/portfolio/${svSlug ?? workshop.slug}` },
        { changeFrequency: 'monthly', priority: 0.6 }
      )
    );
  }

  return entries;
}
