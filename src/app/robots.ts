import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/cms/seo';

/** Only the production deployment may be indexed; preview addresses are closed to crawlers. */
export function isIndexable(): boolean {
  return process.env.VERCEL_ENV === undefined || process.env.VERCEL_ENV === 'production';
}

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /_next/ must stay crawlable: Google needs the CSS and JS to render pages.
      disallow: ['/api/', '/design-system', '/sv/design-system'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
