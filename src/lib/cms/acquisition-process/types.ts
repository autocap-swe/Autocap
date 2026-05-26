import type { CmsSeo } from '../seo';
export interface CmsProcessStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
}

export interface CmsAcquisitionProcess {
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
  intro: string;
  totalTimeline: string;
  ctaText: string;
  steps: ProcessStep[];
  seo?: CmsSeo | null;
}
