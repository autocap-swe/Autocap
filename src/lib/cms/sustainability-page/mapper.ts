import type { CmsSustainabilityPage, SustainabilityPageContent } from './types';

export function sustainabilityPageMapper(cms: CmsSustainabilityPage): SustainabilityPageContent {
  return { ...cms };
}
