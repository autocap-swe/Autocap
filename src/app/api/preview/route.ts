import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const CMS_API_URL = process.env.CMS_API_URL ?? 'http://localhost:1337';

async function getSlugByDocumentId(
  type: string,
  documentId: string,
  locale: string,
  status: string = 'published'
): Promise<string | null> {
  try {
    const res = await fetch(
      `${CMS_API_URL}/api/${type}s/${documentId}?fields=slug&locale=${locale}&status=${status}`,
      {
        cache: 'no-store',
        headers: process.env.STRAPI_API_TOKEN
          ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
          : {},
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.slug ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const type = request.nextUrl.searchParams.get('type');
  const documentId = request.nextUrl.searchParams.get('documentId');
  const redirectTo = request.nextUrl.searchParams.get('redirectTo');
  const locale = request.nextUrl.searchParams.get('locale') ?? 'en';

  if (!process.env.STRAPI_PREVIEW_SECRET || secret !== process.env.STRAPI_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const status = request.nextUrl.searchParams.get('status') ?? 'published';
  const draft = await draftMode();

  if (status === 'draft') {
    draft.enable();
  } else {
    draft.disable();
  }

  // Single types — redirectTo is the full path
  if (redirectTo) {
    redirect(redirectTo);
  }

  // Collection types — look up slug by documentId
  if (type === 'news-article' && documentId) {
    const slug = await getSlugByDocumentId('news-article', documentId, locale, status);
    redirect(`/${locale}/news/${slug ?? documentId}`);
  }

  if (type === 'workshop' && documentId) {
    const slug = await getSlugByDocumentId('workshop', documentId, locale, status);
    redirect(`/${locale}/portfolio/${slug ?? documentId}`);
  }

  redirect(`/${locale}`);
}
