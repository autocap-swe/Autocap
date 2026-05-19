'use client';

import dynamic from 'next/dynamic';
import type { Workshop } from '@/lib/cms/workshop/types';

const WorkshopMap = dynamic(() => import('./WorkshopMap').then(m => ({ default: m.WorkshopMap })), {
  ssr: false,
});

export function WorkshopMapWrapper({ workshops }: { workshops: Workshop[] }) {
  return <WorkshopMap workshops={workshops} />;
}
