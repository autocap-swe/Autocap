'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Workshop } from '@/lib/cms/workshop/types';
import {
  groupWorkshopsByCoordinate,
  type WorkshopLocationGroup,
} from './groupWorkshopsByCoordinate';
import { buildMarkerElement, buildPopupHtml } from './workshopMarkerContent';

interface WorkshopPinPlaneProps {
  workshops: Workshop[];
}

/** Share of the plane left as breathing room around the outermost pins. */
const PADDING = 0.12;
/** Fallback span, in degrees, when every workshop sits on one coordinate. */
const MIN_SPAN = 0.5;

interface Bounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

function boundsOf(groups: WorkshopLocationGroup[]): Bounds {
  const lats = groups.map(group => group.latitude);
  const lngs = groups.map(group => group.longitude);

  const latSpan = Math.max(Math.max(...lats) - Math.min(...lats), MIN_SPAN);
  const lngSpan = Math.max(Math.max(...lngs) - Math.min(...lngs), MIN_SPAN);

  return {
    minLat: Math.min(...lats) - latSpan * PADDING,
    maxLat: Math.max(...lats) + latSpan * PADDING,
    minLng: Math.min(...lngs) - lngSpan * PADDING,
    maxLng: Math.max(...lngs) + lngSpan * PADDING,
  };
}

function projectPercent(bounds: Bounds, latitude: number, longitude: number) {
  return {
    x: ((longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100,
    y: ((bounds.maxLat - latitude) / (bounds.maxLat - bounds.minLat)) * 100,
  };
}

/**
 * Places the popup under its pin, flipping above it in the lower half so it
 * stays inside the plane — the same behaviour Mapbox popups have.
 */
function popupAnchor(bounds: Bounds, latitude: number, longitude: number): CSSProperties {
  const { x, y } = projectPercent(bounds, latitude, longitude);

  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: y > 55 ? 'translate(-50%, calc(-100% - 22px))' : 'translate(-50%, 22px)',
  };
}

/**
 * Renders the portfolio map's pins and popups without map tiles.
 *
 * Used when Mapbox cannot load — most often on preview deployments, where the
 * public token is URL-restricted to the production domains. Positions are a
 * linear projection of the workshop coordinates, so relative placement is
 * right while the geography is only approximate.
 */
export function WorkshopPinPlane({ workshops }: WorkshopPinPlaneProps) {
  const planeRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const groups = useMemo(() => groupWorkshopsByCoordinate(workshops), [workshops]);
  const bounds = useMemo(() => (groups.length ? boundsOf(groups) : null), [groups]);

  useEffect(() => {
    const plane = planeRef.current;
    if (!plane) return;

    plane.querySelectorAll('.marker-slot').forEach(slot => {
      const index = Number((slot as HTMLElement).dataset.index);
      const group = groups[index];
      if (!group) return;

      const el = buildMarkerElement(group);
      // Clicking the same pin closes its popup, mirroring Mapbox's own toggle.
      el.addEventListener('click', () => {
        setOpenKey(current => (current === group.key ? null : group.key));
      });
      slot.replaceChildren(el);
    });
  }, [groups]);

  // A click anywhere that is not a pin here, or the popup itself, closes it.
  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const marker = target.closest('.workshop-marker');
      if (marker && planeRef.current?.contains(marker)) return;
      if (popupRef.current?.contains(target)) return;

      setOpenKey(null);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenKey(null);
    }

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const openGroup = groups.find(group => group.key === openKey) ?? null;

  return (
    <div className="w-full">
      <div
        ref={planeRef}
        data-testid="workshop-pin-plane"
        className="relative h-[500px] w-full overflow-visible rounded-lg border border-gray-200 bg-[repeating-linear-gradient(45deg,#f7f7f8_0_12px,#f2f2f4_12px_24px)] shadow-lg md:h-[600px]"
      >
        {bounds &&
          groups.map((group, index) => {
            const { x, y } = projectPercent(bounds, group.latitude, group.longitude);
            return (
              <div
                key={group.key}
                data-index={index}
                className="marker-slot absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            );
          })}

        {bounds && openGroup && (
          <div
            ref={popupRef}
            className="absolute z-10 w-max max-w-[260px]"
            style={popupAnchor(bounds, openGroup.latitude, openGroup.longitude)}
          >
            <div
              className="rounded-lg border border-gray-200 bg-white shadow-xl"
              dangerouslySetInnerHTML={{ __html: buildPopupHtml(openGroup) }}
            />
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-500">
        The map could not be loaded, so the workshop locations are shown without it. Positions are
        approximate; the workshop list below has the full details.
      </p>
    </div>
  );
}
