import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsArticle, NewsArticle } from './types';
import { articlesMapper } from './mapper';

export async function getArticlesContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<NewsArticle[]> {
  return getContent<CmsArticle[], NewsArticle[]>('news-articles', {
    revalidate,
    locale,
    tags: ['news-articles'],
    params: {
      'pagination[pageSize]': '100',
      'sort[0]': 'publishDate:desc',
    },
    mapper: articlesMapper,
  });
}

export async function getArticleBySlugContent(
  slug: string,
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<NewsArticle | null> {
  const results = await getContent<CmsArticle[], NewsArticle[]>('news-articles', {
    revalidate,
    locale,
    tags: ['news-articles', `news-article:${slug}`],
    params: {
      'filters[slug][$eq]': slug,
      'populate[fullContent][on][article.paragraph][populate]': '*',
      'populate[fullContent][on][article.heading][populate]': '*',
      'populate[fullContent][on][article.image][populate]': '*',
      'populate[fullContent][on][article.quote][populate]': '*',
      'populate[fullContent][on][article.list][populate]': '*',
      'populate[fullContent][on][article.callout][populate]': '*',
      'pagination[pageSize]': '1',
    },
    mapper: articlesMapper,
  });
  return results[0] ?? null;
}
