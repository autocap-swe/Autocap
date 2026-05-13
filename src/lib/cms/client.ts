/**
 * Strapi CMS Client
 *
 * Single content-fetching entry point. Handles fetch + ISR + shape adaptation.
 * On any failure, throws CmsUnavailableError. Next.js ISR keeps the previously
 * cached HTML serving on revalidation failures, so users do not see thrown
 * errors for already-cached pages.
 *
 * See `Autocap/docs/specs/cms-integration.md` (v2).
 */

const CMS_API_URL = process.env.CMS_API_URL || 'http://localhost:1337';

interface StrapiResponse<T> {
  data: T | null;
  meta?: Record<string, unknown>;
  error?: {
    status: number;
    name: string;
    message: string;
  };
}

export interface GetContentOptions<TCms, TFinal> {
  /** Next.js revalidation interval in seconds. Defaults to 60. */
  revalidate?: number | false;
  /** Additional query params (e.g. populate, filters). */
  params?: Record<string, string>;
  /** Optional shape adapter mapping the raw CMS payload to the page shape. */
  mapper?: (cms: TCms) => TFinal;
  /** Strapi i18n locale. Defaults to 'en'. */
  locale?: string;
  /** Next.js cache tags for on-demand revalidation via revalidateTag(). */
  tags?: string[];
}

/** Thrown when the CMS request fails or returns no usable data. */
export class CmsUnavailableError extends Error {
  readonly slug: string;
  readonly status?: number;

  constructor(slug: string, message: string, status?: number) {
    super(`[CMS] ${slug}: ${message}`);
    this.name = 'CmsUnavailableError';
    this.slug = slug;
    this.status = status;
  }
}

function unavailable(slug: string, message: string, status?: number): CmsUnavailableError {
  console.warn(`[CMS] ${slug}: ${message}`);
  return new CmsUnavailableError(slug, message, status);
}

/**
 * Fetch a Strapi single-type or collection and return the page-shaped payload.
 *
 * @param slug    Strapi API path without leading slash, e.g. "contact-page".
 * @param options revalidate / params / mapper.
 */
export async function getContent<TCms, TFinal = TCms>(
  slug: string,
  options: GetContentOptions<TCms, TFinal> = {}
): Promise<TFinal> {
  const { revalidate = 60, params, mapper, locale, tags } = options;

  const url = new URL(`/api/${slug}`, CMS_API_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  if (locale !== undefined) url.searchParams.set('locale', locale);

  let res: Response;
  try {
    const nextOptions =
      revalidate === false
        ? { revalidate: false as const, ...(tags ? { tags } : {}) }
        : { revalidate, ...(tags ? { tags } : {}) };
    res = await fetch(url.toString(), {
      next: nextOptions,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    throw unavailable(slug, (err as Error).message);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '(unreadable)');
    console.warn(`[CMS] ${slug}: response body →`, body);
    throw unavailable(slug, `HTTP ${res.status}`, res.status);
  }

  let json: StrapiResponse<TCms>;
  try {
    json = (await res.json()) as StrapiResponse<TCms>;
  } catch (err) {
    throw unavailable(slug, `Invalid JSON: ${(err as Error).message}`);
  }

  if (json.error) {
    throw unavailable(slug, json.error.message, json.error.status);
  }
  if (json.data === null) {
    throw unavailable(slug, 'Strapi returned data: null (entry not published?)');
  }

  if (mapper) {
    return mapper(json.data as TCms);
  }
  return json.data as unknown as TFinal;
}
