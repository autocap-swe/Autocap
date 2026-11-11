import { cmsBaseUrl } from '@/lib/cms/base-url';
export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  mime?: string;
}

export function cmsMediaUrl(media?: StrapiMedia | null): string | undefined {
  if (!media?.url) return undefined;
  if (media.url.startsWith('http')) return media.url;
  const base = process.env.NEXT_PUBLIC_CMS_API_URL ?? cmsBaseUrl();
  return `${base}${media.url}`;
}
