import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

// FIX: Add type definitions for Web Speech API to resolve TypeScript errors. These types are not part of the standard TypeScript library.
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

const GmailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
);


interface SearchInputProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  isLarge?: boolean;
  isGlossy?: boolean;
  speechLanguage: 'en-US' | 'es-ES';
  onConnectGmail: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, initialValue = '', isLarge = false, isGlossy = false, speechLanguage, onConnectGmail }) => {
  const [query, setQuery] = useState(initialValue);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setQuery(transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [speechLanguage]);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      recognitionRef.current?.stop();
    }
    onSearch(query);
  };

  const hasRecognitionSupport = !!recognitionRef.current;

  const containerClasses = [
    'flex items-center w-full transition-shadow duration-300 focus-within:shadow-xl',
    isLarge ? 'p-2 pl-6 rounded-full shadow-lg' : 'p-1 pl-4 rounded-full',
    isGlossy 
      ? 'bg-white/20 backdrop-blur-md border border-white/30'
      : 'bg-white border border-gray-200'
  ].join(' ');
    
  const inputClasses = [
    'w-full h-full px-4 bg-transparent outline-none border-none',
    isLarge ? 'text-lg' : 'text-base',
    isGlossy ? 'text-white placeholder-white/70' : ''
  ].join(' ');

  const buttonClasses = isLarge ? 'w-12 h-12' : 'w-9 h-9';
  
  const connectGmailButtonClasses = [
    'flex-shrink-0 flex items-center space-x-2 px-3 mr-2 rounded-full transition-colors text-sm',
    isLarge ? 'py-2' : 'py-1.5',
    isGlossy 
      ? 'bg-white/20 text-white hover:bg-white/30'
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  ].join(' ');
  
  const micButtonClasses = [
    'flex-shrink-0 flex items-center justify-center rounded-full transition-colors mr-2',
    buttonClasses,
    isListening 
      ? (isGlossy ? 'bg-red-500/50 text-white animate-pulse' : 'bg-red-100 text-red-500 animate-pulse')
      : (isGlossy ? 'hover:bg-white/20 text-white' : 'hover:bg-gray-100 text-gray-600')
  ].join(' ');
  
  const submitButtonClasses = [
      'flex-shrink-0 flex items-center justify-center rounded-full transition-colors',
      buttonClasses,
      isGlossy ? 'bg-white/30 text-white hover:bg-white/40' : 'bg-black text-white hover:bg-gray-800'
  ].join(' ');

  return (
    <form
      onSubmit={handleSubmit}
      className={containerClasses}
    >
      <SearchIcon className={isGlossy ? "text-white/80" : "text-gray-600"} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask anything..."
        className={inputClasses}
      />
      <button type="button" onClick={onConnectGmail} className={connectGmailButtonClasses}>
        <GmailIcon className="w-4 h-4" />
        <span className="font-medium">Connect Gmail</span>
      </button>
      {hasRecognitionSupport && (
        <button
            type="button"
            onClick={handleMicClick}
            className={micButtonClasses}
            aria-label={isListening ? 'Stop listening' : 'Start voice search'}
        >
            <MicrophoneIcon className={isListening ? (isGlossy ? 'text-white' : 'text-red-500') : (isGlossy ? 'text-white/80' : 'text-gray-600')} />
        </button>
      )}
      <button
        type="submit"
        className={submitButtonClasses}
      >
        <ArrowRightIcon />
      </button>
    </form>
  );
};