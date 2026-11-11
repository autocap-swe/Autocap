import { contentSecurityPolicy, frameAncestors, securityHeaders, sentryReportUri } from './headers';

describe('security headers', () => {
  it('keeps the full policy in report-only mode and enforces only frame-ancestors', () => {
    const headers = securityHeaders();
    const enforced = headers.find(h => h.key === 'Content-Security-Policy')?.value;
    expect(enforced).toBe("frame-ancestors 'self' https://cms.autocapgroup.se");
    expect(headers.some(h => h.key === 'Content-Security-Policy-Report-Only')).toBe(true);
    expect(headers.some(h => h.key === 'X-Frame-Options')).toBe(false);
  });

  it('sends the baseline hardening headers', () => {
    const keys = securityHeaders().map(h => h.key);
    expect(keys).toEqual(
      expect.arrayContaining([
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy',
      ])
    );
  });

  it('allows the third parties the site depends on', () => {
    const policy = contentSecurityPolicy();
    expect(policy).toContain('https://challenges.cloudflare.com');
    expect(policy).toContain('https://api.mapbox.com');
    expect(policy).toContain("worker-src 'self' blob:");
    expect(policy).toContain('https://*.sentry.io');
    expect(policy).toContain("object-src 'none'");
  });

  it('never references localhost outside development', () => {
    expect(contentSecurityPolicy()).not.toContain('localhost');
    expect(frameAncestors()).not.toContain('localhost');
    expect(contentSecurityPolicy({ development: true })).toContain('http://localhost:1337');
  });

  it('reports violations to Sentry when a DSN is configured', () => {
    expect(sentryReportUri('https://abc123@o1.ingest.de.sentry.io/42')).toBe(
      'https://o1.ingest.de.sentry.io/api/42/security/?sentry_key=abc123'
    );
    expect(sentryReportUri(undefined)).toBeUndefined();
    expect(sentryReportUri('not a url')).toBeUndefined();
    expect(contentSecurityPolicy({ sentryDsn: 'https://abc123@o1.ingest.de.sentry.io/42' })).toContain(
      'report-uri '
    );
  });
});
