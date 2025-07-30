import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (query: string) => void;
  className?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<Props> = ({ onSearch, className, debounceMs = 300 }) => {
  const [inputValue, setInputValue] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      onSearch(inputValue.trim());
    }, debounceMs);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [inputValue, onSearch, debounceMs]);

  return (
    <div className={`relative ${className ?? ''}`}>
      <input
        type="search"
        aria-label="Buscar facturas por número, cliente o caso"
        placeholder="Buscar por número, cliente o caso..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoComplete="off"
        className="
          w-full
          pl-10
          pr-4
          py-2.5
          rounded-md
          border
          border-gray-300
          text-sm
          text-gray-800
          placeholder:text-gray-400
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition
          duration-200
          ease-in-out
        "
      />
      <Search
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          h-5
          w-5
          text-gray-400
          pointer-events-none
        "
        aria-hidden="true"
      />
    </div>
  );
};