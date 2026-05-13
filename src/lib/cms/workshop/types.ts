// Strapi shape — what GET /api/workshops returns per item
export interface CmsWorkshop {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  acquisitionStatus: 'acquired' | 'pending' | 'target';
  yearAcquired: number;
  localWebsite: string;
  description: string;
}

// Page shape — what the frontend renders
export interface Workshop {
  id: number;
  name: string;
  slug: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  status: 'acquired' | 'pending' | 'target';
  yearAcquired: number;
  localWebsite: string;
  description: string;
  imageUrl?: string;
}
