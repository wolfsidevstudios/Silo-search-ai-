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


interface SearchInputProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  large?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, initialValue = '', large = false }) => {
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
    recognition.lang = 'en-US';

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
  }, []);

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

  const containerClasses = large 
    ? "p-2 pl-6 rounded-full shadow-lg" 
    : "p-1 pl-4 rounded-full border border-gray-200";
    
  const inputClasses = large 
    ? "text-lg" 
    : "text-base";

  const buttonClasses = large
    ? "w-12 h-12"
    : "w-9 h-9";

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center w-full bg-white transition-shadow duration-300 focus-within:shadow-xl ${containerClasses}`}
    >
      <SearchIcon />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask anything..."
        className={`w-full h-full px-4 bg-transparent outline-none border-none ${inputClasses}`}
      />
      {hasRecognitionSupport && (
        <button
            type="button"
            onClick={handleMicClick}
            className={`flex-shrink-0 flex items-center justify-center rounded-full transition-colors mr-2 ${buttonClasses} ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-gray-100 text-gray-600'}`}
            aria-label={isListening ? 'Stop listening' : 'Start voice search'}
        >
            <MicrophoneIcon className={`${isListening ? 'text-red-500' : 'text-gray-600'}`} />
        </button>
      )}
      <button
        type="submit"
        className={`flex-shrink-0 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors ${buttonClasses}`}
      >
        <ArrowRightIcon />
      </button>
    </form>
  );
};