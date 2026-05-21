import type { CmsAcquisitionProcess, AcquisitionProcess } from './types';

export function acquisitionProcessMapper(cms: CmsAcquisitionProcess): AcquisitionProcess {
  return {
    steps: [...cms.steps]
      .sort((a, b) => a.stepNumber - b.stepNumber)
      .map(step => ({
        id: step.id,
        stepNumber: step.stepNumber,
        title: step.title,
        description: step.description,
      })),
  };
}
