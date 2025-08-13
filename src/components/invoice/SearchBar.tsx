import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onSearch: (query: string) => void;
  className?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<Props> = ({
  onSearch,
  className = '',
  debounceMs = 300,
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const triggerSearch = useCallback(() => {
    onSearch(inputValue.trim());
  }, [inputValue, onSearch]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(triggerSearch, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue, triggerSearch, debounceMs]);

  const clearInput = () => {
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') clearInput();
  }, []);

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="search"
        aria-label="Buscar facturas por número, cliente o caso"
        placeholder="Buscar por número, cliente o caso..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className="
          w-full
          pl-10
          pr-10
          py-2.5
          rounded-md
          border
          border-gray-300
          text-sm
          text-gray-800
          placeholder:text-gray-400
          shadow-sm
          bg-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500/50
          focus:border-links
          transition-all
          duration-200
          ease-in-out
        "
      />

      {/* Icono de búsqueda */}
      <Search
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          h-5 w-5
          text-gray-400
          pointer-events-none
        "
        aria-hidden="true"
      />

      {/* Botón de limpiar */}
      <AnimatePresence>
        {inputValue && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={clearInput}
            aria-label="Limpiar búsqueda"
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              h-5 w-5
              text-gray-500
              hover:text-gray-800
              transition
              focus:outline-none
            "
          >
            <X size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};