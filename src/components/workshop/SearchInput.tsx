'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  className = '',
}: SearchInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="h-5 w-5 text-gray-500 md:h-6 md:w-6" strokeWidth={2} />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border-2
          border-gray-300
          bg-white
          py-3
          pl-12
          pr-4
          text-base
          font-medium
          text-gray-900
          transition-all
          duration-200
          placeholder:font-normal
          placeholder:text-gray-600
          focus:border-[#C8102E]
          focus:outline-none
          focus:ring-2
          focus:ring-[#C8102E]/20
          active:border-[#C8102E]
          md:py-4
          md:pl-14
          md:pr-6
          md:text-lg
          md:placeholder:text-gray-500
        "
        style={{
          WebkitTextFillColor: '#111827',
          opacity: 1,
        }}
      />
    </div>
  );
}
