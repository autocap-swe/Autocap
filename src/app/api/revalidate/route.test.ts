/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
}));

const SECRET = 'test-secret-abc123';

async function importRoute() {
  return await import('./route');
}

function makeRequest(body: unknown, secret: string | null = SECRET): NextRequest {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (secret !== null) headers['x-revalidate-secret'] = secret;

  return new NextRequest('http://localhost/api/revalidate', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.REVALIDATE_SECRET = SECRET;
  });

  it('returns 401 when secret header is missing', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeRequest({ contentType: 'news-article' }, null));
    expect(res.status).toBe(401);
  });

  it('returns 401 when secret is wrong', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeRequest({ contentType: 'news-article' }, 'wrong'));
    expect(res.status).toBe(401);
  });

  it('returns 400 on invalid JSON', async () => {
    const { POST } = await importRoute();
    const req = new NextRequest('http://localhost/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-revalidate-secret': SECRET },
      body: 'not-json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns revalidated: false for unknown contentType', async () => {
    const { POST } = await importRoute();
    const res = await POST(makeRequest({ contentType: 'unknown-type' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(false);
    expect(json.reason).toBe('unknown_content_type');
  });

  it('revalidates news-articles tag and article tag when contentType is news-article with slug', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await importRoute();

    const res = await POST(makeRequest({ contentType: 'news-article', slug: 'my-article' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toContain('news-articles');
    expect(json.tags).toContain('news-article:my-article');
    expect(revalidateTag).toHaveBeenCalledWith('news-articles');
    expect(revalidateTag).toHaveBeenCalledWith('news-article:my-article');
  });

  it('revalidates only news-articles tag when no slug provided', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await importRoute();

    const res = await POST(makeRequest({ contentType: 'news-article' }));
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toEqual(['news-articles']);
    expect(revalidateTag).toHaveBeenCalledWith('news-articles');
    expect(revalidateTag).not.toHaveBeenCalledWith(expect.stringContaining('news-article:'));
  });

  it('revalidates workshops tag and workshop tag when contentType is workshop with slug', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await importRoute();

    const res = await POST(makeRequest({ contentType: 'workshop', slug: 'dackpoint-molndal' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toContain('workshops');
    expect(json.tags).toContain('workshop:dackpoint-molndal');
    expect(revalidateTag).toHaveBeenCalledWith('workshops');
    expect(revalidateTag).toHaveBeenCalledWith('workshop:dackpoint-molndal');
  });

  it('revalidates contact-page tag when contentType is contact-page', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await importRoute();

    const res = await POST(makeRequest({ contentType: 'contact-page' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toEqual(['contact-page']);
    expect(revalidateTag).toHaveBeenCalledWith('contact-page');
  });

  it('GET returns 405', async () => {
    const { GET } = await importRoute();
    const res = await GET();
    expect(res.status).toBe(405);
  });

  it('revalidates homepage tag when contentType is homepage', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await importRoute();

    const res = await POST(makeRequest({ contentType: 'homepage' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toEqual(['homepage']);
    expect(revalidateTag).toHaveBeenCalledWith('homepage');
  });

  it('revalidates about-page tag when contentType is about-page', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await importRoute();

    const res = await POST(makeRequest({ contentType: 'about-page' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toEqual(['about-page']);
    expect(revalidateTag).toHaveBeenCalledWith('about-page');
  });

  it('revalidates story-page tag when contentType is story-page', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await importRoute();

    const res = await POST(makeRequest({ contentType: 'story-page' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toEqual(['story-page']);
    expect(revalidateTag).toHaveBeenCalledWith('story-page');
  });

  it('revalidates entrepreneurs-page tag when contentType is entrepreneurs-page', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await importRoute();

    const res = await POST(makeRequest({ contentType: 'entrepreneurs-page' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toEqual(['entrepreneurs-page']);
    expect(revalidateTag).toHaveBeenCalledWith('entrepreneurs-page');
  });

  it('revalidates investors-page tag when contentType is investors-page', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await importRoute();

    const res = await POST(makeRequest({ contentType: 'investors-page' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toEqual(['investors-page']);
    expect(revalidateTag).toHaveBeenCalledWith('investors-page');
  });

  it('revalidates sustainability-page tag when contentType is sustainability-page', async () => {
    const { revalidateTag } = await import('next/cache');
    const { POST } = await importRoute();

    const res = await POST(makeRequest({ contentType: 'sustainability-page' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toBe(true);
    expect(json.tags).toEqual(['sustainability-page']);
    expect(revalidateTag).toHaveBeenCalledWith('sustainability-page');
  });
});
