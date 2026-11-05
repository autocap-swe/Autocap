/** Long date in the page language, e.g. "June 26, 2026" (en) or "26 juni 2026" (sv). */
export function formatLongDate(dateString: string, locale: string): string {
  return new Date(dateString).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
