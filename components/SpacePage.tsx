import React, { useState, useEffect } from 'react';
import type { Space, SearchResult, UserProfile } from '../types';
import * as db from '../utils/db';
import { fetchSpaceSearchResult } from '../services/geminiService';
import { LogoIcon } from './icons/LogoIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SearchInput } from './SearchInput';
import { ResultsPage } from './ResultsPage'; // Reusing for display

interface SpacePageProps {
  spaceId: number;
  geminiApiKey: string;
  onOpenSpaceEditor: (space: Space | null) => void;
  onDeleteSpace: (id: number) => void;
  navigate: (path: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
}

export const SpacePage: React.FC<SpacePageProps> = ({ spaceId, geminiApiKey, onOpenSpaceEditor, onDeleteSpace, navigate, userProfile, onLogout }) => {
  const [space, setSpace] = useState<Space | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => {
    const loadSpace = async () => {
      setIsLoading(true);
      const spaceData = await db.getSpace(spaceId);
      if (spaceData) {
        setSpace(spaceData);
      } else {
        setError("Space not found.");
      }
      setIsLoading(false);
    };
    loadSpace();
  }, [spaceId]);

  const handleSearch = async (query: string) => {
    if (!space || !query.trim()) return;

    setIsSearching(true);
    setCurrentQuery(query);
    setError(null);

    try {
      // 1. Fetch content for all data sources
      let contextData = '';
      for (const source of space.dataSources) {
        if (source.type === 'file') {
          const file = await db.getFile(source.id);
          if (file && file.content.type.startsWith('text/')) {
            const textContent = await file.content.text();
            contextData += `--- FILE: ${file.name} ---\n${textContent}\n\n`;
          }
        } else if (source.type === 'note') {
          const note = await db.getNote(source.id);
          if (note) {
            contextData += `--- NOTE: ${note.title} ---\n${note.content}\n\n`;
          }
        }
      }

      // 2. Call Gemini service
      const result = await fetchSpaceSearchResult(query, geminiApiKey, space, contextData);
      setSearchResult(result);

    } catch (err) {
      console.error(err);
      setError("An error occurred during the search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><LogoIcon className="w-16 h-16 animate-spin" /></div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;
  }
  if (!space) {
    return <div className="flex items-center justify-center h-screen">Space could not be loaded.</div>;
  }
  
  if (searchResult) {
      return <ResultsPage 
                result={searchResult}
                originalQuery={currentQuery}
                onSearch={handleSearch}
                onHome={() => navigate('/search')}
                onEnterChatMode={() => {}} // Chat mode not implemented for spaces yet
                isTemporaryMode={false}
                onToggleSidebar={() => {}}
                onToggleTemporaryMode={() => {}}
                onOpenSettings={() => navigate('/settings')}
                userProfile={userProfile}
                onLogout={onLogout}
                searchInputSettings={{ isLarge: false, isGlossy: false }}
                speechLanguage="en-US"
                onOpenComingSoonModal={() => {}}
                onOpenLegalPage={(page) => navigate(`/${page}`)}
                summarizationSource={null}
                onOpenSummarizeSourceSelector={() => {}}
                onClearSummarizationSource={() => {}}
                onOpenVideoPlayer={() => {}}
             />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="p-4 flex justify-between items-center border-b bg-white">
            <div className="flex items-center space-x-3">
                <button onClick={() => navigate('/create')} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeftIcon /></button>
                <h1 className="text-xl font-bold">{space.name}</h1>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => onOpenSpaceEditor(space)} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300">
                    <EditIcon className="w-4 h-4" />
                    <span>Edit</span>
                </button>
                 <button onClick={() => onDeleteSpace(space.id)} className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </header>
        <main className="flex-grow flex flex-col items-center justify-center px-4 pb-12 text-center">
            <div className="max-w-3xl w-full">
                {isSearching ? (
                    <div className="flex flex-col items-center">
                        <LogoIcon className="w-12 h-12 animate-spin" />
                        <p className="mt-4 text-gray-600">Searching in "{space.name}"...</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-4xl font-bold text-gray-800 mb-2">{space.name}</h2>
                        <p className="text-gray-600 mb-8 max-w-xl mx-auto">{space.systemInstruction || 'This space is ready for your questions.'}</p>
                        <SearchInput 
                            onSearch={(query) => handleSearch(query)}
                            variant="home"
                            speechLanguage="en-US"
                            onOpenComingSoonModal={() => {}}
                            isStudyMode={false}
                            setIsStudyMode={() => {}}
                            summarizationSource={null}
                            onOpenSummarizeSourceSelector={() => {}}
                            onClearSummarizationSource={() => {}}
                            showModes={false}
                        />
                    </>
                )}
            </div>
        </main>
    </div>
  );
};
