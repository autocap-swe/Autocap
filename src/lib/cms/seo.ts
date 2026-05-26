import type { Metadata } from 'next';
import type { StrapiMedia } from './media';
import { cmsMediaUrl } from './media';

export interface CmsSeo {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: StrapiMedia | null;
}

const SITE_NAME = 'AutoCap Group';

export function buildMetadata(defaults: Metadata, seo?: CmsSeo | null, locale?: string): Metadata {
  const title = seo?.metaTitle ?? defaults.title;
  const description = seo?.metaDescription ?? (defaults.description as string | undefined);
  const ogImageUrl = cmsMediaUrl(seo?.ogImage);
  const ogLocale = locale === 'sv' ? 'sv_SE' : 'en_US';

  return {
    ...defaults,
    title,
    description,
    openGraph: {
      siteName: SITE_NAME,
      locale: ogLocale,
      type: 'website',
      title: (title as string) ?? undefined,
      description: description ?? undefined,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, alt: SITE_NAME }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: (title as string) ?? undefined,
      description: description ?? undefined,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}
