export interface CmsProcessStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
}

export interface CmsAcquisitionProcess {
  steps: CmsProcessStep[];
}

export interface ProcessStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
}

export interface AcquisitionProcess {
  steps: ProcessStep[];
}
