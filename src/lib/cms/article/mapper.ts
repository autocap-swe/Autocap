import type { CmsArticle, CmsArticleBlock, NewsArticle, ArticleContentBlock } from './types';

const CMS_URL = (process.env.CMS_API_URL ?? 'http://localhost:1337').replace(/\/$/, '');

function resolveUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${CMS_URL}${url}`;
}

function mapBlock(block: CmsArticleBlock): ArticleContentBlock | null {
  switch (block.__component) {
    case 'article.paragraph':
      return { type: 'paragraph', content: block.content };
    case 'article.heading':
      return { type: 'heading', level: block.level === 'h2' ? 2 : 3, content: block.content };
    case 'article.image':
      return {
        type: 'image',
        src: resolveUrl(block.image?.url),
        alt: block.alt,
        caption: block.caption,
      };
    case 'article.quote':
      return {
        type: 'quote',
        content: block.content,
        attribution: block.attribution,
        role: block.role,
      };
    case 'article.list':
      return {
        type: 'list',
        style: block.style,
        items: Array.isArray(block.items)
          ? block.items.map((i: string) => i.trim()).filter(Boolean)
          : block.items
              .split('\n')
              .map((i: string) => i.trim())
              .filter(Boolean),
      };
    case 'article.callout':
      return { type: 'callout', variant: block.variant, content: block.content };
    default:
      return null;
  }
}

export function articleMapper(cms: CmsArticle): NewsArticle {
  const localizedSlugs: Record<string, string> = {};
  if (cms.locale && cms.slug) localizedSlugs[cms.locale] = cms.slug;
  for (const l of cms.localizations ?? []) {
    if (l.locale && l.slug) localizedSlugs[l.locale] = l.slug;
  }

  return {
    id: cms.id,
    title: cms.title,
    slug: cms.slug,
    excerpt: cms.excerpt,
    publishDate: cms.publishDate,
    author: cms.author,
    category: cms.category,
    imageUrl: resolveUrl(cms.heroImage?.url),
    readTimeMinutes: cms.readTimeMinutes,
    fullContent: cms.fullContent
      ? cms.fullContent.map(mapBlock).filter((b): b is ArticleContentBlock => b !== null)
      : undefined,
    relatedArticles: cms.relatedArticles?.slice(0, 3).map(articleMapper),
    localizedSlugs: Object.keys(localizedSlugs).length > 0 ? localizedSlugs : undefined,
    seo: cms.seo,
  };
}

export function articlesMapper(items: CmsArticle[]): NewsArticle[] {
  return items.map(articleMapper);
}
