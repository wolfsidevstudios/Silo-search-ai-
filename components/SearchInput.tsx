
import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface SearchInputProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  large?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, initialValue = '', large = false }) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const containerClasses = large 
    ? "p-2 pl-6 rounded-full shadow-lg" 
    : "p-1 pl-4 rounded-full border border-gray-200";
    
  const inputClasses = large 
    ? "text-lg" 
    : "text-base";

  const buttonClasses = large
    ? "w-12 h-12"
    : "w-9 h-9";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center w-full bg-white transition-shadow duration-300 focus-within:shadow-xl ${containerClasses}`}
    >
      <SearchIcon />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask anything..."
        className={`w-full h-full px-4 bg-transparent outline-none border-none ${inputClasses}`}
      />
      <button
        type="submit"
        className={`flex-shrink-0 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors ${buttonClasses}`}
      >
        <ArrowRightIcon />
      </button>
    </form>
  );
};
