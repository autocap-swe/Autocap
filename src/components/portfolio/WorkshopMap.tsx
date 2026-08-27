'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Workshop } from '@/lib/cms/workshop/types';
import { trackMapMarkerClick } from '@/lib/analytics';
import {
  groupWorkshopsByCoordinate,
  type WorkshopLocationGroup,
} from './groupWorkshopsByCoordinate';

interface WorkshopMapProps {
  workshops: Workshop[];
}

// Approximate centre of Sweden, used when there are no workshops to average.
const DEFAULT_CENTER: [number, number] = [15.0, 60.0];
const BRAND_RED = '#C8102E';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildPopupHtml(group: WorkshopLocationGroup): string {
  const [first] = group.workshops;
  const location = escapeHtml(`${first.city}, ${first.region}`);

  if (group.workshops.length === 1) {
    return `
      <div style="padding: 8px;">
        <h3 style="font-weight: 600; margin-bottom: 4px; color: #1C1C1E;">${escapeHtml(first.name)}</h3>
        <p style="color: #666; margin-bottom: 8px; font-size: 14px;">${location}</p>
        <a href="/portfolio/${encodeURIComponent(first.slug)}" style="color: ${BRAND_RED}; font-weight: 500; font-size: 14px;">View details</a>
      </div>
    `;
  }

  const entries = group.workshops
    .map(
      workshop => `
        <li style="padding: 8px 0; border-top: 1px solid #E5E5E5;">
          <p style="font-weight: 600; margin-bottom: 2px; color: #1C1C1E;">${escapeHtml(workshop.name)}</p>
          <a href="/portfolio/${encodeURIComponent(workshop.slug)}" data-workshop-name="${escapeHtml(workshop.name)}" data-workshop-slug="${escapeHtml(workshop.slug)}" style="color: ${BRAND_RED}; font-weight: 500; font-size: 14px;">View details</a>
        </li>
      `
    )
    .join('');

  return `
    <div style="padding: 8px; max-width: 240px;">
      <h3 style="font-weight: 600; margin-bottom: 2px; color: #1C1C1E;">${location}</h3>
      <p style="color: #666; font-size: 13px;">${group.workshops.length} workshops at this location</p>
      <ul style="list-style: none; margin: 4px 0 0; padding: 0; max-height: 200px; overflow-y: auto;">${entries}</ul>
    </div>
  `;
}

function buildMarkerElement(group: WorkshopLocationGroup): HTMLDivElement {
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
  el.style.position = 'relative';
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

/**
 * Reports a click-through for the workshop whose link was clicked inside a
 * grouped popup, so one marker covering several workshops still tells us which
 * one the visitor opened.
 */
function trackGroupedPopupClicks(popup: mapboxgl.Popup): void {
  let bound = false;

  popup.on('open', () => {
    if (bound) return;
    const popupEl = popup.getElement();
    if (!popupEl) return;

    bound = true;
    popupEl.addEventListener('click', event => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[data-workshop-slug]'
      );
      if (!link) return;
      trackMapMarkerClick(link.dataset.workshopName ?? '', link.dataset.workshopSlug ?? '');
    });
  });
}

export function WorkshopMap({ workshops }: WorkshopMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const locationGroups = useMemo(() => groupWorkshopsByCoordinate(workshops), [workshops]);

  // Rebuild the map on content changes only — a new array with the same
  // workshops (e.g. a parent re-render) must not tear the map down.
  const groupsSignature = locationGroups
    .map(group => `${group.key}:${group.workshops.map(workshop => workshop.slug).join('-')}`)
    .join('|');
  const groupsRef = useRef(locationGroups);
  groupsRef.current = locationGroups;

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // Initialize map only once per workshop set

    const container = mapContainer.current;
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!mapboxToken) {
      setMapError(true);
      console.error('Mapbox token not found');
      return;
    }

    // Small delay to ensure container is fully rendered
    const initMap = () => {
      try {
        mapboxgl.accessToken = mapboxToken;
        const groups = groupsRef.current;

        // Centre on the average of all locations, falling back to Sweden's centre
        const center: [number, number] = groups.length
          ? [
              groups.reduce((sum, g) => sum + g.longitude, 0) / groups.length,
              groups.reduce((sum, g) => sum + g.latitude, 0) / groups.length,
            ]
          : DEFAULT_CENTER;

        map.current = new mapboxgl.Map({
          container: container,
          style: 'mapbox://styles/mapbox/light-v11',
          center,
          zoom: 5,
        });

        // Wait for map to load before adding markers
        map.current.on('load', () => {
          setMapLoaded(true);
        });

        // Error handling
        map.current.on('error', e => {
          console.error('Map error:', e);
          setMapError(true);
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // One marker per distinct coordinate — co-located workshops share a popup
        groups.forEach(group => {
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
          }).setHTML(buildPopupHtml(group));

          if (group.workshops.length > 1) {
            trackGroupedPopupClicks(popup);
          }

          new mapboxgl.Marker(buildMarkerElement(group))
            .setLngLat([group.longitude, group.latitude])
            .setPopup(popup)
            .addTo(map.current!);
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setMapLoaded(false);
      }
    };

    // Initialize map after a brief delay
    const timer = setTimeout(initMap, 100);

    return () => {
      clearTimeout(timer);
      map.current?.remove();
      map.current = null;
      setMapLoaded(false);
    };
  }, [groupsSignature]);

  if (mapError) {
    return (
      <div className="bg-gray-100 rounded-lg p-12 text-center">
        <p className="text-gray-600 mb-4">
          We&apos;re having trouble loading the map. Please try refreshing the page.
        </p>
        <p className="text-sm text-gray-500">The workshop grid below is still available.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px]">
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#C8102E] border-r-transparent mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden shadow-lg" />
    </div>
  );
}
