
import React, { useState, useCallback, useEffect } from 'react';
import { SearchPage } from './components/SearchPage';
import { ResultsPage } from './components/ResultsPage';
import { Sidebar } from './components/Sidebar';
import { fetchSearchResults } from './services/geminiService';
import type { SearchResult } from './types';

type View = 'search' | 'results' | 'loading' | 'error';

const MAX_RECENT_SEARCHES = 15;

const App: React.FC = () => {
  const [view, setView] = useState<View>('search');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isTemporaryMode, setTemporaryMode] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
        const items = window.localStorage.getItem('recentSearches');
        return items ? JSON.parse(items) : [];
    } catch (error) {
        console.error("Could not parse recent searches from localStorage", error);
        return [];
    }
  });

  useEffect(() => {
    try {
        window.localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    } catch (error) {
        console.error("Could not save recent searches to localStorage", error);
    }
  }, [recentSearches]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
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
      const result = await fetchSearchResults(query);
      setSearchResult(result);
      setView('results');
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong while fetching the results. Please try again.');
      setView('error');
    }
  }, [isTemporaryMode]);

  const handleGoHome = () => {
    setView('search');
    setSearchResult(null);
    setCurrentQuery('');
    setError(null);
  };
  
  const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
  const handleToggleTemporaryMode = () => setTemporaryMode(prev => !prev);
  const handleClearRecents = () => setRecentSearches([]);

  const renderContent = () => {
    const commonProps = {
      isTemporaryMode,
      onToggleSidebar: handleToggleSidebar,
      onToggleTemporaryMode: handleToggleTemporaryMode,
    };

    switch(view) {
      case 'loading':
        return <LoadingState query={currentQuery} />;
      case 'error':
        return <ErrorState message={error} onRetry={() => handleSearch(currentQuery)} onHome={handleGoHome} />;
      case 'results':
        if (searchResult) {
          return <ResultsPage result={searchResult} originalQuery={currentQuery} onSearch={handleSearch} onHome={handleGoHome} {...commonProps} />;
        }
        // Fallback to search if result is null
        return <SearchPage onSearch={handleSearch} {...commonProps} />;
      case 'search':
      default:
        return <SearchPage onSearch={handleSearch} {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        recentSearches={recentSearches}
        onSearch={handleSearch}
        onClear={handleClearRecents}
      />
      <div className={`${isSidebarOpen ? 'blur-sm' : ''} transition-filter duration-300`}>
        {renderContent()}
      </div>
    </div>
  );
};

const LoadingState: React.FC<{query: string}> = ({ query }) => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
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
