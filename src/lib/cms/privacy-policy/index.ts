import { getContent } from '../client';
import { REVALIDATE_LOW } from '../revalidate';
import type { CmsPrivacyPolicy, PrivacyPolicy } from './types';
import { privacyPolicyMapper } from './mapper';

export async function getPrivacyPolicyContent(
  revalidate = REVALIDATE_LOW,
  locale?: string
): Promise<PrivacyPolicy> {
  const options = {
    revalidate,
    tags: ['privacy-policy'],
    params: { populate: 'sections,seo' },
    mapper: privacyPolicyMapper,
  };

  const result = await getContent<CmsPrivacyPolicy, PrivacyPolicy>('privacy-policy', {
    ...options,
    locale,
  });

  if (!result && locale && locale !== 'en') {
    return getContent<CmsPrivacyPolicy, PrivacyPolicy>('privacy-policy', {
      ...options,
      locale: 'en',
    });
  }

  return result;
}
