// Strapi Dynamic Zone block shapes
interface CmsParagraphBlock {
  __component: 'article.paragraph';
  id: number;
  content: string;
}

interface CmsHeadingBlock {
  __component: 'article.heading';
  id: number;
  level: 'h2' | 'h3';
  content: string;
}

interface CmsImageBlock {
  __component: 'article.image';
  id: number;
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}

interface CmsQuoteBlock {
  __component: 'article.quote';
  id: number;
  content: string;
  attribution?: string;
  role?: string;
}

interface CmsListBlock {
  __component: 'article.list';
  id: number;
  style: 'bullet' | 'numbered';
  items: string[];
}

interface CmsCalloutBlock {
  __component: 'article.callout';
  id: number;
  variant: 'info' | 'highlight';
  content: string;
}

export type CmsArticleBlock =
  | CmsParagraphBlock
  | CmsHeadingBlock
  | CmsImageBlock
  | CmsQuoteBlock
  | CmsListBlock
  | CmsCalloutBlock;

// Strapi shape — what GET /api/articles returns per item
export interface CmsArticle {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  author: string;
  category: 'Company News' | 'Press Release' | 'Industry Insights' | 'Media Coverage';
  heroImage: { url: string } | null;
  readTimeMinutes: number;
  order: number;
  tags: string[] | null;
  fullContent?: CmsArticleBlock[];
  relatedArticles?: CmsArticle[];
}

// Frontend content block types
export interface ParagraphBlock {
  type: 'paragraph';
  content: string;
}

export interface HeadingBlock {
  type: 'heading';
  level: 2 | 3;
  content: string;
  id?: string;
}

export interface ImageBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}

export interface QuoteBlock {
  type: 'quote';
  content: string;
  attribution?: string;
  role?: string;
}

export interface ListBlock {
  type: 'list';
  style: 'bullet' | 'numbered';
  items: string[];
}

export interface CalloutBlock {
  type: 'callout';
  variant: 'info' | 'highlight';
  content: string;
}

export type ArticleContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | QuoteBlock
  | ListBlock
  | CalloutBlock;

// Page shape — what the frontend renders
export interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  publishDate: string;
  author: string;
  category: 'Company News' | 'Press Release' | 'Industry Insights' | 'Media Coverage';
  imageUrl?: string;
  slug: string;
  readTimeMinutes: number;
  order: number;
  fullContent?: ArticleContentBlock[];
  tags?: string[];
  relatedArticles?: NewsArticle[];
}
