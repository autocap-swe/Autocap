/**
 * Contact Page — CMS wrapper.
 *
 * The page calls `getContactContent()`. This file is the only place that
 * knows the slug `contact-page`, the CMS shape, and the mapping back to
 * `ContactContent`. Adding a new CMS-driven page means copying this folder.
 */

import { getContent } from '../client';
import { REVALIDATE_HIGH } from '../revalidate';
import type { CmsContactPage, ContactContent } from './types';
import { contactMapper } from './mapper';

export async function getContactContent(
  revalidate = REVALIDATE_HIGH,
  locale?: string
): Promise<ContactContent> {
  return getContent<CmsContactPage, ContactContent>('contact-page', {
    revalidate,
    mapper: contactMapper,
    locale,
    tags: ['contact-page'],
  });
}
