/**
 * Viewport maths for the tile-less pin plane.
 *
 * The view is held in percentages of the plane, so pins can be placed without
 * measuring anything: a pin's on-screen position is `base * scale + offset`.
 * Zoom scales positions only — pins keep their size, the way map markers do.
 */

export const MIN_SCALE = 1;
export const MAX_SCALE = 8;
/** Multiplier applied by one press of the zoom buttons. */
export const ZOOM_STEP = 1.6;

export interface PlaneView {
  scale: number;
  /** Pan offset, in percent of the plane's width and height. */
  x: number;
  y: number;
}

export const INITIAL_VIEW: PlaneView = { scale: 1, x: 0, y: 0 };

function clamp(value: number, min: number, max: number): number {
  const clamped = Math.min(max, Math.max(min, value));
  // Clamping against 0 yields -0, which reads oddly in dev tools and in tests.
  return clamped === 0 ? 0 : clamped;
}

/** Keeps the scaled content covering the plane, so no empty margin drifts in. */
export function clampView(view: PlaneView): PlaneView {
  const scale = clamp(view.scale, MIN_SCALE, MAX_SCALE);
  const lowest = -(scale - 1) * 100;

  return {
    scale,
    x: clamp(view.x, lowest, 0),
    y: clamp(view.y, lowest, 0),
  };
}

/**
 * Zooms by `factor` while holding the point under (focalX, focalY) still —
 * the same behaviour as scrolling over a map with the cursor on a landmark.
 * Focal coordinates are percentages of the plane.
 */
export function zoomAt(view: PlaneView, factor: number, focalX: number, focalY: number): PlaneView {
  const scale = clamp(view.scale * factor, MIN_SCALE, MAX_SCALE);
  const applied = scale / view.scale;

  return clampView({
    scale,
    x: focalX - (focalX - view.x) * applied,
    y: focalY - (focalY - view.y) * applied,
  });
}

/** Pans by a delta already expressed in percent of the plane. */
export function panBy(view: PlaneView, deltaX: number, deltaY: number): PlaneView {
  return clampView({ scale: view.scale, x: view.x + deltaX, y: view.y + deltaY });
}

/** Where a pin sits after the view is applied, still in percent. */
export function placePin(view: PlaneView, baseX: number, baseY: number) {
  return { x: baseX * view.scale + view.x, y: baseY * view.scale + view.y };
}

export function isDefaultView(view: PlaneView): boolean {
  return view.scale === INITIAL_VIEW.scale && view.x === 0 && view.y === 0;
}
