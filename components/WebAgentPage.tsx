import React, { useState, useRef, useEffect } from 'react';
import { Header } from './Header';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { CursorIcon } from './icons/CursorIcon';
import { GoogleGenAI, Chat } from "@google/genai";
import type { UserProfile, ChatMessage } from '../types';
import { LogoIcon } from './icons/LogoIcon';

const SITES = {
  wiktionary: { name: 'Wiktionary', baseUrl: 'https://en.wiktionary.org/wiki/Special:Search', searchUrl: 'https://en.wiktionary.org/wiki/Special:Search?search=' },
  archive: { name: 'Internet Archive', baseUrl: 'https://archive.org/', searchUrl: 'https://archive.org/search?query=' },
  openstreetmap: { name: 'OpenStreetMap', baseUrl: 'https://www.openstreetmap.org/', searchUrl: 'https://www.openstreetmap.org/search?query=' },
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
  
  const setupChat = () => {
    if (!geminiApiKey) return;
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-pro',
      config: {
        systemInstruction: "You are a sophisticated AI web agent designed to interact with websites on behalf of the user. Your purpose is to understand user commands, navigate to the correct pages, and interpret the content to provide helpful summaries and answers. When a user asks you to search for something on a specific website, you will first acknowledge the command, for instance, 'Understood. Searching Wikipedia for \"Quantum Physics\"...'. After you have navigated to the page (which happens instantly from your perspective), you should analyze its likely structure and content based on the user's query and the website's purpose. Then, provide a concise summary of what the user should expect to find. For example: 'I've loaded the search results on Wikipedia for \"Quantum Physics\". The main article will likely cover its history, foundational principles like superposition and entanglement, key experiments, and modern applications. What specific information are you interested in?' Always be proactive, conversational, and aim to guide the user to their desired information efficiently.",
        thinkingConfig: { thinkingBudget: 8192 },
      }
    });
  }

  useEffect(() => {
    setupChat();
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
    const userMessage: ChatMessage = { role: 'user', text: `Search for "${query}" on ${siteDetails.name}.` };
    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');

    // Start AI call in background
    const aiPromise = chatRef.current?.sendMessage({ message: userMessage.text });

    // Simulate cursor movement
    setCursorPosition({ x: 40, y: 15 }); // Move to a plausible search bar location
    await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1s
    
    setCursorPosition({ x: 75, y: 15 }); // Move to plausible search button location
    await new Promise(resolve => setTimeout(resolve, 800)); // wait 0.8s
    
    // Navigate iframe
    const fullUrl = `${siteDetails.searchUrl}${encodeURIComponent(query)}`;
    setIframeUrl(fullUrl);
    await new Promise(resolve => setTimeout(resolve, 500));
    setCursorPosition({ x: 50, y: 50 }); // Reset cursor to center
    
    try {
      if (!chatRef.current) throw new Error("Chat not initialized.");
      const response = await aiPromise;
      if (response) {
        setChatHistory(prev => [...prev, { role: 'model', text: response.text }]);
      }
    } catch (err) {
      console.error("AI chat error:", err);
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSiteSelect = (site: SiteKey) => {
    setSelectedSite(site);
    setIframeUrl(SITES[site].baseUrl);
    setChatHistory(prev => [...prev, { role: 'model', text: `Okay, I've loaded ${SITES[site].name}. What should I search for?` }]);
    setUserInput('');
  };
  
  const handleNewChat = () => {
    setupChat();
    setChatHistory([{ role: 'model', text: 'Hello! I am your AI Web Agent. What would you like to search for? Please type your query and select a website below.' }]);
    setIframeUrl(null);
    setSelectedSite(null);
    setUserInput('');
  };


  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header {...headerProps} onHome={onHome} showHomeButton={true} />
      <div className="flex-grow flex flex-col md:flex-row min-h-0">
        {/* Chat Panel */}
        <div className="w-full md:w-1/3 flex flex-col bg-white border-r">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Web Agent Chat</h2>
                <button onClick={handleNewChat} className="px-3 py-1 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800">
                    New Chat
                </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(SITES) as SiteKey[]).map(key => (
                <button
                  key={key}
                  onClick={() => handleSiteSelect(key)}
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
            <iframe src={iframeUrl} className="w-full h-full border-none" title="Web Agent Browser" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
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