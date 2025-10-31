
import React, { useState, useRef, useEffect } from 'react';
import { Header } from './Header';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { CursorIcon } from './icons/CursorIcon';
import { GoogleGenAI, Chat } from "@google/genai";
import type { UserProfile, ChatMessage } from '../types';
import { LogoIcon } from './icons/LogoIcon';

const SITES = {
  wiktionary: { name: 'Wiktionary', url: 'https://en.wiktionary.org/wiki/Special:Search?search=' },
  archive: { name: 'Internet Archive', url: 'https://archive.org/search?query=' },
  openstreetmap: { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/search?query=' },
};
type SiteKey = keyof typeof SITES;

interface WebAgentPageProps {
  initialQuery: string;
  geminiApiKey: string;
  onHome: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

export const WebAgentPage: React.FC<WebAgentPageProps> = ({ initialQuery, geminiApiKey, onHome, ...headerProps }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState<SiteKey | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 }); // Center of iframe

  useEffect(() => {
    if (!geminiApiKey) return;
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful AI web agent assistant. You are helping a user search specific websites. Keep your responses concise and conversational, confirming the actions you are taking for the user."
      }
    });
    setChatHistory([{ role: 'model', text: 'Hello! I am your AI Web Agent. What would you like to search for? Please type your query and select a website below.' }]);
  }, [geminiApiKey]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [chatHistory]);
  
  const handleSearch = async (query: string, site: SiteKey) => {
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    const siteDetails = SITES[site];
    const fullUrl = `${siteDetails.url}${encodeURIComponent(query)}`;
    const userMessage: ChatMessage = { role: 'user', text: `Search for "${query}" on ${siteDetails.name}.` };
    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIframeUrl(null); // Clear previous content

    // Simulate cursor moving to iframe
    setCursorPosition({ x: Math.random() * 40 + 30, y: Math.random() * 40 + 30 });

    try {
      if (!chatRef.current) throw new Error("Chat not initialized.");
      const response = await chatRef.current.sendMessage({ message: userMessage.text });
      setChatHistory(prev => [...prev, { role: 'model', text: response.text }]);
      setIframeUrl(fullUrl);
    } catch (err) {
      console.error("AI chat error:", err);
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header {...headerProps} onHome={onHome} showHomeButton={true} />
      <div className="flex-grow flex flex-col md:flex-row min-h-0">
        {/* Chat Panel */}
        <div className="w-full md:w-1/3 flex flex-col bg-white border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold">Web Agent Chat</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(SITES) as SiteKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => setSelectedSite(key)}
                  className={`px-3 py-1 text-sm rounded-full border ${selectedSite === key ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-100'}`}
                >
                  {SITES[key].name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg py-2 px-3 max-w-xs ${msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && <div className="text-center text-gray-500">Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t bg-white">
            <form onSubmit={(e) => { e.preventDefault(); if(selectedSite) handleSearch(userInput, selectedSite); }} className="flex items-center space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={selectedSite ? `Search ${SITES[selectedSite].name}...` : "Select a site first..."}
                className="w-full px-4 py-2 bg-gray-100 rounded-full outline-none border-2 border-transparent focus:border-gray-300"
                disabled={!selectedSite || isLoading}
              />
              <button
                type="submit"
                disabled={!selectedSite || isLoading || !userInput.trim()}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-black text-white rounded-full disabled:bg-gray-300"
              >
                <ArrowUpIcon />
              </button>
            </form>
          </div>
        </div>
        {/* Browser Panel */}
        <div className="w-full md:w-2/3 bg-gray-200 relative">
          {iframeUrl ? (
            <iframe src={iframeUrl} className="w-full h-full border-none" title="Web Agent Browser" sandbox="allow-scripts allow-same-origin"></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <LogoIcon className="w-16 h-16 mb-4 opacity-50"/>
              <p>The selected website will be displayed here.</p>
            </div>
          )}
          <CursorIcon className="absolute w-6 h-6 text-black transition-all duration-500 transform -translate-y-1" style={{ left: `${cursorPosition.x}%`, top: `${cursorPosition.y}%`, pointerEvents: 'none' }}/>
        </div>
      </div>
    </div>
  );
};
