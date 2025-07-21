import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  onSearch: (query: string) => void;
  className?: string;
}

export const SearchBar: React.FC<Props> = ({ onSearch, className }) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder="Buscar por número, cliente o caso..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-gray-800"
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
    </div>
  );
};
