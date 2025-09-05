


import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SearchPage } from './components/SearchPage';
import { ResultsPage } from './components/ResultsPage';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';
import { ChatModal } from './components/ChatModal';
import { IntroModal } from './components/IntroModal';
import { UnpackedModal } from './components/UnpackedModal';
import { fetchSearchResults } from './services/geminiService';
import type { SearchResult, ChatMessage, ClockSettings, StickerInstance, CustomSticker, WidgetInstance, UserProfile, WidgetType, TemperatureUnit } from './types';
import { LogoIcon } from './components/icons/LogoIcon';
import { GoogleGenAI, Chat } from "@google/genai";

declare global {
  interface Window {
    google?: any;
  }
}

interface JwtPayload {
  name: string;
  email: string;
  picture: string;
}

type View = 'search' | 'results' | 'loading' | 'error';

const MAX_RECENT_SEARCHES = 15;

const App: React.FC = () => {
  const [view, setView] = useState<View>('search');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [initialSettingsSection, setInitialSettingsSection] = useState<string | undefined>();
  const [isTemporaryMode, setTemporaryMode] = useState(false);
  const [isStickerEditMode, setStickerEditMode] = useState(false);
  const [isWidgetEditMode, setWidgetEditMode] = useState(false);
  
  const [isChatModeOpen, setChatModeOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setChatLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);

  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showUnpackedModal, setShowUnpackedModal] = useState(false);
  const [isGsiScriptLoaded, setIsGsiScriptLoaded] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const item = window.localStorage.getItem('userProfile');
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Could not parse user profile from localStorage", error);
      return null;
    }
  });

  const [stickers, setStickers] = useState<StickerInstance[]>(() => {
    try {
      const items = window.localStorage.getItem('stickers');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Could not parse stickers from localStorage", error);
      return [];
    }
  });

  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    try {
      const items = window.localStorage.getItem('widgets');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Could not parse widgets from localStorage", error);
      return [];
    }
  });

  const [customStickers, setCustomStickers] = useState<CustomSticker[]>(() => {
    try {
      const items = window.localStorage.getItem('customStickers');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Could not parse custom stickers from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    const hasSeenIntro = window.localStorage.getItem('hasSeenWelcome_v1');
    if (!hasSeenIntro) {
      setShowIntroModal(true);
    } else {
      const hasSeenUnpacked = window.localStorage.getItem('hasSeenUnpacked_v1');
      if (!hasSeenUnpacked) {
        setShowUnpackedModal(true);
      }
    }
  }, []);

  const handleCloseIntroModal = () => {
    setShowIntroModal(false);
    window.localStorage.setItem('hasSeenWelcome_v1', 'true');
    // After closing the first intro, check if we should show the next one.
    const hasSeenUnpacked = window.localStorage.getItem('hasSeenUnpacked_v1');
    if (!hasSeenUnpacked) {
        setShowUnpackedModal(true);
    }
  };
  
  const handleCloseUnpackedModal = () => {
    setShowUnpackedModal(false);
    window.localStorage.setItem('hasSeenUnpacked_v1', 'true');
  };

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
        const items = window.localStorage.getItem('recentSearches');
        return items ? JSON.parse(items) : [];
    } catch (error) {
        console.error("Could not parse recent searches from localStorage", error);
        return [];
    }
  });

  const [theme, setTheme] = useState<string>(() => {
    return window.localStorage.getItem('silo-theme') || 'bg-white';
  });

  const [isClockVisible, setIsClockVisible] = useState<boolean>(() => {
    try {
        const item = window.localStorage.getItem('isClockVisible');
        return item ? JSON.parse(item) : true;
    } catch (error) {
        console.error("Could not parse isClockVisible from localStorage", error);
        return true;
    }
  });
  
  const [clockSettings, setClockSettings] = useState<ClockSettings>(() => {
    try {
        const item = window.localStorage.getItem('clockSettings');
        const parsed = item ? JSON.parse(item) : {};
        return { 
            style: parsed.style || 'horizontal', 
            theme: parsed.theme || 'classic',
            font: parsed.font || 'fredoka',
            size: parsed.size || 10,
            thickness: parsed.thickness || 3,
            animation: parsed.animation || 'none',
        };
    } catch (error) {
        console.error("Could not parse clockSettings from localStorage", error);
        return { style: 'horizontal', theme: 'classic', font: 'fredoka', size: 10, thickness: 3, animation: 'none' };
    }
  });

  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(() => {
    try {
        const item = window.localStorage.getItem('temperatureUnit');
        return (item as TemperatureUnit) || 'fahrenheit';
    } catch (error) {
        console.error("Could not parse temperatureUnit from localStorage", error);
        return 'fahrenheit';
    }
  });

  const [apiKeys, setApiKeys] = useState<{ [key: string]: string }>(() => {
    try {
      const items = window.localStorage.getItem('ai-api-keys');
      return items ? JSON.parse(items) : {};
    } catch (error) {
      console.error("Could not parse API keys from localStorage", error);
      return {};
    }
  });

  useEffect(() => {
    try {
        window.localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    } catch (error) {
        console.error("Could not save recent searches to localStorage", error);
    }
  }, [recentSearches]);

  useEffect(() => {
    window.localStorage.setItem('silo-theme', theme);
    document.body.className = theme;
  }, [theme]);
  
  useEffect(() => {
    try {
        window.localStorage.setItem('isClockVisible', JSON.stringify(isClockVisible));
    } catch (error) {
        console.error("Could not save isClockVisible to localStorage", error);
    }
  }, [isClockVisible]);
  
  useEffect(() => {
    try {
        window.localStorage.setItem('clockSettings', JSON.stringify(clockSettings));
    } catch (error) {
        console.error("Could not save clockSettings to localStorage", error);
    }
  }, [clockSettings]);

  useEffect(() => {
    try {
        window.localStorage.setItem('temperatureUnit', temperatureUnit);
    } catch (error) {
        console.error("Could not save temperatureUnit to localStorage", error);
    }
  }, [temperatureUnit]);

  useEffect(() => {
    try {
      window.localStorage.setItem('stickers', JSON.stringify(stickers));
    } catch (error) {
      console.error("Could not save stickers to localStorage", error);
    }
  }, [stickers]);

  useEffect(() => {
    try {
      window.localStorage.setItem('widgets', JSON.stringify(widgets));
    } catch (error) {
      console.error("Could not save widgets to localStorage", error);
    }
  }, [widgets]);

  useEffect(() => {
    try {
      window.localStorage.setItem('customStickers', JSON.stringify(customStickers));
    } catch (error) {
      console.error("Could not save custom stickers to localStorage", error);
    }
  }, [customStickers]);

  useEffect(() => {
    try {
      window.localStorage.setItem('ai-api-keys', JSON.stringify(apiKeys));
    } catch (error) {
      console.error("Could not save API keys to localStorage", error);
    }
  }, [apiKeys]);
  
  useEffect(() => {
    try {
      if (userProfile) {
        window.localStorage.setItem('userProfile', JSON.stringify(userProfile));
      } else {
        window.localStorage.removeItem('userProfile');
      }
    } catch (error) {
      console.error("Could not save user profile to localStorage", error);
    }
  }, [userProfile]);


  const handleLoginSuccess = useCallback((response: { credential?: string }) => {
    if (response.credential) {
      try {
        const payload: JwtPayload = JSON.parse(atob(response.credential.split('.')[1]));
        setUserProfile({
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        });
      } catch (e) {
        console.error("Error decoding JWT", e);
      }
    }
  }, []);
  
  const handleLogout = () => {
    setUserProfile(null);
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  useEffect(() => {
    const gsiScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    
    const onGsiLoad = () => {
        if (!window.google) {
            console.error('Google script loaded but window.google is not available.');
            return;
        }
        window.google.accounts.id.initialize({
            client_id: '127898517822-f4j5ha3e2n6futbhehvtf06cfqhjhgej.apps.googleusercontent.com',
            callback: handleLoginSuccess,
        });
        setIsGsiScriptLoaded(true);
    };

    if (window.google) {
        onGsiLoad();
    } else if (gsiScript) {
        gsiScript.addEventListener('load', onGsiLoad);
    } else {
        console.error('GSI script tag not found.');
    }

    return () => {
        if (gsiScript) {
            gsiScript.removeEventListener('load', onGsiLoad);
        }
    };
  }, [handleLoginSuccess]);


  useEffect(() => {
    if (isGsiScriptLoaded && !userProfile) {
        window.google.accounts.id.prompt();
    }
  }, [isGsiScriptLoaded, userProfile]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    if (!apiKeys.gemini) {
      setError('Please configure your Google Gemini API key in the settings before searching.');
      setView('error');
      return;
    }

    setSidebarOpen(false);
    setView('loading');
    setCurrentQuery(query);
    setError(null);

    if (!isTemporaryMode) {
        setRecentSearches(prevSearches => {
            const updatedSearches = [query, ...prevSearches.filter(s => s !== query)];
            return updatedSearches.slice(0, MAX_RECENT_SEARCHES);
        });
    }

    try {
      const result = await fetchSearchResults(query, apiKeys.gemini);
      setSearchResult(result);
      setView('results');
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong. Please check your API key and try again.');
      setView('error');
    }
  }, [isTemporaryMode, apiKeys]);

  const handleGoHome = () => {
    setView('search');
    setSearchResult(null);
    setCurrentQuery('');
    setError(null);
  };
  
  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  }
  const handleToggleTemporaryMode = () => setTemporaryMode(prev => !prev);
  const handleClearRecents = () => setRecentSearches([]);

  const handleOpenSettings = (section?: string) => {
    setSidebarOpen(false);
    setInitialSettingsSection(section);
    setSettingsModalOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsModalOpen(false);
    setInitialSettingsSection(undefined);
  };

  const handleEnterChatMode = (query: string, summary: string) => {
    const ai = new GoogleGenAI({ apiKey: apiKeys.gemini });
    chatRef.current = ai.chats.create({ 
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful AI assistant. The user has just performed a search and received a summary. Continue the conversation by answering follow-up questions about the search topic. Be concise, clear, and organize your answers in short sentences.'
      }
    });
    setChatHistory([
      { role: 'user', text: query },
      { role: 'model', text: summary },
    ]);
    setChatModeOpen(true);
  };

  const handleCloseChatMode = () => {
    setChatModeOpen(false);
    setChatHistory([]);
    chatRef.current = null;
  };

  const handleSendChatMessage = async (message: string) => {
    if (isChatLoading || !chatRef.current) return;

    setChatLoading(true);
    const updatedHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: message }];
    setChatHistory(updatedHistory);

    try {
      const response = await chatRef.current.sendMessage({ message });
      const modelResponse = response.text;
      setChatHistory(prev => [...prev, { role: 'model', text: modelResponse }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };
  
  const handleEnterStickerEditMode = () => {
    setSettingsModalOpen(false);
    setStickerEditMode(true);
  }

  const handleAddSticker = (stickerId: string) => {
    const newSticker: StickerInstance = {
      id: `sticker-${Date.now()}`,
      stickerId,
      // Add sticker near the center so it's easy to find
      x: 50 + (Math.random() - 0.5) * 10,
      y: 40 + (Math.random() - 0.5) * 10,
      size: 8 + Math.random() * 2, // Random size between 8 and 10 rem
    };
    setStickers(prev => [...prev, newSticker]);
  };

  const handleAddCustomSticker = (imageData: string, name: string) => {
    const newCustomSticker: CustomSticker = {
      id: `custom-${Date.now()}`,
      name,
      imageData,
    };
    setCustomStickers(prev => [...prev, newCustomSticker]);
    // Automatically add the new sticker to the canvas
    handleAddSticker(newCustomSticker.id);
    // Enter edit mode immediately
    handleEnterStickerEditMode();
  };

  const handleUpdateSticker = (updatedSticker: StickerInstance) => {
    setStickers(prev => prev.map(s => s.id === updatedSticker.id ? updatedSticker : s));
  };

  const handleClearStickers = () => {
    setStickers([]);
  };

  const handleEnterWidgetEditMode = () => {
    setSettingsModalOpen(false);
    setWidgetEditMode(true);
  };

  const handleAddWidget = (widgetType: WidgetType) => {
    const newWidget: WidgetInstance = {
      id: `${widgetType}-${Date.now()}`,
      widgetType,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50 + (Math.random() - 0.5) * 20,
      data: widgetType === 'note' ? { text: 'Type here...' } : {},
    };
    setWidgets(prev => [...prev, newWidget]);
    handleEnterWidgetEditMode();
  };

  const handleUpdateWidget = (updatedWidget: WidgetInstance) => {
    setWidgets(prev => prev.map(w => w.id === updatedWidget.id ? updatedWidget : w));
  };

  const handleClearWidgets = () => {
    setWidgets([]);
  };

  const renderContent = () => {
    const commonProps = {
      isTemporaryMode,
      onToggleSidebar: handleToggleSidebar,
      onToggleTemporaryMode: handleToggleTemporaryMode,
      onOpenSettings: handleOpenSettings,
      userProfile: userProfile,
      onLogout: handleLogout,
      isGsiScriptLoaded,
    };
    
    const searchPageProps = {
        onSearch: handleSearch, 
        isClockVisible: isClockVisible, 
        clockSettings: clockSettings, 
        stickers: stickers, 
        onUpdateSticker: handleUpdateSticker, 
        isStickerEditMode: isStickerEditMode, 
        onExitStickerEditMode: () => setStickerEditMode(false), 
        customStickers: customStickers, 
        temperatureUnit: temperatureUnit,
        widgets: widgets, 
        onUpdateWidget: handleUpdateWidget, 
        isWidgetEditMode: isWidgetEditMode, 
        onExitWidgetEditMode: () => setWidgetEditMode(false),
        ...commonProps
    };

    switch(view) {
      case 'loading':
        return <LoadingState query={currentQuery} />;
      case 'error':
        return <ErrorState message={error} onRetry={() => handleSearch(currentQuery)} onHome={handleGoHome} />;
      case 'results':
        if (searchResult) {
          return <ResultsPage result={searchResult} originalQuery={currentQuery} onSearch={handleSearch} onHome={handleGoHome} onEnterChatMode={handleEnterChatMode} {...commonProps} />;
        }
        return <SearchPage {...searchPageProps} />;
      case 'search':
      default:
        return <SearchPage {...searchPageProps} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-900">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        recentSearches={recentSearches}
        onSearch={handleSearch}
        onClear={handleClearRecents}
        onOpenSettings={handleOpenSettings}
        userProfile={userProfile}
        onLogout={handleLogout}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={handleCloseSettings}
        initialSection={initialSettingsSection}
        apiKeys={apiKeys}
        onApiKeysChange={setApiKeys}
        currentTheme={theme}
        onThemeChange={setTheme}
        isClockVisible={isClockVisible}
        onIsClockVisibleChange={setIsClockVisible}
        clockSettings={clockSettings}
        onClockSettingsChange={setClockSettings}
        temperatureUnit={temperatureUnit}
        onTemperatureUnitChange={setTemperatureUnit}
        onAddSticker={handleAddSticker}
        onClearStickers={handleClearStickers}
        onEnterStickerEditMode={handleEnterStickerEditMode}
        customStickers={customStickers}
        onAddCustomSticker={handleAddCustomSticker}
        onAddWidget={handleAddWidget}
        onClearWidgets={handleClearWidgets}
        onEnterWidgetEditMode={handleEnterWidgetEditMode}
      />
      <ChatModal
        isOpen={isChatModeOpen}
        onClose={handleCloseChatMode}
        history={chatHistory}
        onSendMessage={handleSendChatMessage}
        isLoading={isChatLoading}
      />
      <IntroModal isOpen={showIntroModal} onClose={handleCloseIntroModal} />
      <UnpackedModal isOpen={showUnpackedModal} onClose={handleCloseUnpackedModal} />
      <div className={`${isSidebarOpen || isSettingsModalOpen || isChatModeOpen || showIntroModal || showUnpackedModal ? 'blur-sm' : ''} transition-filter duration-300`}>
        {renderContent()}
      </div>
    </div>
  );
};

const LoadingState: React.FC<{query: string}> = ({ query }) => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <LogoIcon className="w-20 h-20 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Searching for...</p>
        <p className="mt-1 text-xl font-medium text-black">{query}</p>
    </div>
);

const ErrorState: React.FC<{message: string | null; onRetry: () => void; onHome: () => void}> = ({ message, onRetry, onHome }) => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2>
        <p className="mt-2 text-gray-600 max-w-md">{message || 'An unknown error occurred.'}</p>
        <div className="flex gap-4 mt-8">
            <button onClick={onHome} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300">
                Go Home
            </button>
            <button onClick={onRetry} className="px-4 py-2 text-white bg-black rounded-full hover:bg-gray-800">
                Try Again
            </button>
        </div>
    </div>
);


export default App;