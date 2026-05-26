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

export interface CmsMediaKitPage {
  categories: CmsMediaKitCategory[];
}
