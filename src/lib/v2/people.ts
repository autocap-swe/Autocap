/**
 * People shown on v2 pages who are not yet entered in the CMS, and contact details the CMS
 * does not hold yet. Replace with CMS data when the entries exist; CMS values always win.
 */

/** Board members missing from the CMS. Karl Ehn: board per INDEX; bio kept general by decision. */
export const BOARD_FALLBACK: { name: string; bioKey: 'karlBio' }[] = [{ name: 'Karl Ehn', bioKey: 'karlBio' }];

/** Contact e-mail for CEO, CFO and Head of M&A until the CMS e-mail field is filled in. */
export const EMAIL_FALLBACK: Record<string, string> = {
  'David Knape': 'david.knape@autocapgroup.se',
  'Niklas Norén': 'niklas.noren@autocapgroup.se',
  'Nicklas Knape': 'nicklas.knape@autocapgroup.se',
};

/** Colour portraits on the dark backdrop (decision 2026-11-06), keyed by name. */
export const PORTRAIT_FALLBACK: Record<string, string> = {
  'David Knape': '/images/team/david-v2.jpg',
  'Niklas Norén': '/images/team/niklas-v2.jpg',
  'Nicklas Knape': '/images/team/nicklas-v2.jpg',
  'Magnus Stenblock': '/images/team/magnus-v2.jpg',
  'Jolanta Kelly': '/images/team/jolanta-v2.jpg',
};
