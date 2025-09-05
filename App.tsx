import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SearchPage } from './components/SearchPage';
import { ResultsPage } from './components/ResultsPage';
import { Sidebar } from './components/Sidebar';
import { ThemePanel } from './components/ThemePanel';
import { SettingsModal } from './components/SettingsModal';
import { ChatModal } from './components/ChatModal';
import { fetchSearchResults } from './services/geminiService';
import type { SearchResult, ChatMessage } from './types';
import { LogoIcon } from './components/icons/LogoIcon';
import { GoogleGenAI, Chat } from "@google/genai";

type View = 'search' | 'results' | 'loading' | 'error';

const MAX_RECENT_SEARCHES = 15;

const App: React.FC = () => {
  const [view, setView] = useState<View>('search');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isThemePanelOpen, setThemePanelOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isTemporaryMode, setTemporaryMode] = useState(false);
  
  const [isChatModeOpen, setChatModeOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setChatLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);

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
      window.localStorage.setItem('ai-api-keys', JSON.stringify(apiKeys));
    } catch (error) {
      console.error("Could not save API keys to localStorage", error);
    }
  }, [apiKeys]);


  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    if (!apiKeys.gemini) {
      setError('Please configure your Google Gemini API key in the settings before searching.');
      setView('error');
      return;
    }

    setSidebarOpen(false);
    setThemePanelOpen(false);
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
    setThemePanelOpen(false);
    setSidebarOpen(prev => !prev);
  }
  const handleToggleTemporaryMode = () => setTemporaryMode(prev => !prev);
  const handleClearRecents = () => setRecentSearches([]);
  const handleToggleThemePanel = () => {
    setSidebarOpen(false);
    setThemePanelOpen(prev => !prev);
  };
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setThemePanelOpen(false);
  };

  const handleOpenSettings = () => {
    setSidebarOpen(false);
    setSettingsModalOpen(true);
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

  const renderContent = () => {
    const commonProps = {
      isTemporaryMode,
      onToggleSidebar: handleToggleSidebar,
      onToggleTemporaryMode: handleToggleTemporaryMode,
      onToggleThemePanel: handleToggleThemePanel,
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
        return <SearchPage onSearch={handleSearch} isClockVisible={isClockVisible} {...commonProps} />;
      case 'search':
      default:
        return <SearchPage onSearch={handleSearch} isClockVisible={isClockVisible} {...commonProps} />;
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
      />
      <ThemePanel
        isOpen={isThemePanelOpen}
        onClose={() => setThemePanelOpen(false)}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        apiKeys={apiKeys}
        onApiKeysChange={setApiKeys}
        isClockVisible={isClockVisible}
        onIsClockVisibleChange={setIsClockVisible}
      />
      <ChatModal
        isOpen={isChatModeOpen}
        onClose={handleCloseChatMode}
        history={chatHistory}
        onSendMessage={handleSendChatMessage}
        isLoading={isChatLoading}
      />
      <div className={`${isSidebarOpen || isThemePanelOpen || isSettingsModalOpen || isChatModeOpen ? 'blur-sm' : ''} transition-filter duration-300`}>
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