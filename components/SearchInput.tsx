import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { MoreVerticalIcon } from './icons/MoreVerticalIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { LayersIcon } from './icons/LayersIcon';
import { MailIcon } from './icons/MailIcon';
import { NotionIcon } from './icons/NotionIcon';
import { LockIcon } from './icons/LockIcon';
import { CloseIcon } from './icons/CloseIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { WikipediaIcon } from './icons/WikipediaIcon';
import { RedditIcon } from './icons/RedditIcon';
import { PlaneIcon } from './icons/PlaneIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { ImageIcon } from './icons/ImageIcon';
import { BrowserIcon } from './icons/BrowserIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import type { SummarizationSource } from '../types';

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

interface CustomWindow extends Window {
  SpeechRecognition: SpeechRecognitionStatic;
  webkitSpeechRecognition: SpeechRecognitionStatic;
}
declare const window: CustomWindow;

type CreatorPlatform = 'youtube' | 'tiktok' | 'instagram';

interface SearchInputProps {
  onSearch: (query: string, options: { studyMode?: boolean; mapSearch?: boolean; travelSearch?: boolean; shoppingSearch?: boolean; pexelsSearch?: boolean; agentSearch?: boolean; creatorSearch?: boolean; creatorPlatform?: CreatorPlatform; researchSearch?: boolean; }) => void;
  initialValue?: string;
  isLarge?: boolean;
  isGlossy?: boolean;
  speechLanguage: 'en-US' | 'es-ES';
  onOpenComingSoonModal: () => void;
  isStudyMode: boolean;
  setIsStudyMode: (isStudyMode: boolean) => void;
  variant?: 'home';
  summarizationSource: SummarizationSource | null;
  onOpenSummarizeSourceSelector: () => void;
  onClearSummarizationSource: () => void;
  showModes?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, initialValue = '', isLarge = false, isGlossy = false, speechLanguage, onOpenComingSoonModal, isStudyMode, setIsStudyMode, variant, summarizationSource, onOpenSummarizeSourceSelector, onClearSummarizationSource, showModes = true }) => {
  const [query, setQuery] = useState(initialValue);
  const [isListening, setIsListening] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const [activeMode, setActiveMode] = useState<'default' | 'map' | 'travel' | 'shop' | 'pexels' | 'agent' | 'creator' | 'research'>('default');
  const [creatorPlatform, setCreatorPlatform] = useState<CreatorPlatform>('youtube');

  useEffect(() => {
    if (summarizationSource) {
        setActiveMode('default');
        setIsStudyMode(false);
    }
  }, [summarizationSource, setIsStudyMode]);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speechLanguage;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
      setQuery(transcript);
    };
    recognitionRef.current = recognition;
    return () => { recognition.stop(); };
  }, [speechLanguage]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && moreButtonRef.current && !moreButtonRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) recognitionRef.current?.stop();
    
    const options = {
        studyMode: isStudyMode,
        mapSearch: activeMode === 'map',
        travelSearch: activeMode === 'travel',
        shoppingSearch: activeMode === 'shop',
        pexelsSearch: activeMode === 'pexels',
        agentSearch: activeMode === 'agent',
        creatorSearch: activeMode === 'creator',
        creatorPlatform: activeMode === 'creator' ? creatorPlatform : undefined,
        researchSearch: activeMode === 'research',
    };

    if (['map', 'travel', 'shop', 'pexels', 'agent', 'creator', 'research'].includes(activeMode) && !query.trim()) {
        let modeName = activeMode.charAt(0).toUpperCase() + activeMode.slice(1);
        if (activeMode === 'map') modeName = 'Map Search';
        if (activeMode === 'travel') modeName = 'Travel Planner';
        if (activeMode === 'shop') modeName = 'Shopping Agent';
        if (activeMode === 'pexels') modeName = 'Media Search';
        if (activeMode === 'agent') modeName = 'Web Agent';
        if (activeMode === 'creator') modeName = 'Creator Mode';
        if (activeMode === 'research') modeName = 'Deep Research';
        alert(`Please enter a query to use ${modeName}.`);
        return;
    }

    onSearch(query, options);
  };
  
  const handleModeToggle = (mode: 'map' | 'travel' | 'shop' | 'pexels' | 'agent' | 'creator' | 'research') => {
    if (summarizationSource) {
        alert("A file is selected for summarization. Clear the file to use other modes.");
        return;
    }
    if (isStudyMode) {
      setIsStudyMode(false);
    }
    setActiveMode(prev => prev === mode ? 'default' : mode);
  };

  const handleStudyToggle = () => {
    if (summarizationSource) {
        alert("A file is selected for summarization. Clear the file to use Study Mode.");
        return;
    }
    if (activeMode !== 'default') {
      setActiveMode('default');
    }
    setIsStudyMode(!isStudyMode);
  };

  const hasRecognitionSupport = !!recognitionRef.current;

  const handleExternalSearch = (urlTemplate: string) => {
    if (!query.trim()) {
        alert("Please enter a search query first.");
        return;
    }
    window.open(urlTemplate.replace('{query}', encodeURIComponent(query)), '_blank');
    setDropdownOpen(false);
  };
  
  if (variant === 'home') {
    return (
      <div>
        <form onSubmit={handleSubmit} className="w-full p-4 rounded-3xl shadow-xl bg-white border border-gray-200 flex flex-col" style={{ minHeight: '180px' }}>
            {summarizationSource && (
                <div className="flex items-center justify-center space-x-2 px-3 py-1.5 mb-2 text-sm font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200 self-center">
                    <FileTextIcon className="w-4 h-4" />
                    <span className="truncate max-w-xs">Summarizing: {summarizationSource.name}</span>
                    <button type="button" onClick={onClearSummarizationSource} className="p-0.5 rounded-full hover:bg-blue-200"><CloseIcon className="w-3 h-3" /></button>
                </div>
            )}
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything or summarize a file..."
                className="w-full flex-grow bg-transparent outline-none border-none resize-none text-lg"
            />

            <div className="flex items-center justify-between mt-auto pt-4">
                {/* Left side toolbar */}
                <div className="flex items-center space-x-1">
                    <button type="button" title="Search" className="p-2 rounded-lg bg-gray-100 text-black ring-1 ring-gray-300">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                    <button type="button" title="Summarize from source" onClick={onOpenSummarizeSourceSelector} className={`p-2 rounded-lg text-gray-500 ${summarizationSource ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>
                        <FileTextIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Right side buttons */}
                <div className="flex items-center space-x-2">
                    {hasRecognitionSupport && (
                        <button type="button" onClick={handleMicClick} className={`flex-shrink-0 flex items-center justify-center rounded-full transition-colors w-12 h-12 ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-gray-100 text-gray-600'}`} aria-label={isListening ? 'Stop listening' : 'Start voice search'}>
                            <MicrophoneIcon className={isListening ? 'text-red-500' : 'text-gray-600'} />
                        </button>
                    )}
                    <button type="submit" className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-transform hover:scale-105" aria-label="Submit search">
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>
        </form>
         {showModes && (
            <>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-4">
                {[
                    { id: 'study', label: 'Study Mode', Icon: BookOpenIcon, action: handleStudyToggle, isActive: isStudyMode },
                    { id: 'research', label: 'Deep Research', Icon: LayersIcon, action: () => handleModeToggle('research'), isActive: activeMode === 'research' },
                    { id: 'map', label: 'Map Search', Icon: MapPinIcon, action: () => handleModeToggle('map'), isActive: activeMode === 'map' },
                    { id: 'travel', label: 'Travel Planner', Icon: PlaneIcon, action: () => handleModeToggle('travel'), isActive: activeMode === 'travel' },
                    { id: 'shop', label: 'Shopping Agent', Icon: ShoppingCartIcon, action: () => handleModeToggle('shop'), isActive: activeMode === 'shop' },
                    { id: 'creator', label: 'Creator Mode', Icon: LightbulbIcon, action: () => handleModeToggle('creator'), isActive: activeMode === 'creator' },
                    { id: 'pexels', label: 'Media Search', Icon: ImageIcon, action: () => handleModeToggle('pexels'), isActive: activeMode === 'pexels' },
                    { id: 'agent', label: 'Web Agent', Icon: BrowserIcon, action: () => handleModeToggle('agent'), isActive: activeMode === 'agent' },
                ].map(({ id, label, Icon, action, isActive }) => (
                    <button key={id} onClick={action} className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${isActive ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
            {activeMode === 'creator' && (
                <div className="mt-4 flex items-center justify-center gap-2" role="group" aria-label="Select a platform">
                    <span className="text-sm font-medium text-gray-600 mr-2">For:</span>
                    {[
                        { id: 'youtube', label: 'YouTube', Icon: YouTubeIcon },
                        { id: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
                        { id: 'instagram', label: 'Instagram', Icon: InstagramIcon },
                    ].map(({ id, label, Icon }) => (
                        <button key={id} onClick={() => setCreatorPlatform(id as CreatorPlatform)} className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${creatorPlatform === id ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>
            )}
            </>
         )}
      </div>
    );
  }

  const containerClasses = ['flex items-center w-full transition-shadow duration-300 focus-within:shadow-xl relative', isLarge ? 'p-2 pl-6 rounded-full shadow-lg' : 'p-1 pl-4 rounded-full', isGlossy ? 'bg-white/20 backdrop-blur-md border border-white/30' : 'bg-white border border-gray-200'].join(' ');
  const inputClasses = ['w-full h-full px-4 bg-transparent outline-none border-none', isLarge ? 'text-lg' : 'text-base', isGlossy ? 'text-white placeholder-white/70' : ''].join(' ');
  const buttonClasses = isLarge ? 'w-12 h-12' : 'w-9 h-9';
  const micButtonClasses = ['flex-shrink-0 flex items-center justify-center rounded-full transition-colors mr-1', buttonClasses, isListening ? (isGlossy ? 'bg-red-500/50 text-white animate-pulse' : 'bg-red-100 text-red-500 animate-pulse') : (isGlossy ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-600')].join(' ');
  const submitButtonClasses = ['flex-shrink-0 flex items-center justify-center rounded-full transition-colors', buttonClasses, isGlossy ? 'bg-white/30 text-white hover:bg-white/40' : 'bg-black text-white hover:bg-gray-800'].join(' ');
  
  return (
    <div>
      <form onSubmit={handleSubmit} className={containerClasses}>
        <SearchIcon className={isGlossy ? "text-white/80" : "text-gray-600"} />
        {summarizationSource && (
            <div className="flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 ml-2 mr-1 rounded-full text-sm bg-blue-100 text-blue-800">
                <FileTextIcon className="w-4 h-4" />
                <span className="font-medium truncate max-w-[100px]">{summarizationSource.name}</span>
                <button type="button" onClick={onClearSummarizationSource} className="p-0.5 rounded-full hover:bg-blue-200"><CloseIcon className="w-3 h-3" /></button>
            </div>
        )}
        {isStudyMode && !summarizationSource && (
            <div className="flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 ml-2 mr-1 rounded-full text-sm bg-green-100 text-green-800">
                <BookOpenIcon className="w-4 h-4" />
                <span className="font-medium">Study Mode</span>
                <button type="button" onClick={() => setIsStudyMode(false)} className="p-0.5 rounded-full hover:bg-green-200"><CloseIcon className="w-3 h-3" /></button>
            </div>
        )}
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask anything..." className={inputClasses} />
        <button type="button" onClick={onOpenSummarizeSourceSelector} className={`flex-shrink-0 flex items-center justify-center rounded-full transition-colors mr-1 ${buttonClasses} ${summarizationSource ? (isGlossy ? 'bg-blue-500/50 text-white' : 'bg-blue-100 text-blue-700') : (isGlossy ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-600')}`} aria-label="Summarize from a source">
            <FileTextIcon className={isGlossy && !summarizationSource ? 'text-white/80' : ''} />
        </button>
        {hasRecognitionSupport && ( <button type="button" onClick={handleMicClick} className={micButtonClasses} aria-label={isListening ? 'Stop listening' : 'Start voice search'}> <MicrophoneIcon className={isListening ? (isGlossy ? 'text-white' : 'text-red-500') : (isGlossy ? 'text-white/80' : 'text-gray-600')} /> </button> )}
        
        <button ref={moreButtonRef} type="button" onClick={() => setDropdownOpen(p => !p)} className={`flex-shrink-0 flex items-center justify-center rounded-full transition-colors mr-1 ${buttonClasses} ${isGlossy ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-600'}`} aria-label="More search options" aria-haspopup="true" aria-expanded={isDropdownOpen}>
          <MoreVerticalIcon className={isGlossy ? 'text-white/80' : 'text-gray-600'} />
        </button>

        {isDropdownOpen && (
          <div ref={dropdownRef} className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-2 z-20">
            <p className="px-4 pt-1 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Advanced Modes</p>
            <button onClick={() => { handleModeToggle('research'); setDropdownOpen(false); }} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <LayersIcon className="w-5 h-5 text-gray-500" /><span>Deep Research</span>
            </button>
            
            <div className="my-2 border-t border-gray-100"></div>
            <p className="px-4 pt-1 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Connected Apps</p>
            <button onClick={onOpenComingSoonModal} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 opacity-60">
              <MailIcon className="w-5 h-5 text-gray-500" /><span>Search in Gmail</span><LockIcon className="w-4 h-4 ml-auto text-gray-400" />
            </button>
            <button onClick={onOpenComingSoonModal} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 opacity-60">
              <NotionIcon className="w-5 h-5 text-gray-500" /><span>Search in Notion</span><LockIcon className="w-4 h-4 ml-auto text-gray-400" />
            </button>

            <div className="my-2 border-t border-gray-100"></div>
            <p className="px-4 pt-1 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Search Elsewhere</p>
            <button onClick={() => handleExternalSearch('https://www.youtube.com/results?search_query={query}')} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <YouTubeIcon className="w-5 h-5 text-gray-500" /><span>Search on YouTube</span>
            </button>
            <button onClick={() => handleExternalSearch('https://en.wikipedia.org/w/index.php?search={query}')} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <WikipediaIcon className="w-5 h-5 text-gray-500" /><span>Search on Wikipedia</span>
            </button>
            <button onClick={() => handleExternalSearch('https://www.reddit.com/search/?q={query}')} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <RedditIcon className="w-5 h-5 text-gray-500" /><span>Search on Reddit</span>
            </button>
          </div>
        )}

        <button type="submit" className={submitButtonClasses}> <ArrowRightIcon /> </button>
      </form>
      {showModes && (
        <>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-4">
          {[
              { id: 'study', label: 'Study Mode', Icon: BookOpenIcon, action: handleStudyToggle, isActive: isStudyMode },
              { id: 'research', label: 'Deep Research', Icon: LayersIcon, action: () => handleModeToggle('research'), isActive: activeMode === 'research' },
              { id: 'map', label: 'Map Search', Icon: MapPinIcon, action: () => handleModeToggle('map'), isActive: activeMode === 'map' },
              { id: 'travel', label: 'Travel Planner', Icon: PlaneIcon, action: () => handleModeToggle('travel'), isActive: activeMode === 'travel' },
              { id: 'shop', label: 'Shopping Agent', Icon: ShoppingCartIcon, action: () => handleModeToggle('shop'), isActive: activeMode === 'shop' },
              { id: 'creator', label: 'Creator Mode', Icon: LightbulbIcon, action: () => handleModeToggle('creator'), isActive: activeMode === 'creator' },
              { id: 'pexels', label: 'Media Search', Icon: ImageIcon, action: () => handleModeToggle('pexels'), isActive: activeMode === 'pexels' },
              { id: 'agent', label: 'Web Agent', Icon: BrowserIcon, action: () => handleModeToggle('agent'), isActive: activeMode === 'agent' },
          ].map(({ id, label, Icon, action, isActive }) => (
              <button key={id} onClick={action} className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${isActive ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
              </button>
          ))}
      </div>
      {activeMode === 'creator' && (
        <div className="mt-4 flex items-center justify-center gap-2" role="group" aria-label="Select a platform">
            <span className="text-sm font-medium text-gray-600 mr-2">For:</span>
            {[
                { id: 'youtube', label: 'YouTube', Icon: YouTubeIcon },
                { id: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
                { id: 'instagram', label: 'Instagram', Icon: InstagramIcon },
            ].map(({ id, label, Icon }) => (
                <button key={id} onClick={() => setCreatorPlatform(id as CreatorPlatform)} className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-full border transition-colors ${creatorPlatform === id ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}>
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                </button>
            ))}
        </div>
      )}
      </>
      )}
    </div>
  );
};
