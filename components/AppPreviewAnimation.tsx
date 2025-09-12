import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { MailIcon } from './icons/MailIcon';
import { NotionIcon } from './icons/NotionIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ZapIcon } from './icons/ZapIcon';
import { LayersIcon } from './icons/LayersIcon';
import { LockIcon } from './icons/LockIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const scenes = [
  { id: 'welcome-summary', duration: 3000 },
  { id: 'welcome-chat', duration: 3000 },
  { id: 'welcome-personalization', duration: 3000 },
  { id: 'intro-api-key', duration: 5000 },
  { id: 'intro-safety', duration: 5000 },
  { id: 'search', duration: 8000 },
  { id: 'summary-text', duration: 6000 },
  { id: 'summary-videos', duration: 5000 },
  { id: 'chat', duration: 8000 },
  { id: 'gmail', duration: 9000 },
  { id: 'apps', duration: 9000 },
  { id: 'study', duration: 9000 },
  { id: 'research', duration: 10000 },
  { id: 'final-cta', duration: 6000 },
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
        {/* Welcome Scenes */}
        <div className={`preview-scene scene-welcome-feature ${currentSceneId === 'welcome-summary' ? 'active' : ''}`}>
            <h2 className="animated-element welcome-feature-text">AI-Powered Summaries</h2>
        </div>
        <div className={`preview-scene scene-welcome-feature ${currentSceneId === 'welcome-chat' ? 'active' : ''}`}>
            <h2 className="animated-element welcome-feature-text">Follow-up Chat</h2>
        </div>
        <div className={`preview-scene scene-welcome-feature ${currentSceneId === 'welcome-personalization' ? 'active' : ''}`}>
            <h2 className="animated-element welcome-feature-text">Full Personalization</h2>
        </div>

        {/* Intro Scenes */}
        <div className={`preview-scene scene-intro-api-key ${currentSceneId === 'intro-api-key' ? 'active' : ''}`}>
            <div className="w-full max-w-sm text-center">
                <div className="flex items-center justify-center space-x-2 animated-element" style={{ animationDelay: '0.3s' }}>
                    <SparklesIcon className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-700">Gemini Included</h3>
                </div>
                <p className="mt-2 text-xs text-gray-500 animated-element" style={{ animationDelay: '0.6s' }}>
                    Enjoy complimentary access to Google's Gemini model. You can also add your own keys for other AI providers in settings.
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg border animated-element" style={{ animationDelay: '1.2s' }}>
                    <div className="flex items-center space-x-2 text-xs">
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-gray-700">Google Gemini:</span>
                        <span className="text-gray-500">Connected</span>
                    </div>
                </div>
            </div>
        </div>

        <div className={`preview-scene scene-intro-safety ${currentSceneId === 'intro-safety' ? 'active' : ''}`}>
            <div className="w-full max-w-sm text-center">
                <div className="flex items-center justify-center space-x-2 animated-element" style={{ animationDelay: '0.3s' }}>
                    <LockIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-700">Private by Design</h3>
                </div>
                <div className="mt-3 space-y-2 text-left">
                    <div className="flex items-start space-x-2 text-xs text-gray-600 animated-element" style={{ animationDelay: '0.8s' }}>
                        <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>Your API keys and data are stored locally on your device.</span>
                    </div>
                    <div className="flex items-start space-x-2 text-xs text-gray-600 animated-element" style={{ animationDelay: '1.1s' }}>
                        <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>We never see or store your search history.</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Scene 5: Search */}
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
        
        {/* Scene 6a: Summary & Links */}
        <div className={`preview-scene scene-summary-text ${currentSceneId === 'summary-text' ? 'active' : ''}`}>
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
                </div>
                <div className="flex items-center space-x-2 text-gray-500 text-sm mt-4 animated-element links-title">
                    <LinkIcon className="w-5 h-5" />
                    <span>Verified Sources</span>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                    <div className="px-2 py-1 text-xs bg-gray-200 rounded-full animated-element link-tag" style={{ animationDelay: '4.5s' }}>Japan Guide</div>
                    <div className="px-2 py-1 text-xs bg-gray-200 rounded-full animated-element link-tag" style={{ animationDelay: '4.6s' }}>Time Out Tokyo</div>
                    <div className="px-2 py-1 text-xs bg-gray-200 rounded-full animated-element link-tag" style={{ animationDelay: '4.7s' }}>TripAdvisor</div>
                </div>
            </div>
        </div>
        
        {/* Scene 6b: Summary Videos */}
        <div className={`preview-scene scene-videos ${currentSceneId === 'summary-videos' ? 'active' : ''}`}>
            <div className="w-full max-w-md">
                <h3 className="animated-element videos-title text-base font-semibold text-gray-700">Top Video Results</h3>
                <div className="mt-3 grid grid-cols-3 gap-3">
                    <div className="animated-element video-card" style={{ animationDelay: '0.8s' }}>
                        <div className="w-full aspect-video bg-gray-300 rounded"></div>
                        <div className="mt-1.5 h-2 w-5/6 bg-gray-300 rounded-full"></div>
                        <div className="mt-1 h-2 w-3/4 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="animated-element video-card" style={{ animationDelay: '1.0s' }}>
                        <div className="w-full aspect-video bg-gray-300 rounded"></div>
                        <div className="mt-1.5 h-2 w-5/6 bg-gray-300 rounded-full"></div>
                        <div className="mt-1 h-2 w-3/4 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="animated-element video-card" style={{ animationDelay: '1.2s' }}>
                        <div className="w-full aspect-video bg-gray-300 rounded"></div>
                        <div className="mt-1.5 h-2 w-5/6 bg-gray-300 rounded-full"></div>
                        <div className="mt-1 h-2 w-3/4 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>


        {/* Scene 7: Chat */}
        <div className={`preview-scene scene-chat ${currentSceneId === 'chat' ? 'active' : ''}`}>
            <div className="w-full max-w-sm">
                <button className="flex items-center justify-center space-x-2 text-gray-700 text-sm mb-4 bg-white p-2 px-4 rounded-full shadow border animated-element chat-button">
                    <MessageSquareIcon className="w-5 h-5" />
                    <span>Enter Chat Mode</span>
                </button>
                <div className="space-y-3 text-sm w-full text-left">
                    <div className="p-2.5 bg-gray-200 rounded-xl max-w-[85%] animated-element chat-bubble chat-bubble-ai" style={{ animationDelay: '1.5s' }}>What's the best way to get around?</div>
                    <div className="flex justify-end">
                        <div className="p-2.5 bg-black text-white rounded-xl max-w-[85%] animated-element chat-bubble chat-bubble-user" style={{ animationDelay: '4s' }}>The subway system is incredibly efficient. Get a Suica or Pasmo card to easily tap and go on all trains and buses.</div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Scene 8: Gmail */}
        <div className={`preview-scene scene-gmail ${currentSceneId === 'gmail' ? 'active' : ''}`}>
             <div className="coming-soon-badge">Coming Soon</div>
             <h3 className="feature-title">Connect Gmail</h3>
             <div className="flex items-center w-full max-w-sm p-1.5 pl-4 rounded-full shadow-lg bg-white border border-gray-200 animated-element search-bar">
                <MailIcon className="text-blue-500 w-5 h-5" />
                <div className="ml-2 text-gray-700 text-sm flex-grow text-left">
                    <span className="typing-text-gmail">summary of last week's project update</span>
                </div>
                <div className="animated-element gmail-badge ml-auto mr-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Gmail</div>
            </div>
            <div className="mt-4 w-full max-w-sm bg-white rounded-xl shadow-lg p-4 border animated-element summary-card text-left">
                <h4 className="font-bold text-sm">Summary: Project Update</h4>
                <p className="text-xs mt-1.5 text-gray-600">The team completed the UI mockups. John is now working on the backend integration, expected to be done by Friday. Marketing assets are pending review from Sarah.</p>
            </div>
        </div>

        {/* Scene 9: Connected Apps */}
        <div className={`preview-scene scene-apps ${currentSceneId === 'apps' ? 'active' : ''}`}>
            <div className="coming-soon-badge">Coming Soon</div>
            <h3 className="feature-title">Connected Apps</h3>
            <div className="flex items-center w-full max-w-sm p-1.5 pl-4 rounded-full shadow-lg bg-white border border-gray-200 animated-element search-bar">
                <SearchIcon className="text-gray-400 w-5 h-5" />
                <div className="ml-2 text-gray-700 text-sm flex-grow text-left">
                    <span className="typing-text-apps">marketing plan Q3</span>
                </div>
            </div>
            <div className="mt-3 flex space-x-2 text-xs font-medium animated-element app-tabs">
                <div style={{ animationDelay: '3.6s' }}><button className="px-3 py-1 bg-gray-200 rounded-full">Web</button></div>
                <div style={{ animationDelay: '3.8s' }}><button className="px-3 py-1 bg-gray-200 rounded-full">Gmail</button></div>
                <div style={{ animationDelay: '4.0s' }}><button className="px-3 py-1 bg-black text-white rounded-full ring-2 ring-gray-300">Notion</button></div>
            </div>
            <div className="mt-4 w-full max-w-sm bg-white rounded-xl shadow-lg p-4 border animated-element notion-result text-left flex items-start space-x-3">
                <NotionIcon className="w-5 h-5 mt-0.5 text-gray-800 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-sm">Q3 Marketing Plan</h4>
                    <p className="text-xs mt-1 text-gray-500">The Q3 marketing plan focuses on expanding our reach through content marketing and targeted social media campaigns...</p>
                </div>
            </div>
        </div>

        {/* Scene 10: Study Mode */}
        <div className={`preview-scene scene-study ${currentSceneId === 'study' ? 'active' : ''}`}>
             <div className="coming-soon-badge">Coming Soon</div>
             <h3 className="feature-title">Study Mode</h3>
             <div className="flex items-center w-full max-w-sm p-1.5 pl-4 rounded-full shadow-lg bg-white border border-gray-200 animated-element search-bar">
                <BookOpenIcon className="text-green-600 w-5 h-5" />
                <div className="ml-2 text-gray-700 text-sm flex-grow text-left">
                    <span className="typing-text-study">photosynthesis</span>
                </div>
            </div>
             <div className="mt-4 w-full max-w-xs animated-element flashcard-container">
                <div className="relative w-full aspect-[3/2]">
                    <div className="absolute w-full h-full bg-white rounded-xl shadow-lg border p-6 flex flex-col justify-center items-center" style={{ backfaceVisibility: 'hidden' }}>
                        <p className="text-xs text-gray-500 mb-2 font-semibold">QUESTION</p>
                        <p className="font-medium text-gray-800">What is the role of chlorophyll?</p>
                    </div>
                    <div className="absolute w-full h-full bg-gray-800 text-white rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col justify-center items-center flashcard-answer">
                        <p className="text-xs text-gray-400 mb-2 font-semibold">ANSWER</p>
                        <p className="text-sm">Chlorophyll absorbs sunlight and uses its energy to synthesize carbohydrates from CO2 and water.</p>
                    </div>
                </div>
             </div>
        </div>

        {/* Scene 11: Deep Research */}
        <div className={`preview-scene scene-research ${currentSceneId === 'research' ? 'active' : ''}`}>
            <div className="coming-soon-badge">Coming Soon</div>
            <h3 className="feature-title">Deep Research Mode</h3>
            <div className="flex items-center w-full max-w-sm p-1.5 pl-4 rounded-full shadow-lg bg-white border border-gray-200 animated-element search-bar">
                <LayersIcon className="text-purple-600 w-5 h-5" />
                <div className="ml-2 text-gray-700 text-sm flex-grow text-left">
                    <span className="typing-text-research">the future of renewable energy sources</span>
                </div>
                 <div className="ml-auto flex-shrink-0 w-9 h-9 flex items-center justify-center bg-black text-white rounded-full">
                    <ZapIcon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-4 w-full max-w-sm bg-white rounded-xl shadow-lg p-4 border animated-element outline-card text-left">
                <h4 className="font-bold text-sm">Generated Outline</h4>
                <ul className="mt-2 text-xs text-gray-600 space-y-1 list-decimal list-inside animated-element outline-list">
                    <li style={{ animationDelay: '7.3s' }}>Introduction to Renewable Energy</li>
                    <li style={{ animationDelay: '7.6s' }}>Current State of Solar Power</li>
                    <li style={{ animationDelay: '7.9s' }}>Innovations in Wind Turbines</li>
                    <li style={{ animationDelay: '8.2s' }}>Conclusion and Future Outlook</li>
                </ul>
            </div>
        </div>

        {/* Scene 12: Final CTA */}
        <div className={`preview-scene scene-final-cta ${currentSceneId === 'final-cta' ? 'active' : ''}`}>
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold text-gray-800 animated-element final-title">Try Silo for free now</h3>
            <div className="mt-4 w-full max-w-xs bg-white rounded-lg p-2 border shadow-lg animated-element final-url-bar">
                <p className="text-sm text-gray-600 font-mono">silosearchai.netlify.app</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};