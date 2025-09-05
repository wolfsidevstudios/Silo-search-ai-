import React, { useRef } from 'react';
import { SearchInput } from './SearchInput';
import { Header } from './Header';
import { IncognitoIcon } from './icons/IncognitoIcon';
import { Clock } from './Clock';
import { DraggableSticker } from './DraggableSticker';
import type { ClockSettings, StickerInstance } from '../types';

interface SearchPageProps {
  onSearch: (query: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  isClockVisible: boolean;
  clockSettings: ClockSettings;
  stickers: StickerInstance[];
  onUpdateSticker: (sticker: StickerInstance) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onSearch, isTemporaryMode, onToggleSidebar, onToggleTemporaryMode, onOpenSettings, isClockVisible, clockSettings, stickers, onUpdateSticker }) => {
  const stickerCanvasRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="flex flex-col min-h-screen relative" ref={stickerCanvasRef}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stickers.map(sticker => (
          <DraggableSticker 
            key={sticker.id}
            sticker={sticker}
            containerRef={stickerCanvasRef}
            onUpdate={onUpdateSticker}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          isTemporaryMode={isTemporaryMode}
          onToggleSidebar={onToggleSidebar}
          onToggleTemporaryMode={onToggleTemporaryMode}
          onOpenSettings={onOpenSettings}
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
    </div>
  );
};