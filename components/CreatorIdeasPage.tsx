import React from 'react';
import type { CreatorIdeasResult, UserProfile, VideoIdea } from '../types';
import { Header } from './Header';
import { Footer } from './Footer';
import { SearchInput } from './SearchInput';
import { StarIcon } from './icons/StarIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface CreatorIdeasPageProps {
  result: CreatorIdeasResult;
  onSearch: (query: string, options: { studyMode?: boolean; mapSearch?: boolean; travelSearch?: boolean; shoppingSearch?: boolean; pexelsSearch?: boolean; agentSearch?: boolean; creatorSearch?: boolean; creatorPlatform?: 'youtube' | 'tiktok' | 'instagram' }) => void;
  onHome: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

const PlatformIcon: React.FC<{ platform: string }> = ({ platform }) => {
    switch (platform.toLowerCase()) {
        case 'youtube': return <YouTubeIcon className="w-6 h-6" />;
        case 'tiktok': return <TikTokIcon className="w-6 h-6" />;
        case 'instagram': return <InstagramIcon className="w-6 h-6" />;
        default: return <LightbulbIcon className="w-6 h-6" />;
    }
};

const IdeaCard: React.FC<{ idea: VideoIdea }> = ({ idea }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border flex flex-col h-full">
        <h3 className="text-lg font-bold text-gray-800">{idea.title}</h3>
        <div className="flex items-center space-x-1 my-2">
            {[...Array(10)].map((_, i) => (
                <StarIcon key={i} className={`w-4 h-4 ${i < Math.round(idea.virality_score) ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm font-bold ml-2">{idea.virality_score}/10</span>
        </div>
        <p className="text-sm text-gray-600 flex-grow">{idea.description}</p>
    </div>
);


export const CreatorIdeasPage: React.FC<CreatorIdeasPageProps> = ({ result, onSearch, onHome, ...headerProps }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Header {...headerProps} onHome={onHome} showHomeButton={true} />
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3">
                    <PlatformIcon platform={result.platform} />
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        Video Ideas for "{result.topic}"
                    </h1>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.ideas.map((idea, index) => (
                    <IdeaCard key={index} idea={idea} />
                ))}
            </div>

        </main>
        <footer className="sticky bottom-0 left-0 right-0 p-2 sm:p-4 bg-white/80 backdrop-blur-sm z-20">
            <div className="max-w-xl mx-auto">
                <SearchInput onSearch={onSearch} isLarge={false} speechLanguage="en-US" onOpenComingSoonModal={() => {}} isStudyMode={false} setIsStudyMode={() => {}} />
                <Footer onOpenLegalPage={headerProps.onOpenLegalPage} className="p-0 pt-2 text-xs" />
            </div>
      </footer>
    </div>
  );
};