import { imageFocusClass } from './image-focus';

describe('imageFocusClass', () => {
  it('maps the editor focus to an object-position class', () => {
    expect(imageFocusClass('right')).toBe('object-right');
    expect(imageFocusClass('top-left')).toBe('object-left-top');
  });

  it('centres the image when no focus is set', () => {
    expect(imageFocusClass(undefined)).toBe('object-center');
  });
});
