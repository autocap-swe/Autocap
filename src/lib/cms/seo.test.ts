import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import {
  buildAlternates,
  buildMetadata,
  DEFAULT_OG_IMAGE,
  localePath,
  localizedSlugPath,
} from './seo';
import { STATIC_ROUTES } from '@/app/sitemap';

jest.mock('@/lib/cms/article', () => ({ getArticlesContent: jest.fn() }));
jest.mock('@/lib/cms/workshop', () => ({ getWorkshopsContent: jest.fn() }));

describe('SEO helpers (fas A)', () => {
  it('AC-SEO-1: English has no prefix, Swedish uses /sv', () => {
    expect(localePath('en', '/')).toBe('/');
    expect(localePath('en', '/about')).toBe('/about');
    expect(localePath('sv', '/')).toBe('/sv');
    expect(localePath('sv', '/about')).toBe('/sv/about');
  });

  it('AC-SEO-2: canonical points to the current language and hreflang lists both plus x-default', () => {
    expect(buildAlternates('sv', { en: '/about', sv: '/about' })).toEqual({
      canonical: 'https://autocapgroup.se/sv/about',
      languages: {
        en: 'https://autocapgroup.se/about',
        sv: 'https://autocapgroup.se/sv/about',
        'x-default': 'https://autocapgroup.se/about',
      },
    });
  });

  it('AC-SEO-3: no hreflang to a translation that does not exist', () => {
    const svOnly = buildAlternates('sv', {
      sv: localizedSlugPath('/news', undefined, 'sv', 'sv', 'nyhet'),
    });
    expect(svOnly.canonical).toBe('https://autocapgroup.se/sv/news/nyhet');
    expect(svOnly.languages).toEqual({ sv: 'https://autocapgroup.se/sv/news/nyhet' });
    expect(localizedSlugPath('/news', { en: 'news-en' }, 'en', 'sv', 'nyhet')).toBe(
      '/news/news-en'
    );
  });

  it('AC-SEO-4: every page gets an og:image, with the default as last resort', () => {
    const meta = buildMetadata({ title: 'T', description: 'D' }, null, 'en', { path: '/' });
    expect(meta.openGraph?.images).toEqual([{ url: DEFAULT_OG_IMAGE, alt: 'AutoCap Group' }]);
    const withHero = buildMetadata({ title: 'T' }, null, 'en', {
      path: '/about',
      fallbackOgImage: 'https://cdn.example/hero.jpg',
    });
    expect(withHero.openGraph?.images).toEqual([
      { url: 'https://cdn.example/hero.jpg', alt: 'AutoCap Group' },
    ]);
  });

  it('AC-SEO-5: CMS SEO fields win over page defaults', () => {
    const meta = buildMetadata(
      { title: 'Default', description: 'Default' },
      {
        metaTitle: 'From CMS',
        metaDescription: 'CMS description',
      }
    );
    expect(meta.title).toBe('From CMS');
    expect(meta.description).toBe('CMS description');
  });
});

describe('Sitemap static routes (fas A)', () => {
  function pageRoutes(dir: string, prefix = ''): string[] {
    const routes: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (!statSync(full).isDirectory()) {
        if (entry === 'page.tsx') routes.push(prefix === '' ? '/' : prefix);
        continue;
      }
      if (entry.startsWith('[')) continue;
      routes.push(...pageRoutes(full, `${prefix}/${entry}`));
    }
    return routes;
  }

  it('AC-SEO-6: lists exactly the static pages that exist', () => {
    const actual = pageRoutes(join(process.cwd(), 'src/app/[locale]')).sort();
    expect([...STATIC_ROUTES].sort()).toEqual(actual);
  });
});
