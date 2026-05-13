'use client';

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { Workshop } from '@/lib/cms/workshop/types';

interface WorkshopMapProps {
  workshops: Workshop[];
}

export function WorkshopMap({ workshops }: WorkshopMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return; // Initialize map only once

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

        // Calculate center point (approximate center of Sweden)
        const avgLat = workshops.reduce((sum, w) => sum + w.latitude, 0) / workshops.length;
        const avgLng = workshops.reduce((sum, w) => sum + w.longitude, 0) / workshops.length;

        map.current = new mapboxgl.Map({
          container: container,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [avgLng, avgLat],
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

        // Add markers for each workshop
        workshops.forEach(workshop => {
          // Create custom marker element
          const el = document.createElement('div');
          el.className = 'workshop-marker';
          el.style.backgroundColor = '#C8102E';
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.border = '3px solid white';
          el.style.cursor = 'pointer';
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
          el.style.transition = 'box-shadow 0.2s, border-width 0.2s';

          el.addEventListener('mouseenter', () => {
            el.style.boxShadow = '0 4px 12px rgba(200,16,46,0.4)';
            el.style.borderWidth = '4px';
          });

          el.addEventListener('mouseleave', () => {
            el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            el.style.borderWidth = '3px';
          });

          // Create popup
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
          }).setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: 600; margin-bottom: 4px; color: #1C1C1E;">${workshop.name}</h3>
            <p style="color: #666; margin-bottom: 8px; font-size: 14px;">${workshop.city}, ${workshop.region}</p>
            <a href="/portfolio/${workshop.slug}" style="color: #C8102E; font-weight: 500; font-size: 14px;">View details</a>
          </div>
        `);

          // Add marker
          new mapboxgl.Marker(el)
            .setLngLat([workshop.longitude, workshop.latitude])
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
    };
  }, [workshops]);

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
