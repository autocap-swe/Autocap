/**
 * Security headers for every response. The content security policy is sent in report-only
 * mode: browsers report what it would block but block nothing, so a missing source cannot
 * break the site while the list is being verified.
 */

const SELF = "'self'";
const CMS = 'https://cms.autocapgroup.se';
const MEDIA = [
  'https://autocap-strapi.fra1.digitaloceanspaces.com',
  'https://autocap-strapi.fra1.cdn.digitaloceanspaces.com',
];

interface HeaderOptions {
  /** Local development talks to a CMS on localhost and uses eval for hot reload. */
  development?: boolean;
  /** Public Sentry DSN; when present, violations are reported to the Sentry project. */
  sentryDsn?: string;
}

/** Sentry's CSP report endpoint for a DSN, or undefined when the DSN is missing or malformed. */
export function sentryReportUri(dsn: string | undefined): string | undefined {
  if (!dsn) return undefined;
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/\//g, '');
    if (!url.username || !projectId) return undefined;
    return `https://${url.host}/api/${projectId}/security/?sentry_key=${url.username}`;
  } catch {
    return undefined;
  }
}

export function contentSecurityPolicy({ development = false, sentryDsn }: HeaderOptions = {}): string {
  const localCms = development ? ['http://localhost:1337'] : [];
  const directives: Record<string, string[]> = {
    'default-src': [SELF],
    // Next.js inlines its bootstrap scripts. A nonce would remove 'unsafe-inline' but forces
    // every page to render per request, which undoes static generation.
    'script-src': [
      SELF,
      "'unsafe-inline'",
      ...(development ? ["'unsafe-eval'"] : []),
      'https://challenges.cloudflare.com', // Turnstile
      'https://www.googletagmanager.com', // Google Analytics, after consent
      'https://vercel.live', // Vercel preview toolbar
    ],
    'style-src': [SELF, "'unsafe-inline'"], // Tailwind and Mapbox inject inline styles
    'img-src': [
      SELF,
      'data:',
      'blob:',
      CMS,
      ...MEDIA,
      ...localCms,
      'https://www.googletagmanager.com',
      'https://*.google-analytics.com',
      'https://vercel.live',
      'https://vercel.com',
    ],
    'media-src': [SELF, CMS, ...MEDIA, ...localCms],
    'font-src': [SELF, 'data:', 'https://vercel.live'],
    'connect-src': [
      SELF,
      CMS,
      ...localCms,
      'https://api.mapbox.com',
      'https://events.mapbox.com',
      'https://*.tiles.mapbox.com',
      'https://*.sentry.io',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://www.googletagmanager.com',
      'https://vercel.live',
      'wss://ws-us3.pusher.com', // Vercel preview comments
    ],
    'worker-src': [SELF, 'blob:'], // Mapbox renders in a web worker created from a blob
    'child-src': [SELF, 'blob:'],
    'frame-src': [SELF, 'https://challenges.cloudflare.com', 'https://vercel.live'],
    'object-src': ["'none'"],
    'base-uri': [SELF],
    'form-action': [SELF],
  };
  const reportUri = sentryReportUri(sentryDsn);
  const parts = Object.entries(directives).map(([name, sources]) => `${name} ${sources.join(' ')}`);
  if (reportUri) parts.push(`report-uri ${reportUri}`);
  return parts.join('; ');
}

/** The CMS embeds the site in an iframe for editor preview; nobody else may frame it. */
export function frameAncestors({ development = false }: HeaderOptions = {}): string {
  return ["frame-ancestors 'self'", CMS, ...(development ? ['http://localhost:1337'] : [])].join(' ');
}

export function securityHeaders(options: HeaderOptions = {}): { key: string; value: string }[] {
  return [
    // Enforced. Replaces X-Frame-Options, which cannot allow the CMS preview iframe.
    { key: 'Content-Security-Policy', value: frameAncestors(options) },
    { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy(options) },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    },
  ];
}
