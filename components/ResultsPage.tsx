
import React, { useState, useEffect } from 'react';
import type { SearchResult, UserProfile, SearchInputSettings } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { RedoIcon } from './icons/RedoIcon';
import { SearchInput } from './SearchInput';
import { Header } from './Header';
import { VolumeUpIcon } from './icons/VolumeUpIcon';
import { VolumeXIcon } from './icons/VolumeXIcon';
import { Footer } from './Footer';


interface ResultsPageProps {
  result: SearchResult;
  originalQuery: string;
  onSearch: (query: string) => void;
  onHome: () => void;
  onEnterChatMode: (query: string, summary: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  searchInputSettings: SearchInputSettings;
  speechLanguage: 'en-US' | 'es-ES';
  onConnectGmail: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ result, originalQuery, onSearch, onHome, onEnterChatMode, isTemporaryMode, onToggleSidebar, onToggleTemporaryMode, onOpenSettings, userProfile, onLogout, searchInputSettings, speechLanguage, onConnectGmail, onOpenLegalPage }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.summary);
  };

  const handleDownload = () => {
    const blob = new Blob([`Query: ${originalQuery}\n\nSummary:\n${result.summary}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalQuery.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleReSearch = () => {
    onSearch(originalQuery);
  }

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(result.summary);
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      } else {
        alert("Sorry, your browser doesn't support text-to-speech.");
      }
    }
  };

  useEffect(() => {
    // When the component unmounts, cancel any ongoing speech
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isTemporaryMode={isTemporaryMode}
        onToggleSidebar={onToggleSidebar}
        onToggleTemporaryMode={onToggleTemporaryMode}
        onOpenSettings={onOpenSettings}
        onHome={onHome}
        showHomeButton={true}
        userProfile={userProfile}
        onLogout={onLogout}
      />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 pb-32">
        <div className="w-full max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-800">
            {result.summary}
          </p>

          <div className="flex justify-center items-center mt-8">
             <button 
                onClick={() => onEnterChatMode(originalQuery, result.summary)}
                className="bg-black text-white rounded-full px-6 py-3 text-base font-medium hover:bg-gray-800 transition-transform hover:scale-105"
             >
                Chat Mode
            </button>
          </div>

          <div className="flex justify-center items-center space-x-8 mt-8">
            <button onClick={handleCopy} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
              <CopyIcon />
              <span>Copy</span>
            </button>
            <button onClick={handleDownload} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
              <DownloadIcon />
              <span>Download</span>
            </button>
             <button onClick={handleToggleSpeech} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors" aria-label={isSpeaking ? 'Stop reading aloud' : 'Read summary aloud'}>
              {isSpeaking ? <VolumeXIcon /> : <VolumeUpIcon />}
              <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>
            <button onClick={handleReSearch} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors">
              <RedoIcon />
              <span>Re-search</span>
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-12">
            {result.quickLinks.slice(0, 5).map((link, index) => (
              <a 
                key={index} 
                href={link.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm">
        <div className="max-w-xl mx-auto">
          <SearchInput onSearch={onSearch} isLarge={searchInputSettings.isLarge} isGlossy={searchInputSettings.isGlossy} speechLanguage={speechLanguage} onConnectGmail={onConnectGmail} />
          <Footer onOpenLegalPage={onOpenLegalPage} className="p-0 pt-2 text-xs" />
        </div>
      </footer>
    </div>
  );
};
