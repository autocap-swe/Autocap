import type { CmsSeo } from '../seo';

interface CmsWorkshopLocalization {
  slug: string;
  locale: string;
}

// Strapi shape — what GET /api/workshops returns per item
export interface CmsWorkshop {
  id: number;
  documentId: string;
  locale?: string;
  name: string;
  slug: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  acquisitionStatus: 'acquired' | 'pending' | 'target';
  yearAcquired: string;
  yearFounded?: string | null;
  localWebsite: string;
  description: string;
  partnershipNote?: string | null;
  image: { url: string } | null;
  localizations?: CmsWorkshopLocalization[];
  seo?: CmsSeo | null;
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
  /** Year the business was founded, when known. */
  yearFounded?: number;
  localWebsite: string;
  description: string;
  partnershipNote?: string | null;
  imageUrl?: string;
  /** Maps locale code → slug for all published translations of this workshop */
  localizedSlugs?: Record<string, string>;
  seo?: CmsSeo | null;
}
