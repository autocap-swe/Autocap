'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Workshop } from '@/lib/cms/workshop/types';
import {
  groupWorkshopsByCoordinate,
  type WorkshopLocationGroup,
} from './groupWorkshopsByCoordinate';
import { buildMarkerElement, buildPopupHtml } from './workshopMarkerContent';
import { anchorStyle, resolvePopupAnchor, tipStyle, type PopupAnchor } from './popupAnchor';
import {
  INITIAL_VIEW,
  MAX_SCALE,
  MIN_SCALE,
  ZOOM_STEP,
  isDefaultView,
  panBy,
  placePin,
  zoomAt,
  type PlaneView,
} from './pinPlaneView';

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
  const [anchor, setAnchor] = useState<PopupAnchor>({ vertical: 'top', horizontal: 'center' });
  const [view, setView] = useState<PlaneView>(INITIAL_VIEW);
  const dragRef = useRef<{ pointerId: number; lastX: number; lastY: number } | null>(null);

  /** Percentage coordinates of a pointer event within the plane. */
  const percentOf = useCallback((event: { clientX: number; clientY: number }) => {
    const plane = planeRef.current;
    if (!plane) return null;

    const rect = plane.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    return {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };
  }, []);

  // Wheel must be non-passive so the page does not scroll away under the zoom.
  useEffect(() => {
    const plane = planeRef.current;
    if (!plane) return;

    function handleWheel(event: WheelEvent) {
      event.preventDefault();
      const focal = percentOf(event);
      if (!focal) return;

      const factor = Math.exp(-event.deltaY * 0.002);
      setView(current => zoomAt(current, factor, focal.x, focal.y));
    }

    plane.addEventListener('wheel', handleWheel, { passive: false });
    return () => plane.removeEventListener('wheel', handleWheel);
  }, [percentOf]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest('.workshop-marker')) return;

    dragRef.current = { pointerId: event.pointerId, lastX: event.clientX, lastY: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const plane = planeRef.current;
    if (!plane) return;

    const rect = plane.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const deltaX = ((event.clientX - drag.lastX) / rect.width) * 100;
    const deltaY = ((event.clientY - drag.lastY) / rect.height) * 100;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;

    setView(current => panBy(current, deltaX, deltaY));
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function zoomFromButton(factor: number) {
    setView(current => zoomAt(current, factor, 50, 50));
  }

  const openGroup = groups.find(group => group.key === openKey) ?? null;

  const pinPixels = useCallback(
    (group: WorkshopLocationGroup) => {
      const plane = planeRef.current;
      if (!plane || !bounds) return null;

      const base = projectPercent(bounds, group.latitude, group.longitude);
      const placed = placePin(view, base.x, base.y);

      return {
        pinX: (placed.x / 100) * plane.clientWidth,
        pinY: (placed.y / 100) * plane.clientHeight,
        planeWidth: plane.clientWidth,
        planeHeight: plane.clientHeight,
      };
    },
    [bounds, view]
  );

  // Measure before paint so the popup never appears at the wrong anchor first.
  useLayoutEffect(() => {
    const popup = popupRef.current;
    if (!openGroup || !popup) return;

    const pin = pinPixels(openGroup);
    if (!pin) return;

    setAnchor(
      resolvePopupAnchor({
        ...pin,
        popupWidth: popup.offsetWidth,
        popupHeight: popup.offsetHeight,
      })
    );
  }, [openGroup, pinPixels]);

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

  const openPin = openGroup ? pinPixels(openGroup) : null;

  return (
    <div className="w-full">
      <div
        ref={planeRef}
        data-testid="workshop-pin-plane"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-[500px] w-full cursor-grab touch-none overflow-hidden rounded-lg border border-gray-200 bg-[repeating-linear-gradient(45deg,#f7f7f8_0_12px,#f2f2f4_12px_24px)] shadow-lg active:cursor-grabbing md:h-[600px]"
      >
        <div className="absolute right-3 top-3 z-20 flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow">
          <button
            type="button"
            aria-label="Zoom in"
            disabled={view.scale >= MAX_SCALE}
            onClick={() => zoomFromButton(ZOOM_STEP)}
            className="h-8 w-8 text-lg leading-none text-gray-700 hover:bg-gray-50 disabled:text-gray-300"
          >
            +
          </button>
          <button
            type="button"
            aria-label="Zoom out"
            disabled={view.scale <= MIN_SCALE}
            onClick={() => zoomFromButton(1 / ZOOM_STEP)}
            className="h-8 w-8 border-t border-gray-200 text-lg leading-none text-gray-700 hover:bg-gray-50 disabled:text-gray-300"
          >
            −
          </button>
        </div>

        {!isDefaultView(view) && (
          <button
            type="button"
            onClick={() => setView(INITIAL_VIEW)}
            className="absolute left-3 top-3 z-20 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 shadow hover:bg-gray-50"
          >
            Reset view
          </button>
        )}
        {bounds &&
          groups.map((group, index) => {
            const base = projectPercent(bounds, group.latitude, group.longitude);
            const { x, y } = placePin(view, base.x, base.y);
            return (
              <div
                key={group.key}
                data-index={index}
                className="marker-slot absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            );
          })}

        {openGroup && (
          <div
            ref={popupRef}
            data-testid="workshop-pin-popup"
            data-anchor={`${anchor.vertical}-${anchor.horizontal}`}
            className="absolute z-10 w-max max-w-[260px]"
            style={anchorStyle(openPin?.pinX ?? 0, openPin?.pinY ?? 0, anchor)}
          >
            <span
              aria-hidden="true"
              className="absolute h-[10px] w-[10px] rotate-45 border border-gray-200 bg-white"
              style={{
                ...tipStyle(anchor),
                borderRightColor: anchor.vertical === 'top' ? 'transparent' : undefined,
                borderBottomColor: anchor.vertical === 'top' ? 'transparent' : undefined,
                borderLeftColor: anchor.vertical === 'bottom' ? 'transparent' : undefined,
                borderTopColor: anchor.vertical === 'bottom' ? 'transparent' : undefined,
              }}
            />
            <div
              className="relative rounded-lg border border-gray-200 bg-white shadow-xl"
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
