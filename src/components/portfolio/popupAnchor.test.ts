import { anchorStyle, resolvePopupAnchor, tipStyle, POPUP_OFFSET } from './popupAnchor';

const PLANE = { planeWidth: 800, planeHeight: 600 };
const POPUP = { popupWidth: 240, popupHeight: 180 };

describe('resolvePopupAnchor', () => {
  it('puts the popup below a pin that has room beneath it', () => {
    const anchor = resolvePopupAnchor({ pinX: 400, pinY: 100, ...PLANE, ...POPUP });
    expect(anchor).toEqual({ vertical: 'top', horizontal: 'center' });
  });

  it('flips above when the popup would overflow the bottom edge', () => {
    const anchor = resolvePopupAnchor({ pinX: 400, pinY: 500, ...PLANE, ...POPUP });
    expect(anchor.vertical).toBe('bottom');
  });

  it('stays below when it fits neither way', () => {
    const anchor = resolvePopupAnchor({
      pinX: 400,
      pinY: 150,
      planeWidth: 800,
      planeHeight: 200,
      popupWidth: 240,
      popupHeight: 180,
    });
    expect(anchor.vertical).toBe('top');
  });

  it('uses the exact fit boundary', () => {
    const justFits = resolvePopupAnchor({
      pinX: 400,
      pinY: 600 - POPUP_OFFSET - 180,
      ...PLANE,
      ...POPUP,
    });
    expect(justFits.vertical).toBe('top');

    const oneShort = resolvePopupAnchor({
      pinX: 400,
      pinY: 600 - POPUP_OFFSET - 180 + 1,
      ...PLANE,
      ...POPUP,
    });
    expect(oneShort.vertical).toBe('bottom');
  });

  it('pulls the popup right when centring would cross the left edge', () => {
    const anchor = resolvePopupAnchor({ pinX: 40, pinY: 100, ...PLANE, ...POPUP });
    expect(anchor.horizontal).toBe('left');
  });

  it('pulls the popup left when centring would cross the right edge', () => {
    const anchor = resolvePopupAnchor({ pinX: 760, pinY: 100, ...PLANE, ...POPUP });
    expect(anchor.horizontal).toBe('right');
  });

  it('centres a pin with room on both sides', () => {
    expect(resolvePopupAnchor({ pinX: 120, pinY: 100, ...PLANE, ...POPUP }).horizontal).toBe(
      'center'
    );
  });
});

describe('anchorStyle', () => {
  it('positions at the pin and offsets downwards when anchored below', () => {
    const style = anchorStyle(120, 240, { vertical: 'top', horizontal: 'center' });
    expect(style.left).toBe('120px');
    expect(style.top).toBe('240px');
    expect(style.transform).toBe('translateX(-50%) translateY(25px)');
  });

  it('offsets upwards past its own height when anchored above', () => {
    const style = anchorStyle(120, 240, { vertical: 'bottom', horizontal: 'center' });
    expect(style.transform).toBe('translateX(-50%) translateY(calc(-100% - 25px))');
  });

  it('aligns to the pin side when edge-anchored', () => {
    expect(anchorStyle(0, 0, { vertical: 'top', horizontal: 'left' }).transform).toContain(
      'translateX(-22px)'
    );
    expect(anchorStyle(0, 0, { vertical: 'top', horizontal: 'right' }).transform).toContain(
      'translateX(calc(-100% + 22px))'
    );
  });
});

describe('tipStyle', () => {
  it('sits on the popup edge nearest the pin', () => {
    expect(tipStyle({ vertical: 'top', horizontal: 'center' })).toMatchObject({ top: -5 });
    expect(tipStyle({ vertical: 'bottom', horizontal: 'center' })).toMatchObject({ bottom: -5 });
  });

  it('tracks the pin horizontally on every anchor', () => {
    expect(tipStyle({ vertical: 'top', horizontal: 'center' })).toMatchObject({ left: '50%' });
    expect(tipStyle({ vertical: 'top', horizontal: 'left' })).toMatchObject({ left: 22 });
    expect(tipStyle({ vertical: 'top', horizontal: 'right' })).toMatchObject({ right: 22 });
  });
});
