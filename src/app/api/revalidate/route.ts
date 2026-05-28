import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const CONTENT_TYPE_TAGS: Record<string, (slug?: string) => string[]> = {
  'news-article': slug => [
    'news-articles',
    ...(slug ? [`news-article:${slug}`, `news-article:${slug}:en`, `news-article:${slug}:sv`] : []),
  ],
  workshop: slug => [
    'workshops',
    ...(slug ? [`workshop:${slug}`, `workshop:${slug}:en`, `workshop:${slug}:sv`] : []),
  ],
  'team-member': () => ['team-members'],
  testimonial: () => ['testimonials'],
  'media-kit-page': () => ['media-kit-categories'],
  'contact-page': () => ['contact-page'],
  'kpi-ticker': () => ['kpi-ticker'],
  homepage: () => ['homepage'],
  'about-page': () => ['about-page'],
  'story-page': () => ['story-page'],
  'entrepreneurs-page': () => ['entrepreneurs-page'],
  'investors-page': () => ['investors-page'],
  'sustainability-page': () => ['sustainability-page'],
  'acquisition-process': () => ['acquisition-process'],
  'growth-milestones': () => ['growth-milestones'],
  'investment-pillars': () => ['investment-pillars'],
  'privacy-policy': () => ['privacy-policy'],
  'cookie-policy': () => ['cookie-policy'],
  'team-page': () => ['team-page'],
  'portfolio-page': () => ['portfolio-page'],
};

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { contentType?: string; slug?: string; model?: string; entry?: { slug?: string } };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const contentType = body.contentType ?? body.model;
  const slug = body.slug ?? body.entry?.slug;

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
