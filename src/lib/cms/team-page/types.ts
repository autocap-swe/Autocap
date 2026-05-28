import type { CmsSeo } from '../seo';
import type { StrapiMedia } from '../media';

export interface CmsTeamPage {
  heroTitle?: string | null;
  heroDescription?: string | null;
  heroImage?: StrapiMedia | null;
  seo?: CmsSeo | null;
}

export type TeamPageContent = CmsTeamPage;
