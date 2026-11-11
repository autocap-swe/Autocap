/** "Nov 2026" / "nov. 2026" for news rows. */
export function formatMonthYear(dateString: string, locale: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'sv' ? 'sv-SE' : 'en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Stockholm',
  }).format(date);
}
