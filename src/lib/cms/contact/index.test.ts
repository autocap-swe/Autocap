/**
 * Contact wrapper tests — `getContactContent` (v2: no fallback).
 *
 * Covers Autocap/docs/specs/cms-integration.md ACs 002, 007.
 */

import { getContactContent } from './index';
import type { CmsContactPage } from './types';
import { mockCmsContactPageFull } from '../__mocks__/contact-page';

jest.mock('../client');
import { getContent } from '../client';
const mockedGetContent = getContent as jest.MockedFunction<typeof getContent>;

beforeEach(() => {
  mockedGetContent.mockReset();
});

describe('getContactContent — wires generic client (AC-002)', () => {
  it('calls getContent with the contact-page slug + mapper, no fallback', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) => {
      // The mapper must be present and a function. Invoke it on our fixture
      // to verify the wrapper passes the right callback.
      return options!.mapper!(mockCmsContactPageFull as CmsContactPage);
    });

    await getContactContent();

    expect(mockedGetContent).toHaveBeenCalledTimes(1);
    const [slug, options] = mockedGetContent.mock.calls[0];
    expect(slug).toBe('contact-page');
    expect(options).toEqual({
      mapper: expect.any(Function),
    });
    // explicitly assert no fallback in the options object
    expect(options).not.toHaveProperty('fallback');
  });
});

describe('getContactContent — full payload mapping', () => {
  it('returns ContactContent with every field from the CMS', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!(mockCmsContactPageFull as CmsContactPage)
    );

    const result = await getContactContent();

    expect(result.hero.title).toBe(mockCmsContactPageFull.heroTitle);
    expect(result.hero.description).toBe(mockCmsContactPageFull.heroDescription);
    expect(result.routing.text).toBe(mockCmsContactPageFull.routingText);
    expect(result.companyInfo.email).toBe(mockCmsContactPageFull.companyEmail);
    expect(result.companyInfo.address).toBe(mockCmsContactPageFull.companyAddress);
    expect(result.formLabels.nameLabel).toBe(mockCmsContactPageFull.nameLabel);
    expect(result.formLabels.submitButtonText).toBe(mockCmsContactPageFull.submitButtonText);
    expect(result.specializedCards).toHaveLength(2);
  });
});

describe('getContactContent — empty payload (AC-007)', () => {
  it('does not throw when CMS fields are blank strings', async () => {
    const blank: CmsContactPage = {
      heroTitle: '',
      heroDescription: '',
      routingText: '',
      generalInquiryTitle: '',
      successMessage: '',
      companyEmail: '',
      companyAddress: '',
      nameLabel: '',
      namePlaceholder: '',
      emailLabel: '',
      emailPlaceholder: '',
      subjectLabel: '',
      subjectPlaceholder: '',
      messageLabel: '',
      messagePlaceholder: '',
      gdprConsentText: '',
      submitButtonText: '',
    };
    mockedGetContent.mockImplementation(async (_slug, options) => options!.mapper!(blank));

    await expect(getContactContent()).resolves.toMatchObject({
      hero: { title: '', description: '' },
      formLabels: { nameLabel: '' },
    });
  });
});

describe('getContactContent — propagates client errors', () => {
  it('rethrows CmsUnavailableError from the client', async () => {
    mockedGetContent.mockRejectedValue(new Error('CMS down'));
    await expect(getContactContent()).rejects.toThrow('CMS down');
  });
});
