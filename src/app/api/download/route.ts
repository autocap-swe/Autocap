import { NextRequest, NextResponse, after } from 'next/server';
import { logRequest } from '@/lib/logger';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const assetName = request.nextUrl.searchParams.get('name') ?? 'unknown';

  if (!url) {
    logRequest(request, 400);
    return NextResponse.json({ error: 'missing url' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    logRequest(request, 400);
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    logRequest(request, 403);
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let res: Response;
  try {
    res = await fetch(parsed.toString());
  } catch (err) {
    console.error('[download proxy] fetch failed:', parsed.toString(), err);
    logRequest(request, 502, { asset: assetName });
    return NextResponse.json({ error: 'fetch failed' }, { status: 502 });
  }

  if (!res.ok) {
    logRequest(request, 502, { asset: assetName });
    return NextResponse.json({ error: 'upstream error' }, { status: 502 });
  }

  const filename = parsed.pathname.split('/').pop() ?? 'download';
  const contentType = res.headers.get('content-type') ?? 'application/octet-stream';
  const body = await res.arrayBuffer();

  logRequest(request, 200, {
    event: 'asset_download',
    asset: assetName,
    filename,
    bytes: body.byteLength,
  });

  const cmsUrl = process.env.CMS_API_URL ?? 'http://localhost:1337';
  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown';

  after(async () => {
    try {
      const r = await fetch(`${cmsUrl}/api/download-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.STRAPI_API_TOKEN && {
            Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
          }),
        },
        body: JSON.stringify({
          data: {
            assetName,
            assetUrl: url,
            filename,
            bytes: body.byteLength,
            ip: ip.replace(/\.\d+$/, '.0'),
            userAgent: request.headers.get('user-agent') ?? '',
          },
        }),
      });
      if (!r.ok) {
        const text = await r.text().catch(() => '');
        console.error('[download-event] Strapi POST failed:', r.status, text);
      }
    } catch (err) {
      console.error('[download-event] Strapi POST error:', err);
    }
  });

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
