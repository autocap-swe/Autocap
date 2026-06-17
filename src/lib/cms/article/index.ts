import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsArticle, NewsArticle } from './types';
import { articlesMapper } from './mapper';

// TEMP: Swedish news article translations are placeholder garbage ("swe_…") in
// production. Until real Swedish translations are entered, always serve the
// English article content (even on /sv routes). Flip to false to restore
// per-locale fetching once translations are in.
const FORCE_EN_NEWS_CONTENT = true;

export async function getArticlesContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<NewsArticle[]> {
  const effectiveLocale = FORCE_EN_NEWS_CONTENT ? 'en' : locale;
  const options = {
    revalidate,
    tags: ['news-articles'],
    params: {
      'pagination[pageSize]': '100',
      'sort[0]': 'publishDate:desc',
      'populate[heroImage]': 'true',
    },
    mapper: articlesMapper,
  };

  const results = await getContent<CmsArticle[], NewsArticle[]>('news-articles', {
    ...options,
    locale: effectiveLocale,
  });

  if (results.length === 0 && effectiveLocale && effectiveLocale !== 'en') {
    return getContent<CmsArticle[], NewsArticle[]>('news-articles', {
      ...options,
      locale: 'en',
    });
  }

  return results;
}

export async function getArticleBySlugContent(
  slug: string,
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<NewsArticle | null> {
  const effectiveLocale = FORCE_EN_NEWS_CONTENT ? 'en' : locale;
  const localeTag =
    effectiveLocale && effectiveLocale !== 'en'
      ? `news-article:${slug}:${effectiveLocale}`
      : `news-article:${slug}:en`;
  const params = {
    'filters[slug][$eq]': slug,
    'populate[fullContent][on][article.paragraph][populate]': '*',
    'populate[fullContent][on][article.heading][populate]': '*',
    'populate[fullContent][on][article.image][populate]': '*',
    'populate[fullContent][on][article.quote][populate]': '*',
    'populate[fullContent][on][article.list][populate]': '*',
    'populate[fullContent][on][article.callout][populate]': '*',
    'populate[heroImage]': 'true',
    'populate[relatedArticles][populate][heroImage]': 'true',
    'populate[localizations][fields][0]': 'slug',
    'populate[localizations][fields][1]': 'locale',
    'populate[seo][populate][ogImage]': 'true',
    'pagination[pageSize]': '1',
  };

  const results = await getContent<CmsArticle[], NewsArticle[]>('news-articles', {
    revalidate,
    tags: ['news-articles', `news-article:${slug}`, localeTag],
    params,
    mapper: articlesMapper,
    locale: effectiveLocale,
  });

  if (!results[0] && effectiveLocale && effectiveLocale !== 'en') {
    return getContent<CmsArticle[], NewsArticle[]>('news-articles', {
      revalidate,
      tags: ['news-articles', `news-article:${slug}`, `news-article:${slug}:en`],
      params,
      mapper: articlesMapper,
      locale: 'en',
    }).then(r => r[0] ?? null);
  }

  return results[0] ?? null;
}
