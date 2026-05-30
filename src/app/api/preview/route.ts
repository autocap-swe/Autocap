import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const slug = request.nextUrl.searchParams.get('slug');
  const locale = request.nextUrl.searchParams.get('locale') ?? 'en';
  const type = request.nextUrl.searchParams.get('type');

  if (!process.env.STRAPI_PREVIEW_SECRET || secret !== process.env.STRAPI_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  if (type === 'news-article' && slug) {
    redirect(`/${locale}/news/${slug}`);
  }
  if (type === 'workshop' && slug) {
    redirect(`/${locale}/portfolio/${slug}`);
  }

  redirect(`/${locale}`);
}
