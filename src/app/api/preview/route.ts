import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

const CMS_API_URL = process.env.CMS_API_URL ?? 'http://localhost:1337';

async function getSlugByDocumentId(
  type: string,
  documentId: string,
  locale: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${CMS_API_URL}/api/${type}s/${documentId}?fields=slug&locale=${locale}`,
      { cache: 'no-store' }
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
  const locale = request.nextUrl.searchParams.get('locale') ?? 'en';

  if (!process.env.STRAPI_PREVIEW_SECRET || secret !== process.env.STRAPI_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  if (type === 'news-article' && documentId) {
    const slug = await getSlugByDocumentId('news-article', documentId, locale);
    redirect(`/${locale}/news/${slug ?? documentId}`);
  }

  if (type === 'workshop' && documentId) {
    const slug = await getSlugByDocumentId('workshop', documentId, locale);
    redirect(`/${locale}/portfolio/${slug ?? documentId}`);
  }

  redirect(`/${locale}`);
}
