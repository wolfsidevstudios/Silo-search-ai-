import React from 'react';
import { SearchInput } from './SearchInput';
import { Header } from './Header';
import { IncognitoIcon } from './icons/IncognitoIcon';
import { Clock } from './Clock';
import type { ClockSettings } from '../types';

interface SearchPageProps {
  onSearch: (query: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onToggleThemePanel: () => void;
  isClockVisible: boolean;
  clockSettings: ClockSettings;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSearch, isTemporaryMode, onToggleSidebar, onToggleTemporaryMode, onToggleThemePanel, isClockVisible, clockSettings }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        isTemporaryMode={isTemporaryMode}
        onToggleSidebar={onToggleSidebar}
        onToggleTemporaryMode={onToggleTemporaryMode}
        onToggleThemePanel={onToggleThemePanel}
      />
      <main className="flex-grow flex flex-col items-center justify-center px-4 pb-24 text-center">
        {isClockVisible && <div className="mb-8"><Clock settings={clockSettings} /></div>}
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