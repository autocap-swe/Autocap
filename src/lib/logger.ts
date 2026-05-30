function anonymizeIp(ip: string): string {
  const ipv4 = ip.match(/^(\d+\.\d+\.\d+\.)\d+$/);
  if (ipv4) return `${ipv4[1]}0`;
  // IPv6: zero everything after first two groups
  const ipv6Parts = ip.split(':');
  if (ipv6Parts.length > 2) return `${ipv6Parts[0]}:${ipv6Parts[1]}::0`;
  return '0.0.0.0';
}

export function logRequest(req: Request, status: number, extra?: Record<string, unknown>) {
  const ip =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown';

  const entry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: new URL(req.url).pathname,
    status,
    ip: anonymizeIp(ip),
    userAgent: req.headers.get('user-agent') ?? 'unknown',
    ...extra,
  };

  // JSON structured log — captured by log aggregation (Datadog, Logtail, etc.)
  console.log(JSON.stringify(entry));
}
