function track(event: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined' || typeof window.gtag === 'undefined') return;
  window.gtag('event', event, params ?? {});
}

export function trackCtaClick(ctaText: string, destination: string) {
  track('cta_click', { cta_text: ctaText, destination });
}

export function trackFormSubmit(formName: 'general' | 'entrepreneur' | 'investor') {
  track('form_submit', { form_name: formName });
}

export function trackLanguageSwitch(fromLocale: string, toLocale: string) {
  track('language_switch', { from_locale: fromLocale, to_locale: toLocale });
}

export function trackMapMarkerClick(workshopName: string, workshopSlug: string) {
  track('map_marker_click', { workshop_name: workshopName, workshop_slug: workshopSlug });
}

export function trackAssetDownload(assetName: string, assetFormat: string) {
  track('asset_download', { asset_name: assetName, asset_format: assetFormat });
}
