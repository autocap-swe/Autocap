import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsSustainabilityPage, SustainabilityPageContent } from './types';
import { sustainabilityPageMapper } from './mapper';

export async function getSustainabilityPageContent(
  revalidate = REVALIDATE_HIGH,
  locale?: string
): Promise<SustainabilityPageContent> {
  return getContent<CmsSustainabilityPage, SustainabilityPageContent>('sustainability-page', {
    revalidate,
    mapper: sustainabilityPageMapper,
    locale,
    tags: ['sustainability-page'],
    params: { populate: 'whereWeAreFocusAreas,heroImage' },
  });
}
