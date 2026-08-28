import {
  INITIAL_VIEW,
  MAX_SCALE,
  MIN_SCALE,
  clampView,
  isDefaultView,
  panBy,
  placePin,
  zoomAt,
} from './pinPlaneView';

describe('zoomAt', () => {
  it('holds the focal point still while zooming in', () => {
    const zoomed = zoomAt(INITIAL_VIEW, 2, 25, 75);

    // The point that was at 25%/75% must still land there afterwards
    expect(placePin(zoomed, 25, 75).x).toBeCloseTo(25, 6);
    expect(placePin(zoomed, 25, 75).y).toBeCloseTo(75, 6);
    expect(zoomed.scale).toBe(2);
  });

  it('spreads pins apart as it zooms', () => {
    const before = Math.abs(placePin(INITIAL_VIEW, 40, 0).x - placePin(INITIAL_VIEW, 60, 0).x);
    const zoomed = zoomAt(INITIAL_VIEW, 2, 50, 50);
    const after = Math.abs(placePin(zoomed, 40, 0).x - placePin(zoomed, 60, 0).x);

    expect(after).toBeCloseTo(before * 2, 6);
  });

  it('stops at the zoom limits', () => {
    expect(zoomAt(INITIAL_VIEW, 100, 50, 50).scale).toBe(MAX_SCALE);
    expect(zoomAt(INITIAL_VIEW, 0.01, 50, 50).scale).toBe(MIN_SCALE);
  });

  it('returns to the untouched view when zoomed all the way back out', () => {
    const zoomed = zoomAt(INITIAL_VIEW, 4, 10, 90);
    const restored = zoomAt(zoomed, 1 / 4, 10, 90);

    expect(isDefaultView(restored)).toBe(true);
  });
});

describe('panBy', () => {
  it('does not move a plane that is not zoomed in', () => {
    expect(panBy(INITIAL_VIEW, 20, -30)).toEqual(INITIAL_VIEW);
  });

  it('moves within the zoomed content', () => {
    const zoomed = zoomAt(INITIAL_VIEW, 2, 50, 50);
    const panned = panBy(zoomed, 10, 10);

    expect(panned.x).toBeGreaterThan(zoomed.x);
    expect(panned.y).toBeGreaterThan(zoomed.y);
  });

  it('never leaves empty space at the edges', () => {
    const zoomed = zoomAt(INITIAL_VIEW, 2, 50, 50);

    expect(panBy(zoomed, 500, 500)).toMatchObject({ x: 0, y: 0 });
    expect(panBy(zoomed, -500, -500)).toMatchObject({ x: -100, y: -100 });
  });
});

describe('clampView', () => {
  it('keeps the scale and offsets inside their bounds', () => {
    expect(clampView({ scale: 99, x: 40, y: -900 })).toEqual({
      scale: MAX_SCALE,
      x: 0,
      y: -(MAX_SCALE - 1) * 100,
    });
  });
});
