import type { HeroImageFocus } from '@/lib/cms/article/types';

// Full class names so Tailwind keeps them (no dynamic string building)
const FOCUS_CLASS: Record<HeroImageFocus, string> = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
  left: 'object-left',
  right: 'object-right',
  'top-left': 'object-left-top',
  'top-right': 'object-right-top',
  'bottom-left': 'object-left-bottom',
  'bottom-right': 'object-right-bottom',
};

/** Tailwind object-position class for the editor's chosen hero image focus. */
export function imageFocusClass(focus?: HeroImageFocus): string {
  return FOCUS_CLASS[focus ?? 'center'];
}
