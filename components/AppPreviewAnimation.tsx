import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';

const scenes = [
  { id: 'search', duration: 4000 },
  { id: 'summary', duration: 5000 },
  { id: 'chat', duration: 5000 },
];

export const AppPreviewAnimation: React.FC = () => {
  const [sceneIndex, setSceneIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSceneIndex((prevIndex) => (prevIndex + 1) % scenes.length);
    }, scenes[sceneIndex].duration);

    return () => clearInterval(interval);
  }, [sceneIndex]);

  const currentScene = scenes[sceneIndex].id;

  return (
    <div className="preview-container">
      <div className="preview-header">
        <div className="preview-dots">
          <div className="preview-dot" style={{ backgroundColor: '#f87171' }}></div>
          <div className="preview-dot" style={{ backgroundColor: '#fbbF24' }}></div>
          <div className="preview-dot" style={{ backgroundColor: '#4ade80' }}></div>
        </div>
      </div>

      <div className="relative w-full h-full">
        {/* Scene 1: Search */}
        <div className={`preview-scene ${currentScene === 'search' ? 'active' : ''} flex flex-col justify-center items-center text-center`}>
            <div className="flex items-center space-x-2 text-gray-700">
                <LogoIcon className="w-7 h-7" />
                <span className="text-lg font-semibold">Silo Search</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Ask anything...</p>
            <div className="mt-4 flex items-center w-full max-w-xs p-2 pl-4 rounded-full shadow-lg bg-white border border-gray-200">
                <SearchIcon className="text-gray-500 w-5 h-5" />
                <div className="ml-2 text-gray-700 text-sm flex-grow text-left">
                    {currentScene === 'search' && <span className="typing-effect">Latest breakthroughs in AI?</span>}
                </div>
                <button className="ml-auto flex-shrink-0 w-10 h-10 flex items-center justify-center bg-black text-white rounded-full">
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
        
        {/* Scene 2: Summary & Links */}
        <div className={`preview-scene ${currentScene === 'summary' ? 'active' : ''} flex flex-col justify-center items-center text-center w-full`}>
            <div className="w-full max-w-xs">
                <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <SparklesIcon className="w-5 h-5" />
                    <span>Instant AI Summary</span>
                </div>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg scene-summary-box">
                     <div className="space-y-1.5">
                         <div className="h-2.5 w-full bg-gray-200 rounded-full animate-pulse"></div>
                         <div className="h-2.5 w-5/6 bg-gray-200 rounded-full animate-pulse"></div>
                         <div className="h-2.5 w-3/4 bg-gray-200 rounded-full animate-pulse"></div>
                     </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-sm mt-6">
                    <LinkIcon className="w-5 h-5" />
                    <span>Verified Sources</span>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                    <div className="px-3 py-1 text-xs bg-gray-200 rounded-full">Source 1</div>
                    <div className="px-3 py-1 text-xs bg-gray-200 rounded-full">Source 2</div>
                    <div className="px-3 py-1 text-xs bg-gray-200 rounded-full">Source 3</div>
                </div>
            </div>
        </div>

        {/* Scene 3: Chat */}
        <div className={`preview-scene ${currentScene === 'chat' ? 'active' : ''} flex flex-col justify-end`}>
            <div className="scene-chat-modal p-4 flex flex-col">
                <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm mb-4">
                    <MessageSquareIcon className="w-5 h-5" />
                    <span>Follow-up with Chat</span>
                </div>
                <div className="space-y-3 text-xs w-full max-w-xs mx-auto">
                    <div className="p-2 bg-gray-100 rounded-lg max-w-xs text-left">Here's the summary of AI breakthroughs.</div>
                    <div className="p-2 bg-black text-white rounded-lg max-w-xs ml-auto text-left">
                        {currentScene === 'chat' && <span className="typing-effect">Explain in simpler terms.</span>}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};