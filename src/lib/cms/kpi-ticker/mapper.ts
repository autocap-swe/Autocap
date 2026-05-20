import type { CmsKpiTicker, KpiTicker } from './types';

export function kpiTickerMapper(cms: CmsKpiTicker): KpiTicker {
  return [
    {
      value: cms.workshopCount,
      label: cms.workshopCountLabel,
    },
    {
      value: cms.peopleCount,
      label: cms.peopleCountLabel,
      ...(cms.peopleCountPrefix ? { prefix: cms.peopleCountPrefix } : {}),
    },
    {
      value: cms.revenueValue,
      label: cms.revenueLabel,
      ...(cms.revenuePrefix ? { prefix: cms.revenuePrefix } : {}),
      ...(cms.revenueSuffix ? { suffix: cms.revenueSuffix } : {}),
    },
    {
      value: cms.targetWorkshops,
      label: cms.targetLabel,
    },
  ];
}
