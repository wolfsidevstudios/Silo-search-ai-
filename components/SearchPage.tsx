import React from 'react';
import { SearchInput } from './SearchInput';
import { Header } from './Header';
import { IncognitoIcon } from './icons/IncognitoIcon';

interface SearchPageProps {
  onSearch: (query: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSearch, isTemporaryMode, onToggleSidebar, onToggleTemporaryMode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isTemporaryMode={isTemporaryMode}
        onToggleSidebar={onToggleSidebar}
        onToggleTemporaryMode={onToggleTemporaryMode}
      />
      <main className="flex-grow flex flex-col items-center justify-center px-4 pb-24 text-center">
        {isTemporaryMode && (
          <div className="flex flex-col items-center mb-8 text-gray-600">
            <IncognitoIcon className="w-16 h-16 text-gray-400" />
            <p className="mt-2 text-lg font-medium">Temporary Chat</p>
          </div>
        )}
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-8">
          Silo Search
        </h1>
        <div className="w-full max-w-2xl">
          <SearchInput onSearch={onSearch} initialValue="How to make a great cup of coffee?" large />
        </div>
      </main>
    </div>
  );
};