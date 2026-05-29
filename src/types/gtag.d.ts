declare function gtag(
  command: 'config' | 'event' | 'js' | 'set',
  target: string | Date,
  params?: Record<string, string | number | boolean>
): void;

interface Window {
  gtag: typeof gtag;
  dataLayer: unknown[];
}
