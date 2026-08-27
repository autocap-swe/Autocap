import type { CSSProperties } from 'react';

/** Gap between the pin and the popup, matching the map's `Popup({ offset: 25 })`. */
export const POPUP_OFFSET = 25;
/** How far the popup's near edge sits from the pin when it is edge-aligned. */
const TIP_INSET = 22;

export type VerticalAnchor = 'top' | 'bottom';
export type HorizontalAnchor = 'left' | 'center' | 'right';

export interface PopupAnchor {
  /** 'top' puts the popup below the pin, 'bottom' above it — Mapbox's naming. */
  vertical: VerticalAnchor;
  horizontal: HorizontalAnchor;
}

export interface AnchorInput {
  /** Pin position in pixels, relative to the plane. */
  pinX: number;
  pinY: number;
  planeWidth: number;
  planeHeight: number;
  popupWidth: number;
  popupHeight: number;
}

/**
 * Picks the popup's anchor the way Mapbox GL does when no anchor is set: below
 * the pin while it fits, above it otherwise, and pulled towards the nearer side
 * when centring would push the popup past a horizontal edge.
 */
export function resolvePopupAnchor({
  pinX,
  pinY,
  planeWidth,
  planeHeight,
  popupWidth,
  popupHeight,
}: AnchorInput): PopupAnchor {
  const fitsBelow = pinY + POPUP_OFFSET + popupHeight <= planeHeight;
  const fitsAbove = pinY - POPUP_OFFSET - popupHeight >= 0;

  // Prefer below, fall back to above, and stay below when neither fits.
  const vertical: VerticalAnchor = fitsBelow || !fitsAbove ? 'top' : 'bottom';

  const half = popupWidth / 2;
  let horizontal: HorizontalAnchor = 'center';
  if (pinX < half) horizontal = 'left';
  else if (pinX > planeWidth - half) horizontal = 'right';

  return { vertical, horizontal };
}

/** Turns an anchor into the popup wrapper's positioning styles. */
export function anchorStyle(pinX: number, pinY: number, anchor: PopupAnchor): CSSProperties {
  const x =
    anchor.horizontal === 'center'
      ? 'translateX(-50%)'
      : anchor.horizontal === 'left'
        ? `translateX(-${TIP_INSET}px)`
        : `translateX(calc(-100% + ${TIP_INSET}px))`;

  const y =
    anchor.vertical === 'top'
      ? `translateY(${POPUP_OFFSET}px)`
      : `translateY(calc(-100% - ${POPUP_OFFSET}px))`;

  return { left: `${pinX}px`, top: `${pinY}px`, transform: `${x} ${y}` };
}

/** Position of the little pointer, so it stays over the pin on every anchor. */
export function tipStyle(anchor: PopupAnchor): CSSProperties {
  const horizontal: CSSProperties =
    anchor.horizontal === 'center'
      ? { left: '50%', marginLeft: -5 }
      : anchor.horizontal === 'left'
        ? { left: TIP_INSET, marginLeft: -5 }
        : { right: TIP_INSET, marginRight: -5 };

  const vertical: CSSProperties = anchor.vertical === 'top' ? { top: -5 } : { bottom: -5 };

  return { ...horizontal, ...vertical };
}
