import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /_next/ must stay crawlable: Google needs the CSS and JS to render pages.
      disallow: ['/api/'],
    },
    sitemap: 'https://autocapgroup.se/sitemap.xml',
  };
}
