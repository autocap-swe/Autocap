import type { MetadataRoute } from 'next';
import { getArticlesContent } from '@/lib/cms/article';
import { getWorkshopsContent } from '@/lib/cms/workshop';

const BASE_URL = 'https://app.autocapgroup.se';
const LOCALES = ['en', 'sv'] as const;

const STATIC_ROUTES = [
  '',
  '/about',
  '/about/story',
  '/about/team',
  '/entrepreneurs',
  '/entrepreneurs/contact',
  '/investors',
  '/investors/contact',
  '/investors/case',
  '/sustainability',
  '/contact',
  '/portfolio',
  '/news',
  '/privacy-policy',
  '/cookies',
  '/media-kit',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    entries.push({
      url: `${BASE_URL}/en${route}`,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${route}`,
          sv: `${BASE_URL}/sv${route}`,
        },
      },
      changeFrequency: route === '' ? 'weekly' : 'monthly',
      priority: route === '' ? 1 : 0.8,
    });
  }

  try {
    for (const locale of LOCALES) {
      const articles = await getArticlesContent(undefined, locale).catch(() => []);
      for (const article of articles) {
        if (!article.slug) continue;
        entries.push({
          url: `${BASE_URL}/${locale}/news/${article.slug}`,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // CMS unavailable during build — skip dynamic news entries
  }

  try {
    const workshops = await getWorkshopsContent(undefined, 'en').catch(() => []);
    for (const workshop of workshops) {
      if (!workshop.slug) continue;
      for (const locale of LOCALES) {
        entries.push({
          url: `${BASE_URL}/${locale}/portfolio/${workshop.slug}`,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch {
    // CMS unavailable during build — skip dynamic workshop entries
  }

  return entries;
}
