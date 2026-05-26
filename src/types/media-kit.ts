export interface MediaAsset {
  id: number;
  name: string;
  description: string;
  format: string;
  size?: string;
  fileUrl?: string;
  order: number;
}

export interface AssetCategory {
  id: number;
  title: string;
  description: string;
  assets: MediaAsset[];
  order: number;
}
