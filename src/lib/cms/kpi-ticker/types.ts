export interface CmsKpiTicker {
  workshopCount: number;
  workshopCountLabel: string;
  peopleCount: number;
  peopleCountPrefix: string | null;
  peopleCountLabel: string;
  revenueValue: number;
  revenuePrefix: string | null;
  revenueSuffix: string | null;
  revenueLabel: string;
  targetWorkshops: number;
  targetLabel: string;
}

export interface KpiItem {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export type KpiTicker = KpiItem[];
