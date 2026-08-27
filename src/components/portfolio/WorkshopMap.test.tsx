import { act, render, screen } from '@testing-library/react';
import type { Workshop } from '@/lib/cms/workshop/types';

interface MockPopup {
  html: string;
  open(): HTMLElement;
}

interface MarkerRecord {
  element: HTMLElement;
  lngLat?: [number, number];
  popupHtml?: string;
  popup?: MockPopup;
}

const markers: MarkerRecord[] = [];
const mapInstances: { removed: boolean }[] = [];

jest.mock('mapbox-gl', () => {
  class Popup {
    html = '';
    element: HTMLElement | null = null;
    handlers: Record<string, () => void> = {};

    setHTML(html: string) {
      this.html = html;
      return this;
    }

    on(event: string, handler: () => void) {
      this.handlers[event] = handler;
      return this;
    }

    getElement() {
      if (!this.element) {
        this.element = document.createElement('div');
        this.element.innerHTML = this.html;
      }
      return this.element;
    }

    /** Test helper — mirrors Mapbox opening the popup on marker click. */
    open() {
      this.handlers.open?.();
      return this.getElement();
    }
  }

  class Marker {
    record: MarkerRecord;
    popup?: Popup;

    constructor(element: HTMLElement) {
      this.record = { element };
      markers.push(this.record);
    }

    setLngLat(lngLat: [number, number]) {
      this.record.lngLat = lngLat;
      return this;
    }

    setPopup(popup: Popup) {
      this.popup = popup;
      this.record.popupHtml = popup.html;
      this.record.popup = popup;
      return this;
    }

    addTo() {
      return this;
    }
  }

  class Map {
    instance = { removed: false };

    constructor() {
      mapInstances.push(this.instance);
    }

    on(event: string, handler: () => void) {
      if (event === 'load') handler();
      return this;
    }

    addControl() {
      return this;
    }

    remove() {
      this.instance.removed = true;
    }
  }

  return {
    __esModule: true,
    default: {
      accessToken: '',
      Map,
      Marker,
      Popup,
      NavigationControl: class {},
    },
  };
});

import { trackMapMarkerClick } from '@/lib/analytics';
import { WorkshopMap } from './WorkshopMap';

jest.mock('@/lib/analytics', () => ({
  trackMapMarkerClick: jest.fn(),
}));

const trackMock = trackMapMarkerClick as jest.MockedFunction<typeof trackMapMarkerClick>;

function makeWorkshop(overrides: Partial<Workshop> & { id: number }): Workshop {
  return {
    name: `Workshop ${overrides.id}`,
    slug: `workshop-${overrides.id}`,
    city: 'Mölndal',
    region: 'Västra Götaland',
    latitude: 57.6557,
    longitude: 12.0138,
    status: 'acquired',
    yearAcquired: 2026,
    localWebsite: 'https://example.se',
    description: 'Test workshop',
    ...overrides,
  };
}

const molndalTrio = [
  makeWorkshop({ id: 1, name: 'Däckpoint i Mölndal', slug: 'dackpoint-molndal' }),
  makeWorkshop({ id: 2, name: 'Mölndals Däckservice', slug: 'molndals-dackservice' }),
  makeWorkshop({ id: 3, name: 'Mölndals Bilverkstad', slug: 'molndals-bilverkstad' }),
];

const bromma = makeWorkshop({
  id: 4,
  name: 'Däckgruppen Bromma',
  slug: 'dackgruppen-bromma',
  city: 'Bromma',
  region: 'Stockholm',
  latitude: 59.3477,
  longitude: 17.9396,
});

/** The component defers map init behind a 100ms timeout. */
function flushMapInit() {
  act(() => {
    jest.advanceTimersByTime(150);
  });
}

