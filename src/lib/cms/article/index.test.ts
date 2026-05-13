import { getArticlesContent, getArticleBySlugContent } from './index';
import type { CmsArticle } from './types';

jest.mock('../client');
import { getContent } from '../client';
const mockedGetContent = getContent as jest.MockedFunction<typeof getContent>;

const mockCmsArticle: CmsArticle = {
  id: 1,
  documentId: 'abc123',
  title: 'AutoCap Group Acquires Svenska Däckgruppen',
  slug: 'autocap-acquires-svenska-dackgruppen',
  excerpt: 'Exciting acquisition news.',
  publishDate: '2026-01-15',
  author: 'AutoCap Group',
  category: 'Press Release',
  heroImage: { url: 'https://cdn.example.com/hero.jpg' },
  readTimeMinutes: 3,
  order: 1,
  tags: ['acquisition'],
};

beforeEach(() => mockedGetContent.mockReset());

describe('getArticlesContent', () => {
  it('calls getContent with articles slug and pageSize 100', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([mockCmsArticle] as CmsArticle[])
    );

    await getArticlesContent();

    const [slug, options] = mockedGetContent.mock.calls[0];
    expect(slug).toBe('news-articles');
    expect(options?.params?.['pagination[pageSize]']).toBe('100');
  });

  it('requests articles sorted by publishDate descending', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([mockCmsArticle] as CmsArticle[])
    );

    await getArticlesContent();

    const [, options] = mockedGetContent.mock.calls[0];
    expect(options?.params?.['sort[0]']).toBe('publishDate:desc');
  });

  it('maps heroImage.url to imageUrl', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([mockCmsArticle] as CmsArticle[])
    );

    const result = await getArticlesContent();
    expect(result[0].imageUrl).toBe('https://cdn.example.com/hero.jpg');
  });

  it('maps article fields correctly', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([mockCmsArticle] as CmsArticle[])
    );

    const result = await getArticlesContent();
    expect(result[0].title).toBe(mockCmsArticle.title);
    expect(result[0].slug).toBe(mockCmsArticle.slug);
    expect(result[0].category).toBe('Press Release');
  });
});

describe('getArticleBySlugContent', () => {
  it('passes slug filter param', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([mockCmsArticle] as CmsArticle[])
    );

    await getArticleBySlugContent('autocap-acquires-svenska-dackgruppen');

    const [, options] = mockedGetContent.mock.calls[0];
    expect(options?.params?.['filters[slug][$eq]']).toBe('autocap-acquires-svenska-dackgruppen');
  });

  it('populates fullContent', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([mockCmsArticle] as CmsArticle[])
    );

    await getArticleBySlugContent('autocap-acquires-svenska-dackgruppen');

    const [, options] = mockedGetContent.mock.calls[0];
    expect(options?.params?.['populate[fullContent][on][article.paragraph][populate]']).toBe('*');
    expect(options?.params?.['populate[fullContent][on][article.heading][populate]']).toBe('*');
  });

  it('returns the first matching article', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([mockCmsArticle] as CmsArticle[])
    );

    const result = await getArticleBySlugContent('autocap-acquires-svenska-dackgruppen');
    expect(result?.slug).toBe('autocap-acquires-svenska-dackgruppen');
  });

  it('returns null when no article found', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([] as CmsArticle[])
    );

    const result = await getArticleBySlugContent('nonexistent');
    expect(result).toBeNull();
  });
});

describe('articleMapper (via getArticlesContent)', () => {
  it('maps heading level h2 to 2', async () => {
    const cmsWithContent: CmsArticle = {
      ...mockCmsArticle,
      fullContent: [{ __component: 'article.heading', id: 1, level: 'h2', content: 'Title' }],
    };
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([cmsWithContent] as CmsArticle[])
    );

    const result = await getArticlesContent();
    const block = result[0].fullContent?.[0];
    expect(block?.type).toBe('heading');
    if (block?.type === 'heading') expect(block.level).toBe(2);
  });

  it('maps heading level h3 to 3', async () => {
    const cmsWithContent: CmsArticle = {
      ...mockCmsArticle,
      fullContent: [{ __component: 'article.heading', id: 1, level: 'h3', content: 'Sub' }],
    };
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([cmsWithContent] as CmsArticle[])
    );

    const result = await getArticlesContent();
    const block = result[0].fullContent?.[0];
    if (block?.type === 'heading') expect(block.level).toBe(3);
  });

  it('maps null heroImage to undefined imageUrl', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([{ ...mockCmsArticle, heroImage: null }] as CmsArticle[])
    );

    const result = await getArticlesContent();
    expect(result[0].imageUrl).toBeUndefined();
  });
});
