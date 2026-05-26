export interface CmsMediaAsset {
  name: string;
  description: string;
  file: {
    url: string;
    ext: string;
    size: number;
  } | null;
}

export interface CmsMediaKitCategory {
  title: string;
  description: string;
  assets: CmsMediaAsset[];
}

import type { CmsSeo } from '../seo';

export interface CmsMediaKitPage {
  categories: CmsMediaKitCategory[];
  seo?: CmsSeo | null;
}