describe('WorkshopMap', () => {
  const originalToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const originalVercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

  beforeEach(() => {
    jest.useFakeTimers();
    markers.length = 0;
    mapInstances.length = 0;
    trackMock.mockClear();
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN = 'test-token';
  });

  afterEach(() => {
    jest.useRealTimers();
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN = originalToken;
    process.env.NEXT_PUBLIC_VERCEL_ENV = originalVercelEnv;
  });

  // AC-002 / AC-004
  it('renders one marker per distinct coordinate with a count badge', () => {
    render(<WorkshopMap workshops={[...molndalTrio, bromma]} />);
    flushMapInit();

    expect(markers).toHaveLength(2);

    const badges = markers.map(
      marker => marker.element.querySelector('.workshop-marker-badge')?.textContent ?? null
    );
    expect(badges).toEqual(['3', null]);
  });

  // AC-003
  it('grouped popup renders a details link per workshop', () => {
    render(<WorkshopMap workshops={molndalTrio} />);
    flushMapInit();

    const html = markers[0].popupHtml ?? '';
    expect(html).toContain('3 workshops at this location');
    expect(html).toContain('Mölndal, Västra Götaland');
    molndalTrio.forEach(workshop => {
      expect(html).toContain(workshop.name);
      expect(html).toContain(`/portfolio/${workshop.slug}`);
    });
  });

  // AC-001
  it('renders a single-workshop popup without a count', () => {
    render(<WorkshopMap workshops={[bromma]} />);
    flushMapInit();

    const html = markers[0].popupHtml ?? '';
    expect(html).toContain('Däckgruppen Bromma');
    expect(html).toContain('Bromma, Stockholm');
    expect(html).not.toContain('workshops at this location');
    expect(markers[0].element.querySelector('.workshop-marker-badge')).toBeNull();
    expect(markers[0].lngLat).toEqual([bromma.longitude, bromma.latitude]);
  });

  it('gives each workshop a single line, with the name as the link', () => {
    render(<WorkshopMap workshops={molndalTrio} />);
    flushMapInit();

    const html = markers[0].popupHtml ?? '';
    // No separate "View details" row per entry — that doubled the popup height
    expect(html).not.toContain('View details');
    molndalTrio.forEach(workshop => {
      expect(html).toContain(`>${workshop.name}</a>`);
    });
  });

  it('trims stray whitespace out of the location heading', () => {
    render(
      <WorkshopMap
        workshops={[
          makeWorkshop({ id: 7, city: 'Mölndal ', region: ' Västra Götaland' }),
          makeWorkshop({ id: 8, city: 'Mölndal ', region: ' Västra Götaland' }),
        ]}
      />
    );
    flushMapInit();

    const html = markers[0].popupHtml ?? '';
    expect(html).toContain('Mölndal, Västra Götaland');
    expect(html).not.toContain('Mölndal ,');
  });

  // AC-007
  it('escapes HTML characters in popup content', () => {
    render(
      <WorkshopMap
        workshops={[makeWorkshop({ id: 9, name: 'Däck & Co <script>alert(1)</script>' })]}
      />
    );
    flushMapInit();

    const html = markers[0].popupHtml ?? '';
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('Däck &amp; Co');
  });

  // AC-008
  it('marker element is focusable and exposes an accessible label', () => {
    render(<WorkshopMap workshops={[...molndalTrio, bromma]} />);
    flushMapInit();

    const [grouped, single] = markers;
    expect(grouped.element).toHaveAttribute('role', 'button');
    expect(grouped.element.tabIndex).toBe(0);
    expect(grouped.element).toHaveAttribute(
      'aria-label',
      '3 workshops at Mölndal, Västra Götaland'
    );
    expect(single.element).toHaveAttribute('aria-label', 'Däckgruppen Bromma, Bromma');
  });

  it('opens the popup when Enter is pressed on a marker', () => {
    render(<WorkshopMap workshops={[bromma]} />);
    flushMapInit();

    const element = markers[0].element;
    const click = jest.fn();
    element.addEventListener('click', click);

    act(() => {
      element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });

    expect(click).toHaveBeenCalled();
  });

  // AC-009
  it('reinitialises the map when workshops change', () => {
    const { rerender } = render(<WorkshopMap workshops={molndalTrio} />);
    flushMapInit();

    expect(mapInstances).toHaveLength(1);
    expect(markers).toHaveLength(1);

    rerender(<WorkshopMap workshops={[bromma]} />);
    flushMapInit();

    expect(mapInstances[0].removed).toBe(true);
    expect(mapInstances).toHaveLength(2);
    expect(markers[markers.length - 1].lngLat).toEqual([bromma.longitude, bromma.latitude]);
  });

  it('tracks a marker click for a single-workshop marker', () => {
    render(<WorkshopMap workshops={[bromma]} />);
    flushMapInit();

    act(() => {
      markers[0].element.click();
    });

    expect(trackMock).toHaveBeenCalledWith('Däckgruppen Bromma', 'dackgruppen-bromma');
  });

  it('tracks the workshop whose link is clicked inside a grouped popup', () => {
    render(<WorkshopMap workshops={molndalTrio} />);
    flushMapInit();

    act(() => {
      markers[0].element.click();
    });
    expect(trackMock).not.toHaveBeenCalled();

    const popupEl = markers[0].popup!.open();
    const link = popupEl.querySelector<HTMLAnchorElement>(
      'a[data-workshop-slug="molndals-dackservice"]'
    );

    act(() => {
      link!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(trackMock).toHaveBeenCalledWith('Mölndals Däckservice', 'molndals-dackservice');
  });

  it('falls back to the pin plane when the map cannot load outside production', () => {
    delete process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    const { container } = render(<WorkshopMap workshops={molndalTrio} />);
    flushMapInit();

    expect(screen.getByTestId('workshop-pin-plane')).toBeInTheDocument();
    expect(container.querySelector('.workshop-marker-badge')?.textContent).toBe('3');
    expect(screen.queryByText(/having trouble loading the map/)).not.toBeInTheDocument();
  });

  it('keeps the plain error message in production', () => {
    delete process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    process.env.NEXT_PUBLIC_VERCEL_ENV = 'production';

    render(<WorkshopMap workshops={molndalTrio} />);
    flushMapInit();

    expect(screen.getByText(/having trouble loading the map/)).toBeInTheDocument();
    expect(screen.queryByTestId('workshop-pin-plane')).not.toBeInTheDocument();
  });

  // AC-006
  it('renders no markers for an empty workshop list', () => {
    render(<WorkshopMap workshops={[]} />);
    flushMapInit();

    expect(mapInstances).toHaveLength(1);
    expect(markers).toHaveLength(0);
  });
});
