import type { CmsMediaKitPage, CmsMediaKitCategory, CmsMediaAsset } from './types';
import type { AssetCategory, MediaAsset } from '@/types/media-kit';

const CMS_URL = (process.env.CMS_API_URL ?? 'http://localhost:1337').replace(/\/$/, '');

function resolveUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${CMS_URL}${url}`;
}

function formatFromExt(ext: string): string {
  return ext.replace('.', '').toUpperCase();
}

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${Math.round(kb)} KB`;
}

function assetMapper(cms: CmsMediaAsset, index: number): MediaAsset {
  return {
    id: index,
    name: cms.name,
    description: cms.description,
    format: cms.file ? formatFromExt(cms.file.ext) : '',
    size: cms.file ? formatSize(cms.file.size) : undefined,
    fileUrl: resolveUrl(cms.file?.url),
    order: index,
  };
}

function categoryMapper(cms: CmsMediaKitCategory, index: number): AssetCategory {
  return {
    id: index,
    title: cms.title,
    description: cms.description,
    order: index,
    assets: (cms.assets ?? []).map(assetMapper),
  };
}

export function mediaKitPageMapper(page: CmsMediaKitPage): AssetCategory[] {
  return (page.categories ?? []).map(categoryMapper);
}
