'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';

export interface LogoTile {
  key: string;
  name: string;
  city: string;
  region: 'east' | 'west';
  tireHotel: boolean;
}

export type LogoFilter = 'all' | 'east' | 'west' | 'tireHotel';

interface LogoWallProps {
  tiles: LogoTile[];
  /** Where a tile links: "#company-<key>" on the companies page, "/portfolio#company-<key>" elsewhere. */
  hrefBase: string;
  labels: Record<LogoFilter, string> & { group: string };
  filters?: LogoFilter[];
  columns?: 3 | 4;
  /** Extra tile after the brands, e.g. "All 13 workshops". */
  moreLabel?: string;
}

function matches(tile: LogoTile, filter: LogoFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'tireHotel') return tile.tireHotel;
  return tile.region === filter;
}

/** Brand tiles with filter chips. Names stand in until logotype files exist. */
export function LogoWall({ tiles, hrefBase, labels, filters = ['all', 'east', 'west', 'tireHotel'], columns = 4, moreLabel }: LogoWallProps) {
  const [filter, setFilter] = useState<LogoFilter>('all');
  const visible = tiles.filter(tile => matches(tile, filter));
  const gridCols = columns === 4 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3';

  return (
    <div className="flex flex-col gap-7">
      <div role="group" aria-label={labels.group} className="flex flex-wrap gap-2">
        {filters.map(option => {
          const active = option === filter;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(option)}
              className={`min-h-11 rounded-full px-4 text-[13px] font-medium transition-colors ${
                active ? 'bg-ink text-white' : 'border border-on-dark-2 text-ink hover:border-ink'
              }`}
            >
              {labels[option]}
            </button>
          );
        })}
      </div>
      <ul className={`m-0 grid list-none gap-3 p-0 ${gridCols}`}>
        {visible.map(tile => (
          <li key={tile.key}>
            <Link
              href={`${hrefBase}company-${tile.key}`}
              className="group flex h-[110px] flex-col items-center justify-center gap-1 border border-rule p-3 text-center text-ink no-underline transition-colors hover:border-ink lg:h-[120px]"
            >
              <span className="text-[15px] font-semibold leading-tight">{tile.name}</span>
              <span className="t-meta text-text-3 transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
                {tile.city}
              </span>
            </Link>
          </li>
        ))}
        {moreLabel && filter === 'all' && (
          <li>
            <Link
              href="/portfolio"
              className="flex h-[110px] items-center justify-center border border-dashed border-on-dark-2 p-3 text-center text-sm font-medium text-text-2 no-underline hover:border-ink hover:text-ink lg:h-[120px]"
            >
              {moreLabel} →
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}
