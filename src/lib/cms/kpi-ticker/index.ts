import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsKpiTicker, KpiTicker } from './types';
import { kpiTickerMapper } from './mapper';

export async function getKpiTickerContent(
  revalidate = REVALIDATE_HIGH,
  locale?: string
): Promise<KpiTicker> {
  const options = {
    revalidate,
    tags: ['kpi-ticker'],
    mapper: kpiTickerMapper,
  };

  const result = await getContent<CmsKpiTicker, KpiTicker>('kpi-ticker', {
    ...options,
    locale,
  });

  if (!result && locale && locale !== 'en') {
    return getContent<CmsKpiTicker, KpiTicker>('kpi-ticker', {
      ...options,
      locale: 'en',
    });
  }

  return result;
}
