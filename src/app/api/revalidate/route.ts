import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const CONTENT_TYPE_TAGS: Record<string, (slug?: string) => string[]> = {
  'news-article': slug => ['news-articles', ...(slug ? [`news-article:${slug}`] : [])],
  workshop: slug => ['workshops', ...(slug ? [`workshop:${slug}`] : [])],
  'contact-page': () => ['contact-page'],
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { contentType?: string; slug?: string };
  try {
    body = (await request.json()) as { contentType?: string; slug?: string };
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { contentType, slug } = body;

  if (!contentType || !(contentType in CONTENT_TYPE_TAGS)) {
    return NextResponse.json(
      { revalidated: false, reason: 'unknown_content_type' },
      { status: 200 }
    );
  }

  const tags = CONTENT_TYPE_TAGS[contentType](slug);

  for (const tag of tags) {
    revalidateTag(tag);
  }

  console.log(
    `[Revalidate] ${contentType}${slug ? ` slug=${slug}` : ''} → tags: ${tags.join(', ')}`
  );
  return NextResponse.json({ revalidated: true, contentType, tags });
}

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 });
}
