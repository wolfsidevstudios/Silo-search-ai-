import React, { useState, useEffect } from 'react';
import type { Space, SearchResult, UserProfile } from '../types';
import * as db from '../utils/db';
import { fetchSpaceSearchResult } from '../services/geminiService';
import { LogoIcon } from './icons/LogoIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { SearchInput } from './SearchInput';
import { Header } from './Header';
import { Footer } from './Footer';

interface SpacePageProps {
  spaceId: number;
  geminiApiKey: string;
  onOpenSpaceEditor: (space: Space | null) => void;
  onDeleteSpace: (id: number) => void;
  navigate: (path: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
}

export const SpacePage: React.FC<SpacePageProps> = ({ spaceId, geminiApiKey, onOpenSpaceEditor, onDeleteSpace, navigate, ...headerProps }) => {
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
    setSearchResult(null);
    setError(null);

    try {
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

      const result = await fetchSpaceSearchResult(query, geminiApiKey, space, contextData);
      setSearchResult(result);

    } catch (err) {
      console.error(err);
      setError("An error occurred during the search. Please try again.");
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setSearchResult(null);
    setCurrentQuery('');
    setIsSearching(false);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><LogoIcon className="w-16 h-16 animate-spin" /></div>;
  }
  if (error && !space) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => navigate('/create')} className="px-4 py-2 bg-black text-white rounded-full">Back to Create Hub</button>
        </div>
    );
  }
  if (!space) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Header 
            {...headerProps}
            onHome={() => searchResult ? resetSearch() : navigate('/create')}
            showHomeButton={true}
        />

        <main className="flex-grow flex flex-col items-center justify-center p-4">
            {isSearching ? (
                <div className="flex flex-col items-center">
                    <LogoIcon className="w-12 h-12 animate-spin" />
                    <p className="mt-4 text-gray-600">Searching within "{space.name}"...</p>
                </div>
            ) : searchResult ? (
                 <div className="max-w-4xl w-full">
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <h1 className="text-3xl font-bold text-center mb-2">{currentQuery}</h1>
                    <p className="text-center text-gray-500 text-sm mb-6">Results from your Space: "{space.name}"</p>
                    <p className="text-lg leading-relaxed text-gray-800 text-center bg-white p-6 rounded-lg border">{searchResult.summary}</p>
                    {searchResult.quickLinks && searchResult.quickLinks.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-center font-semibold mb-4">Sources</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {searchResult.quickLinks.map((link, index) => (
                                    <a key={index} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm hover:bg-gray-200 transition-colors">{link.title}</a>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
            ) : (
                <div className="w-full max-w-2xl text-center">
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
                </div>
            )}
        </main>
        
        <footer className="sticky bottom-0 left-0 right-0 p-2 sm:p-4 bg-white/80 backdrop-blur-sm z-20">
            <div className="max-w-xl mx-auto flex justify-between items-center">
                {searchResult ? (
                    <SearchInput onSearch={handleSearch} isLarge={false} speechLanguage="en-US" onOpenComingSoonModal={() => {}} isStudyMode={false} setIsStudyMode={() => {}} summarizationSource={null} onOpenSummarizeSourceSelector={()=>{}} onClearSummarizationSource={()=>{}} showModes={false} />
                ) : (
                    <div className="flex items-center space-x-2">
                        <button onClick={() => onOpenSpaceEditor(space)} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300">
                            <EditIcon className="w-4 h-4" />
                            <span>Edit</span>
                        </button>
                        <button onClick={() => onDeleteSpace(space.id)} className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </footer>
    </div>
  );
};
