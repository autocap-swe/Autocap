'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Workshop } from '@/lib/cms/workshop/types';
import { trackMapMarkerClick } from '@/lib/analytics';
import { groupWorkshopsByCoordinate } from './groupWorkshopsByCoordinate';
import { buildMarkerElement, buildPopupHtml } from './workshopMarkerContent';
import { WorkshopPinPlane } from './WorkshopPinPlane';

interface WorkshopMapProps {
  workshops: Workshop[];
}

// Approximate centre of Sweden, used when there are no workshops to average.
const DEFAULT_CENTER: [number, number] = [15.0, 60.0];
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
    // Outside production the map usually fails because the Mapbox token is
    // URL-restricted to the live domains, so show the pins instead of an error
    // a reviewer can do nothing about.
    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
      return <WorkshopPinPlane workshops={workshops} />;
    }

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
