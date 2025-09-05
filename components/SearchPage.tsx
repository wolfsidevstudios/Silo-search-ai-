
import React, { useRef } from 'react';
import { SearchInput } from './SearchInput';
import { Header } from './Header';
import { IncognitoIcon } from './icons/IncognitoIcon';
import { Clock } from './Clock';
import { DraggableSticker } from './DraggableSticker';
import { DraggableWidget } from './DraggableWidget';
import { NoteWidget, WeatherWidget } from './widgets/Widgets';
import type { ClockSettings, StickerInstance, CustomSticker, WidgetInstance, UserProfile, TemperatureUnit, SearchInputSettings } from '../types';

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
  widgets: WidgetInstance[];
  onUpdateWidget: (widget: WidgetInstance) => void;
  isWidgetEditMode: boolean;
  onExitWidgetEditMode: () => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  isGsiScriptLoaded: boolean;
  temperatureUnit: TemperatureUnit;
  searchInputSettings: SearchInputSettings;
  speechLanguage: 'en-US' | 'es-ES';
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
  widgets,
  onUpdateWidget,
  isWidgetEditMode,
  onExitWidgetEditMode,
  userProfile,
  onLogout,
  isGsiScriptLoaded,
  temperatureUnit,
  searchInputSettings,
  speechLanguage,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const customStickerMap = new Map(customStickers.map(cs => [cs.id, cs]));

  const renderWidget = (widget: WidgetInstance) => {
    switch(widget.widgetType) {
        case 'note':
            return <NoteWidget widget={widget} onUpdate={onUpdateWidget} isEditing={isWidgetEditMode} />;
        case 'weather':
            return <WeatherWidget temperatureUnit={temperatureUnit} />;
        default:
            return null;
    }
  }

  return (
    <div className="flex flex-col min-h-screen relative" ref={canvasRef}>
      {/* Item Container */}
      <div className={`absolute inset-0 z-0 ${isStickerEditMode || isWidgetEditMode ? 'z-30 pointer-events-auto' : 'pointer-events-none'}`}>
        {stickers.map(sticker => {
          const customStickerData = customStickerMap.get(sticker.stickerId);
          return (
            <DraggableSticker 
              key={sticker.id}
              sticker={sticker}
              containerRef={canvasRef}
              onUpdate={onUpdateSticker}
              isDraggable={isStickerEditMode}
            >
              {customStickerData ? (
                <img src={customStickerData.imageData} alt={customStickerData.name} className="w-full h-full object-contain pointer-events-none" />
              ) : (
                <span 
                    className="leading-none select-none flex items-center justify-center w-full h-full"
                    style={{ 
                        fontSize: `${sticker.size * 0.7}rem`,
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                >
                    {sticker.stickerId}
                </span>
              )}
            </DraggableSticker>
          );
        })}
        {widgets.map(widget => (
            <DraggableWidget
                key={widget.id}
                widget={widget}
                containerRef={canvasRef}
                onUpdate={onUpdateWidget}
                isDraggable={isWidgetEditMode}
            >
                {renderWidget(widget)}
            </DraggableWidget>
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          isTemporaryMode={isTemporaryMode}
          onToggleSidebar={onToggleSidebar}
          onToggleTemporaryMode={onToggleTemporaryMode}
          onOpenSettings={onOpenSettings}
          userProfile={userProfile}
          onLogout={onLogout}
          isGsiScriptLoaded={isGsiScriptLoaded}
        />
        <main className="flex-grow flex flex-col items-center justify-center px-4 pb-24 text-center">
          {isClockVisible && <div className="mb-8"><Clock settings={clockSettings} temperatureUnit={temperatureUnit} /></div>}
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
            <SearchInput onSearch={onSearch} initialValue="How to make a great cup of coffee?" isLarge={searchInputSettings.isLarge} isGlossy={searchInputSettings.isGlossy} speechLanguage={speechLanguage} />
          </div>
        </main>
      </div>

      {/* Edit Mode UI */}
      {(isStickerEditMode || isWidgetEditMode) && (
        <>
          <div className="absolute inset-0 z-20 bg-black/30 backdrop-blur-sm" aria-hidden="true"></div>
          
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-between p-8 pointer-events-none">
            <div className="bg-white/90 p-4 rounded-xl shadow-lg text-center max-w-sm pointer-events-auto">
              <h3 className="text-xl font-bold text-gray-800">{isStickerEditMode ? 'Sticker Preview' : 'Widget Preview'}</h3>
              <p className="mt-1 text-sm text-gray-600">Drag your {isStickerEditMode ? 'stickers' : 'widgets'} to arrange them. Click Done when you're finished.</p>
            </div>
            <button 
              onClick={isStickerEditMode ? onExitStickerEditMode : onExitWidgetEditMode}
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