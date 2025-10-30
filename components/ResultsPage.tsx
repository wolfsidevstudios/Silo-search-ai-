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
import { FlashcardView } from './FlashcardView';
import { QuizView } from './QuizView';
import { CloseIcon } from './icons/CloseIcon';
import { useIsMobile } from '../hooks/useIsMobile';

interface ResultsPageProps {
  result: SearchResult;
  originalQuery: string;
  onSearch: (query: string, options: { studyMode?: boolean; mapSearch?: boolean; travelSearch?: boolean }) => void;
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
  onOpenComingSoonModal: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

type ResultTab = 'summary' | 'videos' | 'flashcards' | 'quiz';

export const ResultsPage: React.FC<ResultsPageProps> = ({ result, originalQuery, onSearch, onHome, onEnterChatMode, isTemporaryMode, onToggleSidebar, onToggleTemporaryMode, onOpenSettings, userProfile, onLogout, searchInputSettings, speechLanguage, onOpenComingSoonModal, onOpenLegalPage }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(result.isStudyQuery || false);
  const [activeTab, setActiveTab] = useState<ResultTab>('summary');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleOpenVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const handleCloseVideo = () => {
    setSelectedVideoId(null);
  };
  
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
    onSearch(originalQuery, { studyMode: isStudyMode });
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
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const renderSummaryContent = () => (
    <>
      <p className="text-lg leading-relaxed text-gray-800 text-center">
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
        <button onClick={handleCopy} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"><CopyIcon /><span>Copy</span></button>
        <button onClick={handleDownload} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"><DownloadIcon /><span>Download</span></button>
        <button onClick={handleToggleSpeech} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors" aria-label={isSpeaking ? 'Stop reading aloud' : 'Read summary aloud'}>{isSpeaking ? <VolumeXIcon /> : <VolumeUpIcon />}<span>{isSpeaking ? 'Stop' : 'Listen'}</span></button>
        <button onClick={handleReSearch} className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"><RedoIcon /><span>Re-search</span></button>
      </div>
      {result.quickLinks && result.quickLinks.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {result.quickLinks.slice(0, 5).map((link, index) => (
            <a key={index} href={link.uri} target="_blank" rel="noopener noreferrer" className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm hover:bg-gray-200 transition-colors">{link.title}</a>
          ))}
        </div>
      )}
    </>
  );

  const renderVideosContent = () => (
    <div className="mt-8 w-full">
      {result.videos && result.videos.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold text-center mb-6">Top Video Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.videos.map(video => (
              <button key={video.id} onClick={() => handleOpenVideo(video.id)} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group text-left w-full">
                <div className="relative">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 leading-tight group-hover:text-black truncate">{video.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{video.channelTitle}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">No relevant videos found.</p>
      )}
    </div>
  );

  const renderStudyTabs = () => (
    <div className="mb-8 flex justify-center">
        <div className="flex space-x-2 bg-gray-200 p-1 rounded-full">
            <button onClick={() => setActiveTab('summary')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeTab === 'summary' ? 'bg-white shadow' : 'text-gray-600'}`}>Summary</button>
            {result.videos && result.videos.length > 0 && <button onClick={() => setActiveTab('videos')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeTab === 'videos' ? 'bg-white shadow' : 'text-gray-600'}`}>Videos</button>}
            {result.flashcards && result.flashcards.length > 0 && <button onClick={() => setActiveTab('flashcards')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeTab === 'flashcards' ? 'bg-white shadow' : 'text-gray-600'}`}>Flashcards</button>}
            {result.quiz && result.quiz.length > 0 && <button onClick={() => setActiveTab('quiz')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${activeTab === 'quiz' ? 'bg-white shadow' : 'text-gray-600'}`}>Quiz</button>}
        </div>
    </div>
  );

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
      
      {selectedVideoId && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" 
          onClick={handleCloseVideo}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
              ></iframe>
              <button
                  onClick={handleCloseVideo}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  aria-label="Close video player"
              >
                  <CloseIcon className="w-5 h-5" />
              </button>
          </div>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center justify-center px-4 pb-32">
        <div className="w-full max-w-4xl">
          {result.isStudyQuery && renderStudyTabs()}
          
          {result.isStudyQuery ? (
            <>
              {activeTab === 'summary' && renderSummaryContent()}
              {activeTab === 'videos' && renderVideosContent()}
              {activeTab === 'flashcards' && result.flashcards && <FlashcardView flashcards={result.flashcards} />}
              {activeTab === 'quiz' && result.quiz && <QuizView quiz={result.quiz} />}
            </>
          ) : (
            <>
              {renderSummaryContent()}
              {renderVideosContent()}
            </>
          )}

        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-2 sm:p-4 bg-white/80 backdrop-blur-sm">
        <div className="max-w-xl mx-auto">
          <SearchInput onSearch={(query, options) => onSearch(query, { studyMode: isStudyMode, ...options })} isLarge={isMobile ? false : searchInputSettings.isLarge} isGlossy={searchInputSettings.isGlossy} speechLanguage={speechLanguage} onOpenComingSoonModal={onOpenComingSoonModal} isStudyMode={isStudyMode} setIsStudyMode={setIsStudyMode} />
          <Footer onOpenLegalPage={onOpenLegalPage} className="p-0 pt-2 text-xs" />
        </div>
      </footer>
    </div>
  );
};