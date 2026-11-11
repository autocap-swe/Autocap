import type { Workshop } from '@/lib/cms/workshop/types';
import { workshopJsonLd } from './workshop-json-ld';

const workshop: Workshop = {
  id: 1,
  name: 'Däckgruppen Bromma',
  slug: 'dackgruppen-bromma',
  city: 'Bromma',
  region: 'Stockholm',
  latitude: 59.34,
  longitude: 17.94,
  status: 'acquired',
  yearAcquired: 2026,
  localWebsite: 'https://dackgruppen.se',
  description: 'Tire service in Bromma.',
};

describe('workshopJsonLd', () => {
  const url = 'https://autocapgroup.se/portfolio/dackgruppen-bromma';

  it('describes the workshop as a tire shop owned by the group', () => {
    const data = workshopJsonLd(workshop, url);
    expect(data['@type']).toBe('TireShop');
    expect(data.name).toBe('Däckgruppen Bromma');
    expect(data.url).toBe('https://dackgruppen.se');
    expect(data.parentOrganization).toEqual({ '@id': 'https://autocapgroup.se/#organization' });
    expect(data.geo).toEqual({ '@type': 'GeoCoordinates', latitude: 59.34, longitude: 17.94 });
  });

  it('leaves out facts the CMS does not hold', () => {
    const data = workshopJsonLd({ ...workshop, localWebsite: '', latitude: NaN }, url);
    expect(data.url).toBe(url);
    expect(data).not.toHaveProperty('geo');
    expect(data).not.toHaveProperty('telephone');
    expect(data).not.toHaveProperty('foundingDate');
    expect((data.address as Record<string, unknown>).streetAddress).toBeUndefined();
  });
});
