import type { CmsArticle, CmsArticleBlock, NewsArticle, ArticleContentBlock } from './types';

function mapBlock(block: CmsArticleBlock): ArticleContentBlock | null {
  switch (block.__component) {
    case 'article.paragraph':
      return { type: 'paragraph', content: block.content };
    case 'article.heading':
      return { type: 'heading', level: block.level === 'h2' ? 2 : 3, content: block.content };
    case 'article.image':
      return {
        type: 'image',
        src: block.src,
        alt: block.alt,
        caption: block.caption,
        credit: block.credit,
      };
    case 'article.quote':
      return {
        type: 'quote',
        content: block.content,
        attribution: block.attribution,
        role: block.role,
      };
    case 'article.list':
      return { type: 'list', style: block.style, items: block.items };
    case 'article.callout':
      return { type: 'callout', variant: block.variant, content: block.content };
    default:
      return null;
  }
}

export function articleMapper(cms: CmsArticle): NewsArticle {
  return {
    id: cms.id,
    title: cms.title,
    slug: cms.slug,
    excerpt: cms.excerpt,
    publishDate: cms.publishDate,
    author: cms.author,
    category: cms.category,
    imageUrl: cms.heroImage?.url,
    readTimeMinutes: cms.readTimeMinutes,
    order: cms.order,
    tags: cms.tags ?? undefined,
    fullContent: cms.fullContent
      ? cms.fullContent.map(mapBlock).filter((b): b is ArticleContentBlock => b !== null)
      : undefined,
    relatedArticles: cms.relatedArticles?.map(articleMapper),
  };
}

export function articlesMapper(items: CmsArticle[]): NewsArticle[] {
  return items.map(articleMapper);
}
