import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsArticle, NewsArticle } from './types';
import { articlesMapper } from './mapper';

export async function getArticlesContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<NewsArticle[]> {
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
    locale,
  });

  if (results.length === 0 && locale && locale !== 'en') {
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
  const options = {
    revalidate,
    tags: ['news-articles', `news-article:${slug}`],
    params: {
      'filters[slug][$eq]': slug,
      'populate[fullContent][on][article.paragraph][populate]': '*',
      'populate[fullContent][on][article.heading][populate]': '*',
      'populate[fullContent][on][article.image][populate]': '*',
      'populate[fullContent][on][article.quote][populate]': '*',
      'populate[fullContent][on][article.list][populate]': '*',
      'populate[fullContent][on][article.callout][populate]': '*',
      'populate[heroImage]': 'true',
      'populate[relatedArticles][populate][heroImage]': 'true',
      'populate[seo]': 'true',
      'pagination[pageSize]': '1',
    },
    mapper: articlesMapper,
  };

  const results = await getContent<CmsArticle[], NewsArticle[]>('news-articles', {
    ...options,
    locale,
  });

  if (!results[0] && locale && locale !== 'en') {
    const enResults = await getContent<CmsArticle[], NewsArticle[]>('news-articles', {
      ...options,
      locale: 'en',
    });
    return enResults[0] ?? null;
  }

  return results[0] ?? null;
}
