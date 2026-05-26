import { NextRequest, NextResponse } from 'next/server';

const CMS_API_URL = process.env.CMS_API_URL || 'http://localhost:1337';
const CMS_HOST = new URL(CMS_API_URL).host;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'missing url' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url, CMS_API_URL);
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }

  if (parsed.host !== CMS_HOST) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let res: Response;
  try {
    res = await fetch(parsed.toString());
  } catch (err) {
    console.error('[download proxy] fetch failed:', err);
    return NextResponse.json({ error: 'fetch failed' }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: 'upstream error', status: res.status }, { status: 502 });
  }

  const filename = parsed.pathname.split('/').pop() ?? 'download';
  const contentType = res.headers.get('content-type') ?? 'application/octet-stream';

  const body = await res.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
