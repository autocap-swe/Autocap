/**
 * CMS Client Tests — `getContent` (v2: no fallback, throws on every failure)
 *
 * Covers Autocap/docs/specs/cms-integration.md ACs 001, 005, 006.
 */

import { getContent, CmsUnavailableError } from './client';

const originalFetch = global.fetch;

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation();
});

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('getContent — basic fetch (AC-001, AC-005)', () => {
  it('returns the data payload on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { heroTitle: 'Hello' }, meta: {} }),
    });

    const result = await getContent<{ heroTitle: string }>('contact-page');
    expect(result).toEqual({ heroTitle: 'Hello' });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/contact-page'),
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
    );
  });

  it('uses default 60s ISR revalidation', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { x: 1 }, meta: {} }),
    });

    await getContent('test-path');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ next: { revalidate: 60 } })
    );
  });

  it('allows custom revalidation interval', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { x: 1 }, meta: {} }),
    });

    await getContent('test-path', { revalidate: 300 });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ next: { revalidate: 300 } })
    );
  });

  it('supports disabling revalidation', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { x: 1 }, meta: {} }),
    });

    await getContent('test-path', { revalidate: false });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ next: { revalidate: false } })
    );
  });

  it('appends query params to the URL', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { x: 1 }, meta: {} }),
    });

    await getContent('contact-page', { params: { populate: 'deep', sort: 'order' } });
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('populate=deep');
    expect(calledUrl).toContain('sort=order');
  });
});

describe('getContent — error paths (AC-006)', () => {
  it('throws CmsUnavailableError on network failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('ECONNREFUSED'));

    await expect(getContent('contact-page')).rejects.toThrow(CmsUnavailableError);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('[CMS] contact-page: ECONNREFUSED')
    );
  });

  it('throws CmsUnavailableError on non-2xx response', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

    await expect(getContent('contact-page')).rejects.toThrow(CmsUnavailableError);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('[CMS] contact-page: HTTP 500')
    );
  });

  it('throws when Strapi returns an error envelope', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: null,
        error: { status: 403, name: 'ForbiddenError', message: 'Forbidden' },
      }),
    });

    await expect(getContent('contact-page')).rejects.toThrow(CmsUnavailableError);
  });

  it('throws when data is null (entry not published)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: null, meta: {} }),
    });

    await expect(getContent('contact-page')).rejects.toThrow(CmsUnavailableError);
  });

  it('throws when JSON parsing fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('Unexpected token < in JSON');
      },
    });

    await expect(getContent('contact-page')).rejects.toThrow(CmsUnavailableError);
  });

  it('attaches the underlying status to the error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 });

    try {
      await getContent('contact-page');
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(CmsUnavailableError);
      expect((err as CmsUnavailableError).status).toBe(503);
      expect((err as CmsUnavailableError).slug).toBe('contact-page');
    }
  });
});

describe('getContent — mapper (AC-001)', () => {
  type Cms = { title: string };
  type Final = { heading: string; bodyKnown: boolean };
  const mapper = (cms: Cms): Final => ({ heading: cms.title, bodyKnown: true });

  it('runs the mapper over CMS data', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { title: 'from-cms' }, meta: {} }),
    });

    const result = await getContent<Cms, Final>('x', { mapper });
    expect(result).toEqual({ heading: 'from-cms', bodyKnown: true });
  });

  it('still throws when CMS fails (mapper does not rescue)', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

    await expect(getContent<Cms, Final>('x', { mapper })).rejects.toThrow(CmsUnavailableError);
  });
});
