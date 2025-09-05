
import React, { useRef } from 'react';
import { SearchInput } from './SearchInput';
import { Header } from './Header';
import { IncognitoIcon } from './icons/IncognitoIcon';
import { Clock } from './Clock';
import { DraggableSticker } from './DraggableSticker';
import { StickerComponents } from './sticker-library';
import type { ClockSettings, StickerInstance, CustomSticker } from '../types';

interface SearchPageProps {
  onSearch: (query: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  isClockVisible: boolean;
  clockSettings: ClockSettings;
  stickers: StickerInstance[];
  customStickers: CustomSticker[];
  onUpdateSticker: (sticker: StickerInstance) => void;
  isStickerEditMode: boolean;
  onExitStickerEditMode: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ 
  onSearch, 
  isTemporaryMode, 
  onToggleSidebar, 
  onToggleTemporaryMode, 
  onOpenSettings, 
  isClockVisible, 
  clockSettings, 
  stickers,
  customStickers,
  onUpdateSticker,
  isStickerEditMode,
  onExitStickerEditMode,
}) => {
  const stickerCanvasRef = useRef<HTMLDivElement>(null);
  
  // Create a map of custom stickers for quick lookups
  const customStickerMap = new Map(customStickers.map(cs => [cs.id, cs]));

  return (
    <div className="flex flex-col min-h-screen relative" ref={stickerCanvasRef}>
      {/* Sticker Container: Elevated during edit mode */}
      <div className={`absolute inset-0 ${isStickerEditMode ? 'z-30' : 'z-0 pointer-events-none'}`}>
        {stickers.map(sticker => {
          const customStickerData = customStickerMap.get(sticker.stickerId);
          const LibraryStickerComponent = StickerComponents[sticker.stickerId];
          
          return (
            <DraggableSticker 
              key={sticker.id}
              sticker={sticker}
              containerRef={stickerCanvasRef}
              onUpdate={onUpdateSticker}
              isDraggable={isStickerEditMode}
            >
              {customStickerData ? (
                <img src={customStickerData.imageData} alt={customStickerData.name} className="w-full h-full object-contain pointer-events-none" />
              ) : LibraryStickerComponent ? (
                <LibraryStickerComponent />
              ) : null}
            </DraggableSticker>
          );
        })}
      </div>
      
      {/* Main Content */}
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

      {/* Edit Mode UI */}
      {isStickerEditMode && (
        <>
          {/* Blur Overlay: Sits between main content (z-10) and stickers (z-30) */}
          <div className="absolute inset-0 z-20 bg-black/30 backdrop-blur-sm" aria-hidden="true"></div>
          
          {/* UI elements: On top of everything (z-40) */}
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-between p-8 pointer-events-none">
            <div className="bg-white/90 p-4 rounded-xl shadow-lg text-center max-w-sm pointer-events-auto">
              <h3 className="text-xl font-bold text-gray-800">Sticker Preview</h3>
              <p className="mt-1 text-sm text-gray-600">Drag your stickers to arrange them. Click Done when you're finished.</p>
            </div>
            <button 
              onClick={onExitStickerEditMode}
              className="bg-black text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-800 transition-transform hover:scale-105 pointer-events-auto"
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
};
