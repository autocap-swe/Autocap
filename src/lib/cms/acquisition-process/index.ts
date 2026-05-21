import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsAcquisitionProcess, AcquisitionProcess } from './types';
import { acquisitionProcessMapper } from './mapper';

export async function getAcquisitionProcessContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<AcquisitionProcess> {
  const options = {
    revalidate,
    tags: ['acquisition-process'],
    params: { populate: 'steps' },
    mapper: acquisitionProcessMapper,
  };

  const result = await getContent<CmsAcquisitionProcess, AcquisitionProcess>(
    'acquisition-process',
    { ...options, locale }
  );

  if (!result && locale && locale !== 'en') {
    return getContent<CmsAcquisitionProcess, AcquisitionProcess>('acquisition-process', {
      ...options,
      locale: 'en',
    });
  }

  return result;
}
