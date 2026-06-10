import type { CmsSeo } from '../seo';
export interface CmsProcessStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
}

export interface CmsAcquisitionProcess {
  heading?: string;
  intro?: string;
  totalTimeline?: string;
  ctaText?: string;
  steps: CmsProcessStep[];
  seo?: CmsSeo | null;
}

export interface ProcessStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
}

export interface AcquisitionProcess {
  heading: string;
  intro: string;
  totalTimeline: string;
  ctaText: string;
  steps: ProcessStep[];
  seo?: CmsSeo | null;
}
