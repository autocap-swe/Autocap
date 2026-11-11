/**
 * Base address of the CMS. Production always has CMS_API_URL set; if it is ever missing the
 * site falls back to the public CMS instead of a developer machine.
 */
const FALLBACK = process.env.NODE_ENV === 'production' ? 'https://cms.autocapgroup.se' : 'http://localhost:1337';

export function cmsBaseUrl(): string {
  return (process.env.CMS_API_URL || FALLBACK).replace(/\/$/, '');
}
