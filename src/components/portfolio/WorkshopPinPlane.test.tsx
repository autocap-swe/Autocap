import { render, screen, fireEvent } from '@testing-library/react';
import type { Workshop } from '@/lib/cms/workshop/types';
import { WorkshopPinPlane } from './WorkshopPinPlane';

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

function openPopup(container: HTMLElement) {
  return container.querySelector('.z-10') as HTMLElement | null;
}

describe('WorkshopPinPlane', () => {
  it('renders one pin per coordinate, badging the shared one', () => {
    const { container } = render(<WorkshopPinPlane workshops={[...molndalTrio, bromma]} />);

    expect(container.querySelectorAll('.workshop-marker')).toHaveLength(2);

    const badges = container.querySelectorAll('.workshop-marker-badge');
    expect(badges).toHaveLength(1);
    expect(badges[0].textContent).toBe('3');
  });

  it('places pins inside the plane, padded away from the edges', () => {
    const { container } = render(<WorkshopPinPlane workshops={[...molndalTrio, bromma]} />);

    const slots = Array.from(container.querySelectorAll<HTMLElement>('.marker-slot'));
    expect(slots).toHaveLength(2);

    slots.forEach(slot => {
      const left = parseFloat(slot.style.left);
      const top = parseFloat(slot.style.top);
      expect(left).toBeGreaterThan(0);
      expect(left).toBeLessThan(100);
      expect(top).toBeGreaterThan(0);
      expect(top).toBeLessThan(100);
    });
  });

  it('opens a grouped popup anchored to its pin and closes it again', () => {
    const { container } = render(<WorkshopPinPlane workshops={molndalTrio} />);
    const pin = container.querySelector('.workshop-marker')!;

    fireEvent.click(pin);
    const popup = openPopup(container)!;
    expect(popup.textContent).toContain('3 workshops at this location');
    expect(popup.style.left).toMatch(/px$/);

    fireEvent.click(pin);
    expect(openPopup(container)).toBeNull();

    fireEvent.click(pin);
    fireEvent.click(document.body);
    expect(openPopup(container)).toBeNull();

    fireEvent.click(pin);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(openPopup(container)).toBeNull();
  });

  it('anchors the popup above and beside a pin near the bottom-left corner', () => {
    // jsdom reports every box as 0×0, so feed the component real dimensions.
    // Mölndal is the southernmost workshop, so its pin sits near the bottom of
    // the plane where a popup below would overflow but one above fits.
    const sizes = { clientWidth: 800, clientHeight: 600, offsetWidth: 240, offsetHeight: 180 };
    const originals = Object.keys(sizes).map(prop => [
      prop,
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop),
    ]) as [string, PropertyDescriptor | undefined][];

    Object.entries(sizes).forEach(([prop, value]) => {
      Object.defineProperty(HTMLElement.prototype, prop, {
        configurable: true,
        get: () => value,
      });
    });

    try {
      const { container } = render(<WorkshopPinPlane workshops={[...molndalTrio, bromma]} />);
      fireEvent.click(container.querySelector('.workshop-marker-badge')!.parentElement!);

      const popup = openPopup(container)!;
      // Mölndal is both the southernmost and the westernmost pin, so the popup
      // flips above it and is pulled right so it does not cross the left edge.
      expect(popup.dataset.anchor).toBe('bottom-left');
      expect(popup.style.transform).toBe('translateX(-22px) translateY(calc(-100% - 25px))');
      expect(parseFloat(popup.style.top)).toBeGreaterThan(400);
      expect(parseFloat(popup.style.left)).toBeLessThan(120);
    } finally {
      originals.forEach(([prop, descriptor]) => {
        if (descriptor) Object.defineProperty(HTMLElement.prototype, prop, descriptor);
      });
    }
  });

  it('handles a single workshop without collapsing the projection', () => {
    const { container } = render(<WorkshopPinPlane workshops={[bromma]} />);

    const slot = container.querySelector<HTMLElement>('.marker-slot')!;
    expect(parseFloat(slot.style.left)).toBeCloseTo(50, 5);
    expect(parseFloat(slot.style.top)).toBeCloseTo(50, 5);
  });

  it('spreads the pins apart when zoomed in, without resizing them', () => {
    const { container } = render(<WorkshopPinPlane workshops={[...molndalTrio, bromma]} />);

    const positions = () =>
      Array.from(container.querySelectorAll<HTMLElement>('.marker-slot')).map(slot =>
        parseFloat(slot.style.left)
      );

    const [beforeA, beforeB] = positions();
    const markerSize = (container.querySelector('.workshop-marker') as HTMLElement).style.width;

    fireEvent.click(screen.getByLabelText('Zoom in'));

    const [afterA, afterB] = positions();
    expect(Math.abs(afterA - afterB)).toBeGreaterThan(Math.abs(beforeA - beforeB));
    // Pins keep their size — only their positions scale, as on a real map
    expect((container.querySelector('.workshop-marker') as HTMLElement).style.width).toBe(
      markerSize
    );
  });

  it('offers a reset once the view has moved, and hides it again', () => {
    render(<WorkshopPinPlane workshops={[...molndalTrio, bromma]} />);

    expect(screen.queryByText('Reset view')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Zoom in'));
    expect(screen.getByText('Reset view')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Reset view'));
    expect(screen.queryByText('Reset view')).not.toBeInTheDocument();
  });

  it('disables zoom out at the starting view', () => {
    render(<WorkshopPinPlane workshops={[...molndalTrio, bromma]} />);

    expect(screen.getByLabelText('Zoom out')).toBeDisabled();
    fireEvent.click(screen.getByLabelText('Zoom in'));
    expect(screen.getByLabelText('Zoom out')).toBeEnabled();
  });

  it('renders nothing but the notice for an empty workshop list', () => {
    const { container } = render(<WorkshopPinPlane workshops={[]} />);

    expect(container.querySelectorAll('.workshop-marker')).toHaveLength(0);
    expect(screen.getByTestId('workshop-pin-plane')).toBeInTheDocument();
  });
});
