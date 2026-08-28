import { trackMapMarkerClick } from '@/lib/analytics';
import type { WorkshopLocationGroup } from './groupWorkshopsByCoordinate';

/**
 * Marker and popup markup for the portfolio map.
 *
 * Kept apart from WorkshopMap so the tile-less fallback renders exactly the
 * same pins and popups as the map itself, rather than a lookalike copy.
 */

const BRAND_RED = '#C8102E';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildPopupHtml(group: WorkshopLocationGroup): string {
  const [first] = group.workshops;
  // CMS values occasionally carry stray whitespace, e.g. "Mölndal , Västra Götaland".
  const location = escapeHtml([first.city, first.region].map(part => part.trim()).join(', '));

  if (group.workshops.length === 1) {
    return `
      <div style="padding: 8px;">
        <h3 style="font-weight: 600; margin-bottom: 4px; color: #1C1C1E;">${escapeHtml(first.name)}</h3>
        <p style="color: #666; margin-bottom: 8px; font-size: 14px;">${location}</p>
        <a href="/portfolio/${encodeURIComponent(first.slug)}" style="color: ${BRAND_RED}; font-weight: 500; font-size: 14px;">View details</a>
      </div>
    `;
  }

  // One line per workshop — the name is the link. Two-line entries made a
  // three-workshop popup tall enough that Mapbox flipped it far above the pin.
  const entries = group.workshops
    .map(
      workshop => `
        <li style="border-top: 1px solid #E5E5E5;">
          <a href="/portfolio/${encodeURIComponent(workshop.slug)}" data-workshop-name="${escapeHtml(workshop.name)}" data-workshop-slug="${escapeHtml(workshop.slug)}" style="display: block; padding: 7px 0; color: ${BRAND_RED}; font-weight: 600; font-size: 14px; line-height: 1.3;">${escapeHtml(workshop.name)}</a>
        </li>
      `
    )
    .join('');

  return `
    <div style="padding: 8px; max-width: 240px;">
      <h3 style="font-weight: 600; margin-bottom: 2px; color: #1C1C1E;">${location}</h3>
      <p style="color: #666; font-size: 13px;">${group.workshops.length} workshops at this location</p>
      <ul style="list-style: none; margin: 4px 0 0; padding: 0; max-height: 176px; overflow-y: auto;">${entries}</ul>
    </div>
  `;
}

export function buildMarkerElement(group: WorkshopLocationGroup): HTMLDivElement {
  const count = group.workshops.length;
  const isGrouped = count > 1;
  const [first] = group.workshops;
  const size = isGrouped ? 28 : 24;

  const el = document.createElement('div');
  el.className = 'workshop-marker';
  el.setAttribute('role', 'button');
  el.tabIndex = 0;
  el.setAttribute(
    'aria-label',
    isGrouped
      ? `${count} workshops at ${first.city}, ${first.region}`
      : `${first.name}, ${first.city}`
  );
  // No inline `position`. Mapbox positions its markers with
  // `.mapboxgl-marker { position: absolute }`, and an inline value would beat
  // that class and drop every marker back into document flow — they would stack
  // down the map instead of sitting on their coordinates. Both hosts already
  // give the badge a positioned ancestor: the Mapbox class here, and the
  // absolutely positioned `.marker-slot` on the tile-less plane.
  el.style.backgroundColor = BRAND_RED;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.borderRadius = '50%';
  el.style.border = '3px solid white';
  el.style.cursor = 'pointer';
  el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  el.style.transition = 'box-shadow 0.2s, border-width 0.2s';

  // A single-workshop marker still identifies one workshop, so the marker click
  // is the click-through signal. Grouped markers track on the popup link instead.
  if (!isGrouped) {
    el.addEventListener('click', () => {
      trackMapMarkerClick(first.name, first.slug ?? '');
    });
  }

  el.addEventListener('mouseenter', () => {
    el.style.boxShadow = '0 4px 12px rgba(200,16,46,0.4)';
    el.style.borderWidth = '4px';
  });

  el.addEventListener('mouseleave', () => {
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    el.style.borderWidth = '3px';
  });

  // Mapbox opens the popup on click, so mirror that for keyboard users.
  el.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      el.click();
    }
  });

  if (isGrouped) {
    const badge = document.createElement('span');
    badge.className = 'workshop-marker-badge';
    badge.textContent = String(count);
    badge.setAttribute('aria-hidden', 'true');
    badge.style.position = 'absolute';
    badge.style.top = '-6px';
    badge.style.right = '-6px';
    badge.style.minWidth = '18px';
    badge.style.height = '18px';
    badge.style.padding = '0 4px';
    badge.style.borderRadius = '9px';
    badge.style.backgroundColor = '#1C1C1E';
    badge.style.border = '2px solid white';
    badge.style.color = 'white';
    badge.style.fontSize = '11px';
    badge.style.fontWeight = '600';
    badge.style.lineHeight = '14px';
    badge.style.textAlign = 'center';
    el.appendChild(badge);
  }

  return el;
}
