import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsCookiePolicy, CookiePolicy } from './types';
import { cookiePolicyMapper } from './mapper';

export async function getCookiePolicyContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<CookiePolicy> {
  const options = {
    revalidate,
    tags: ['cookie-policy'],
    params: { populate: 'sections,seo' },
    mapper: cookiePolicyMapper,
  };

  const result = await getContent<CmsCookiePolicy, CookiePolicy>('cookie-policy', {
    ...options,
    locale,
  });

  if (!result && locale && locale !== 'en') {
    return getContent<CmsCookiePolicy, CookiePolicy>('cookie-policy', {
      ...options,
      locale: 'en',
    });
  }

  return result;
}
