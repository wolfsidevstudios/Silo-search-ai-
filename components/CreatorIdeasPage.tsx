import React, { useState } from 'react';
import type { CreatorIdeasResult, UserProfile, VideoIdeaSummary, VideoIdeaDetail } from '../types';
import { Header } from './Header';
import { Footer } from './Footer';
import { SearchInput } from './SearchInput';
import { StarIcon } from './icons/StarIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { InstagramIcon } from './icons/InstagramIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CreatorIdeaDetailView } from './CreatorIdeaDetailView';
import { fetchCreatorIdeaDetails } from '../services/geminiService';

interface CreatorIdeasPageProps {
  result: CreatorIdeasResult;
  geminiApiKey: string;
  onSearch: (query: string, options: { studyMode?: boolean; mapSearch?: boolean; travelSearch?: boolean; shoppingSearch?: boolean; pexelsSearch?: boolean; agentSearch?: boolean; creatorSearch?: boolean; creatorPlatform?: 'youtube' | 'tiktok' | 'instagram'; researchSearch?: boolean; }) => void;
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

const IdeaCard: React.FC<{ idea: VideoIdeaSummary, onClick: () => void }> = ({ idea, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-xl shadow-md border flex flex-col h-full text-left hover:shadow-lg hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-black">
        <h3 className="text-lg font-bold text-gray-800">{idea.title}</h3>
        <div className="flex items-center space-x-1 my-2">
            {[...Array(10)].map((_, i) => (
                <StarIcon key={i} className={`w-4 h-4 ${i < Math.round(idea.virality_score) ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm font-bold ml-2">{idea.virality_score}/10</span>
        </div>
        <p className="text-sm text-gray-600 flex-grow">{idea.description}</p>
        <span className="mt-4 text-xs font-semibold text-gray-500 self-start">Click to expand</span>
    </button>
);


export const CreatorIdeasPage: React.FC<CreatorIdeasPageProps> = ({ result, geminiApiKey, onSearch, onHome, ...headerProps }) => {
  const [selectedIdea, setSelectedIdea] = useState<VideoIdeaSummary | null>(null);
  const [ideaDetails, setIdeaDetails] = useState<VideoIdeaDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const handleIdeaClick = async (idea: VideoIdeaSummary) => {
    setSelectedIdea(idea);
    setIdeaDetails(null);
    setDetailError(null);
    setIsDetailLoading(true);
    try {
        const details = await fetchCreatorIdeaDetails(idea, result.topic, result.platform, geminiApiKey);
        setIdeaDetails(details);
    } catch (err) {
        setDetailError("Sorry, I couldn't generate the details for this idea. Please try again.");
        console.error(err);
    } finally {
        setIsDetailLoading(false);
    }
  };

  const closeDetailView = () => {
    setSelectedIdea(null);
    setIdeaDetails(null);
  };

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
                    <IdeaCard key={index} idea={idea} onClick={() => handleIdeaClick(idea)} />
                ))}
            </div>

        </main>
        {selectedIdea && (
            <CreatorIdeaDetailView
                ideaTitle={selectedIdea.title}
                details={ideaDetails}
                isLoading={isDetailLoading}
                error={detailError}
                onClose={closeDetailView}
            />
        )}
        <footer className="sticky bottom-0 left-0 right-0 p-2 sm:p-4 bg-white/80 backdrop-blur-sm z-20">
            <div className="max-w-xl mx-auto">
                {/* Fix: Replaced outdated props `onFileSelect`, `selectedFile`, `onClearFile` with the correct ones for summarization source handling. */}
                <SearchInput onSearch={onSearch} isLarge={false} speechLanguage="en-US" onOpenComingSoonModal={() => {}} isStudyMode={false} setIsStudyMode={() => {}} summarizationSource={null} onOpenSummarizeSourceSelector={()=>{}} onClearSummarizationSource={()=>{}} />
                <Footer onOpenLegalPage={headerProps.onOpenLegalPage} className="p-0 pt-2 text-xs" />
            </div>
      </footer>
    </div>
  );
};