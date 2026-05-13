import { getWorkshopsContent, getWorkshopBySlugContent } from './index';
import type { CmsWorkshop } from './types';

jest.mock('../client');
import { getContent } from '../client';
const mockedGetContent = getContent as jest.MockedFunction<typeof getContent>;

const mockCmsWorkshop: CmsWorkshop = {
  id: 1,
  documentId: 'abc123',
  name: 'Däckpoint i Mölndal',
  slug: 'dackpoint-molndal',
  city: 'Mölndal',
  region: 'Västra Götaland',
  latitude: 57.6557,
  longitude: 12.0138,
  acquisitionStatus: 'acquired',
  yearAcquired: 2025,
  localWebsite: 'https://dackpoint.se',
  description: 'Full-service tire workshop.',
};

beforeEach(() => mockedGetContent.mockReset());

describe('getWorkshopsContent', () => {
  it('calls getContent with workshops slug and pageSize 100', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([mockCmsWorkshop] as CmsWorkshop[])
    );

    const result = await getWorkshopsContent();

    const [slug, options] = mockedGetContent.mock.calls[0];
    expect(slug).toBe('workshops');
    expect(options?.params?.['pagination[pageSize]']).toBe('100');
    expect(result[0].status).toBe('acquired');
    expect(result[0].name).toBe(mockCmsWorkshop.name);
  });

  it('maps acquisitionStatus to status', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([{ ...mockCmsWorkshop, acquisitionStatus: 'pending' }] as CmsWorkshop[])
    );

    const result = await getWorkshopsContent();
    expect(result[0].status).toBe('pending');
  });
});

describe('getWorkshopBySlugContent', () => {
  it('returns the first matching workshop', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([mockCmsWorkshop] as CmsWorkshop[])
    );

    const result = await getWorkshopBySlugContent('dackpoint-molndal');
    expect(result?.slug).toBe('dackpoint-molndal');
  });

  it('returns null when no workshop found', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([] as CmsWorkshop[])
    );

    const result = await getWorkshopBySlugContent('nonexistent');
    expect(result).toBeNull();
  });

  it('passes slug filter param', async () => {
    mockedGetContent.mockImplementation(async (_slug, options) =>
      options!.mapper!([mockCmsWorkshop] as CmsWorkshop[])
    );

    await getWorkshopBySlugContent('dackpoint-molndal');
    const [, options] = mockedGetContent.mock.calls[0];
    expect(options?.params?.['filters[slug][$eq]']).toBe('dackpoint-molndal');
  });
});
