import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';

const scenes = [
  { id: 'search', duration: 4000 },
  { id: 'summary', duration: 5500 },
  { id: 'chat', duration: 6000 },
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
        <div className={`preview-scene ${currentSceneId === 'search' ? 'active' : ''}`}>
            <div className="flex flex-col items-center space-y-2 animated-element">
                <LogoIcon className="w-8 h-8" />
                <span className="text-xl font-semibold text-gray-800">Silo Search</span>
            </div>
            <div className="mt-4 flex items-center w-full max-w-sm p-1.5 pl-4 rounded-full shadow-lg bg-white border border-gray-200 animated-element search-bar">
                <SearchIcon className="text-gray-400 w-5 h-5" />
                <div className="ml-2 text-gray-700 text-sm flex-grow text-left">
                    <span className="typing-text">Latest breakthroughs in AI?</span>
                </div>
                <button className="ml-auto flex-shrink-0 w-9 h-9 flex items-center justify-center bg-black text-white rounded-full">
                    <ArrowRightIcon />
                </button>
            </div>
        </div>
        
        {/* Scene 2: Summary & Links */}
        <div className={`preview-scene ${currentSceneId === 'summary' ? 'active' : ''}`}>
            <div className="w-full max-w-sm">
                <div className="flex items-center space-x-2 text-gray-500 text-sm animated-element summary-title">
                    <SparklesIcon className="w-5 h-5" />
                    <span>Instant AI Summary</span>
                </div>
                <div className="mt-2 p-4 bg-white rounded-lg border animated-element summary-box">
                     <p className="text-left text-sm text-gray-700">Recent AI breakthroughs include advancements in large language models, leading to more capable assistants, and new diffusion techniques for hyper-realistic image generation.</p>
                     <div className="mt-3 space-y-2 shimmer">
                         <div className="h-2.5 w-full bg-gray-300 rounded-full"></div>
                         <div className="h-2.5 w-5/6 bg-gray-300 rounded-full"></div>
                     </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-sm mt-6 animated-element links-title">
                    <LinkIcon className="w-5 h-5" />
                    <span>Verified Sources</span>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                    <div className="px-3 py-1 text-xs bg-gray-200 rounded-full animated-element link-tag-1">TechCrunch</div>
                    <div className="px-3 py-1 text-xs bg-gray-200 rounded-full animated-element link-tag-2">The Verge</div>
                    <div className="px-3 py-1 text-xs bg-gray-200 rounded-full animated-element link-tag-3">Wired</div>
                </div>
            </div>
        </div>

        {/* Scene 3: Chat */}
        <div className={`preview-scene ${currentSceneId === 'chat' ? 'active' : ''}`}>
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm mb-4 animated-element chat-title">
                    <MessageSquareIcon className="w-5 h-5" />
                    <span>Follow-up with Chat</span>
                </div>
                <div className="space-y-3 text-sm w-full">
                    <div className="p-2.5 bg-gray-200 rounded-xl max-w-[85%] text-left animated-element chat-bubble-1">What are "diffusion techniques"?</div>
                    <div className="flex justify-end">
                        <div className="p-2.5 bg-black text-white rounded-xl max-w-[85%] text-left animated-element chat-bubble-2">It's a method where AI starts with random noise and gradually refines it into a detailed image based on a text prompt.</div>
                    </div>
                    <div className="flex justify-start">
                        <div className="p-2.5 bg-gray-200 rounded-xl animated-element chat-typing typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                    <div className="flex justify-end">
                         <div className="p-2.5 bg-black text-white rounded-xl max-w-[85%] text-left animated-element chat-bubble-3">Got it, thanks!</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};