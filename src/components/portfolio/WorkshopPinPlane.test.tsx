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
    expect(popup.style.left).toMatch(/%$/);

    fireEvent.click(pin);
    expect(openPopup(container)).toBeNull();

    fireEvent.click(pin);
    fireEvent.click(document.body);
    expect(openPopup(container)).toBeNull();

    fireEvent.click(pin);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(openPopup(container)).toBeNull();
  });

  it('handles a single workshop without collapsing the projection', () => {
    const { container } = render(<WorkshopPinPlane workshops={[bromma]} />);

    const slot = container.querySelector<HTMLElement>('.marker-slot')!;
    expect(parseFloat(slot.style.left)).toBeCloseTo(50, 5);
    expect(parseFloat(slot.style.top)).toBeCloseTo(50, 5);
  });

  it('renders nothing but the notice for an empty workshop list', () => {
    const { container } = render(<WorkshopPinPlane workshops={[]} />);

    expect(container.querySelectorAll('.workshop-marker')).toHaveLength(0);
    expect(screen.getByTestId('workshop-pin-plane')).toBeInTheDocument();
  });
});
