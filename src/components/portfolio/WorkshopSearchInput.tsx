import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/atoms/input';
import { cn } from '@/lib/utils';

interface WorkshopSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
}

export function WorkshopSearchInput({
  value,
  onChange,
  selectedCity,
  onCityChange,
  cities,
}: WorkshopSearchInputProps) {
  const allCities = ['All', ...cities];

  return (
    <div className="flex flex-wrap gap-3 sm:flex-nowrap">
      {/* Search Input Container */}
      <div className="relative flex-1">
        {/* Search Icon */}
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        {/* Input */}
        <Input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Search workshops..."
          className={cn(
            'h-12 w-full bg-white pl-12 pr-12 text-base text-gray-900',
            'placeholder:text-gray-500',
            'focus-visible:border-[#C8102E] focus-visible:ring-[#C8102E]/20'
          )}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* City Dropdown */}
      <select
        value={selectedCity}
        onChange={e => onCityChange(e.target.value)}
        className={cn(
          'h-12 w-full min-w-[200px] rounded-md border-2 border-gray-300 bg-white pl-4 pr-10 text-base font-medium text-gray-700 sm:w-auto',
          'transition-colors hover:border-[#C8102E]',
          'focus:border-[#C8102E] focus:outline-none focus:ring-2 focus:ring-[#C8102E]/20'
        )}
      >
        {allCities.map(city => (
          <option key={city} value={city}>
            {city === 'All' ? 'All Cities' : city}
          </option>
        ))}
      </select>
    </div>
  );
}
