import robots from './robots';

describe('robots.txt', () => {
  const original = process.env.VERCEL_ENV;
  afterEach(() => {
    if (original === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = original;
  });

  it('opens production to crawlers but keeps the API and the design system out', () => {
    process.env.VERCEL_ENV = 'production';
    const result = robots();
    expect(result.rules).toMatchObject({ allow: '/' });
    expect((result.rules as { disallow: string[] }).disallow).toEqual(
      expect.arrayContaining(['/api/', '/design-system'])
    );
    expect(result.sitemap).toBe('https://autocapgroup.se/sitemap.xml');
  });

  it('closes preview addresses completely', () => {
    process.env.VERCEL_ENV = 'preview';
    const result = robots();
    expect(result.rules).toEqual({ userAgent: '*', disallow: '/' });
    expect(result.sitemap).toBeUndefined();
  });
});
