import React, { useState, useEffect, useCallback } from 'react';
import type { UserProfile, MapSearchResult } from '../types';
import { Header } from './Header';
import { MapPinIcon } from './icons/MapPinIcon';
import { StarIcon } from './icons/StarIcon';
import { LinkIcon } from './icons/LinkIcon';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { fetchMapSearchResults } from '../services/geminiService';

interface MapPageProps {
  initialQuery: string;
  geminiApiKey: string;
  onSearch: (query: string) => void;
  onHome: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

export const MapPage: React.FC<MapPageProps> = ({ initialQuery, geminiApiKey, onSearch, onHome, ...headerProps }) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchResult, setSearchResult] = useState<MapSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    if (!geminiApiKey) {
        setError('Please configure your Google Gemini API key in settings.');
        setIsLoading(false);
        return;
    }

    try {
        const result = await fetchMapSearchResults(searchQuery, geminiApiKey);
        setSearchResult(result);
    } catch (err) {
        console.error(err);
        setError('Sorry, the AI could not find results for this query.');
    } finally {
        setIsLoading(false);
    }
  }, [geminiApiKey]);

  useEffect(() => {
    performSearch(initialQuery);
  }, [initialQuery, performSearch]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };
  
  const embedUrl = searchResult?.boundingBox 
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${searchResult.boundingBox.join('%2C')}&layer=mapnik` 
    : `https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-90%2C180%2C90&layer=mapnik`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header {...headerProps} onHome={onHome} showHomeButton={true} />
      <main className="flex-grow flex flex-col lg:flex-row">
        {/* Results Panel */}
        <div className="w-full lg:w-1/3 xl:w-1/4 h-1/2 lg:h-auto flex flex-col bg-white border-r border-gray-200">
          <div className="p-4 border-b">
            <form onSubmit={handleFormSubmit} className="flex items-center w-full p-1 pl-4 rounded-full bg-gray-100 border border-gray-200 focus-within:ring-2 focus-within:ring-black">
              <SearchIcon className="text-gray-500" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for places..." className="w-full h-full px-2 bg-transparent outline-none" />
              <button type="submit" className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800"><ArrowRightIcon /></button>
            </form>
          </div>
          <div className="flex-grow overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-full"><LogoIcon className="w-12 h-12 animate-spin" /></div>
            ) : error ? (
              <div className="p-4 text-center text-red-600">{error}</div>
            ) : searchResult && searchResult.places.length > 0 ? (
              <ul className="space-y-2">
                {searchResult.places.map(place => (
                  <li key={place.name} className="p-3 rounded-lg border border-transparent bg-white">
                      <h3 className="font-bold text-gray-800">{place.name}</h3>
                      {place.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                            <StarIcon className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-600 font-medium">{place.rating}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 mt-2">{place.description}</p>
                      <p className="text-xs text-gray-500 mt-2 flex items-start space-x-2">
                        <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{place.address}</span>
                      </p>
                      {place.website && (
                          <a href={place.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center space-x-1 text-sm text-blue-600 hover:underline">
                              <LinkIcon className="w-4 h-4"/>
                              <span>Visit Website</span>
                          </a>
                      )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">No results found for "{query}".</div>
            )}
          </div>
        </div>
        
        {/* Map Panel */}
        <div className="w-full lg:w-2/3 xl:w-3/4 h-1/2 lg:h-auto flex-grow bg-gray-200">
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={embedUrl}
                title={`Map of ${searchResult?.locationName || 'the world'}`}
                className="border-none"
            ></iframe>
        </div>
      </main>
    </div>
  );
};