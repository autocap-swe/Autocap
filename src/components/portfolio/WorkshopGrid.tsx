'use client';

import { useState, useMemo } from 'react';
import { Building2 } from 'lucide-react';
import { WorkshopCard } from './WorkshopCard';
import { WorkshopSearchInput } from './WorkshopSearchInput';
import type { Workshop } from '@/lib/cms/workshop/types';

interface WorkshopGridProps {
  workshops: Workshop[];
}

export function WorkshopGrid({ workshops }: WorkshopGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const cities = useMemo(() => [...new Set(workshops.map(w => w.city))].sort(), [workshops]);

  const filteredWorkshops = useMemo(() => {
    let result = workshops;

    // Apply city filter
    if (selectedCity !== 'All') {
      result = result.filter(w => w.city === selectedCity);
    }

    // Apply search filter (case-insensitive partial match)
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(w => w.name.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [selectedCity, searchTerm, workshops]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#E4E2DE] via-[#D8D6D2] to-[#E4E2DE] py-20 md:py-28">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: 'radial-gradient(circle, #1C1C1E 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
              <Building2 className="h-6 w-6 text-[#C8102E]" />
            </div>
            <h2 className="text-3xl font-bold text-[#1C1C1E] md:text-4xl">All Workshops</h2>
          </div>
          <div className="h-1 w-24 bg-[#C8102E]" />
        </div>

        {/* Search Bar with City Dropdown */}
        <div className="mx-auto mb-12 max-w-4xl">
          <WorkshopSearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            cities={cities}
          />
        </div>

        {/* Grid or Empty State */}
        {filteredWorkshops.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Building2 className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-700">No workshops found</h3>
            <p className="text-gray-500">
              {searchTerm && selectedCity !== 'All'
                ? `No results for "${searchTerm}" in ${selectedCity}`
                : searchTerm
                  ? `No results for "${searchTerm}"`
                  : `No workshops in ${selectedCity}`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredWorkshops.map((workshop, index) => (
              <WorkshopCard key={workshop.id} workshop={workshop} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
