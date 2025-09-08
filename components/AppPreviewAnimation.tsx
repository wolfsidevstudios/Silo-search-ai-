import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';

const scenes = [
  { id: 'search', duration: 12000 },
  { id: 'summary', duration: 18000 },
  { id: 'chat', duration: 25000 },
  { id: 'final', duration: 5000 },
];

export const AppPreviewAnimation: React.FC = () => {
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSceneIndex((prevIndex) => (prevIndex + 1) % scenes.length);
    }, scenes[sceneIndex].duration);

    return () => clearInterval(interval);
  }, [sceneIndex]);

  const currentSceneId = scenes[sceneIndex].id;

  return (
    <div className="preview-container">
      <div className="preview-header">
        <div className="preview-dots">
          <div className="preview-dot" style={{ backgroundColor: '#f87171' }}></div>
          <div className="preview-dot" style={{ backgroundColor: '#fbbF24' }}></div>
          <div className="preview-dot" style={{ backgroundColor: '#4ade80' }}></div>
        </div>
      </div>

      <div className="relative w-full h-full bg-gray-50">
        {/* Scene 1: Search */}
        <div className={`preview-scene scene-search ${currentSceneId === 'search' ? 'active' : ''}`}>
            <div className="flex flex-col items-center space-y-2">
                <LogoIcon className="w-8 h-8 animated-element brand-logo" />
                <span className="text-xl font-semibold text-gray-800 animated-element brand-title">Silo Search</span>
            </div>
            <div className="mt-4 flex items-center w-full max-w-sm p-1.5 pl-4 rounded-full shadow-lg bg-white border border-gray-200 animated-element search-bar">
                <SearchIcon className="text-gray-400 w-5 h-5" />
                <div className="ml-2 text-gray-700 text-sm flex-grow text-left">
                    <span className="typing-text">plan a 1-week itinerary for a solo trip to tokyo</span>
                </div>
                <button className="ml-auto flex-shrink-0 w-9 h-9 flex items-center justify-center bg-black text-white rounded-full animated-element search-button">
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
        
        {/* Scene 2: Summary & Links */}
        <div className={`preview-scene scene-summary ${currentSceneId === 'summary' ? 'active' : ''}`}>
            <div className="w-full max-w-md">
                 <div className="text-gray-500 text-sm mb-4 animated-element thinking-text">
                    <SparklesIcon className="w-5 h-5 inline-block mr-1.5" />
                    <span>Synthesizing the best of the web...</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-sm animated-element summary-title">
                    <SparklesIcon className="w-5 h-5" />
                    <span>AI Summary</span>
                </div>
                <div className="mt-2 p-3 bg-white rounded-lg border animated-element summary-box text-left text-xs text-gray-700 space-y-2">
                     <p className="animated-element summary-p1">For a 1-week solo trip to Tokyo, focus on iconic districts. Start in Shinjuku for its vibrant nightlife and the serene Gyoen National Garden. Then, explore Shibuya to experience the famous scramble crossing and trendy youth culture.</p>
                     <p className="animated-element summary-p2">Dedicate time to Akihabara for electronics and anime, and Asakusa for the historic Senso-ji Temple. A day trip to nearby Hakone for views of Mt. Fuji is highly recommended if time permits.</p>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-sm mt-4 animated-element links-title">
                    <LinkIcon className="w-5 h-5" />
                    <span>Verified Sources</span>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                    <div className="px-2 py-1 text-xs bg-gray-200 rounded-full animated-element link-tag" style={{ animationDelay: '5.5s' }}>Japan Guide</div>
                    <div className="px-2 py-1 text-xs bg-gray-200 rounded-full animated-element link-tag" style={{ animationDelay: '5.6s' }}>Time Out Tokyo</div>
                    <div className="px-2 py-1 text-xs bg-gray-200 rounded-full animated-element link-tag" style={{ animationDelay: '5.7s' }}>TripAdvisor</div>
                    <div className="px-2 py-1 text-xs bg-gray-200 rounded-full animated-element link-tag" style={{ animationDelay: '5.8s' }}>Lonely Planet</div>
                </div>
                 <div className="text-gray-500 text-sm mt-4 animated-element videos-title">
                    <span>Top Video Results</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="bg-white rounded border p-1 animated-element video-card" style={{ animationDelay: '7.0s' }}><div className="w-full aspect-video bg-gray-300 rounded-sm"></div></div>
                    <div className="bg-white rounded border p-1 animated-element video-card" style={{ animationDelay: '7.2s' }}><div className="w-full aspect-video bg-gray-300 rounded-sm"></div></div>
                    <div className="bg-white rounded border p-1 animated-element video-card" style={{ animationDelay: '7.4s' }}><div className="w-full aspect-video bg-gray-300 rounded-sm"></div></div>
                </div>
            </div>
        </div>

        {/* Scene 3: Chat */}
        <div className={`preview-scene scene-chat ${currentSceneId === 'chat' ? 'active' : ''}`}>
            <div className="w-full max-w-sm">
                <button className="flex items-center justify-center space-x-2 text-gray-700 text-sm mb-4 bg-white p-2 px-4 rounded-full shadow border animated-element chat-button">
                    <MessageSquareIcon className="w-5 h-5" />
                    <span>Enter Chat Mode</span>
                </button>
                <div className="space-y-3 text-sm w-full text-left">
                    <div className="p-2.5 bg-gray-200 rounded-xl max-w-[85%] animated-element chat-bubble chat-bubble-ai" style={{ animationDelay: '1.5s' }}>What are some must-see districts for a first-timer?</div>
                    <div className="flex justify-end">
                        <div className="p-2.5 bg-black text-white rounded-xl max-w-[85%] animated-element chat-bubble chat-bubble-user" style={{ animationDelay: '3.5s' }}>Shibuya for the crossing, Shinjuku for nightlife, and Akihabara for anime culture.</div>
                    </div>
                     <div className="p-2.5 bg-gray-200 rounded-xl max-w-[85%] animated-element chat-bubble chat-bubble-ai" style={{ animationDelay: '6s' }}>Is it expensive to eat there?</div>
                    <div className="flex justify-end">
                      <div className="p-2.5 bg-black text-white rounded-xl max-w-[85%] animated-element chat-bubble chat-bubble-user" style={{ animationDelay: '8s' }}>Not at all! There are tons of budget-friendly options like ramen shops, konbini (convenience stores), and standing soba noodle stalls.</div>
                    </div>
                    <div className="flex justify-start">
                        <div className="p-2.5 bg-gray-200 rounded-xl animated-element chat-typing typing-indicator" style={{ animationDelay: '11.5s' }}>
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                    <div className="p-2.5 bg-gray-200 rounded-xl max-w-[85%] animated-element chat-bubble chat-bubble-ai" style={{ animationDelay: '13.5s' }}>Awesome, thanks for the tips!</div>
                </div>
            </div>
        </div>

        {/* Scene 4: Final */}
        <div className={`preview-scene scene-final ${currentSceneId === 'final' ? 'active' : ''}`}>
          <div className="flex flex-col items-center text-center">
            <LogoIcon className="w-12 h-12 animated-element final-logo" />
            <h3 className="text-2xl font-bold mt-3 text-gray-800 animated-element final-title">Silo Search</h3>
            <p className="text-gray-500 animated-element final-subtitle">Search, Summarized. Instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};