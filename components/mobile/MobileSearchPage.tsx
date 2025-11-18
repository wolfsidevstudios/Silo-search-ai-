import React from 'react';
import { SearchInput } from '../SearchInput';
import { SummarizationSource } from '../types';

interface MobileSearchPageProps {
  onSearch: (query: string, options: { studyMode?: boolean; mapSearch?: boolean; travelSearch?: boolean; shoppingSearch?: boolean; pexelsSearch?: boolean; agentSearch?: boolean; creatorSearch?: boolean; creatorPlatform?: 'youtube' | 'tiktok' | 'instagram'; researchSearch?: boolean; }) => void;
  speechLanguage: 'en-US' | 'es-ES';
  onOpenComingSoonModal: () => void;
  isStudyMode: boolean;
  setIsStudyMode: (isStudyMode: boolean) => void;
  summarizationSource: SummarizationSource | null;
  onOpenSummarizeSourceSelector: () => void;
  onClearSummarizationSource: () => void;
  geminiApiKey: string;
}

export const MobileSearchPage: React.FC<MobileSearchPageProps> = (props) => {
  return (
    <div className="flex flex-col min-h-full items-center justify-center p-4">
      <main className="flex-grow flex flex-col items-center justify-center text-center w-full">
        <h1 className="text-6xl font-bold text-gray-800 mb-8">
          Kyndra AI
        </h1>
        <div className="w-full max-w-md">
          <SearchInput 
            onSearch={props.onSearch} 
            isLarge={false} 
            speechLanguage={props.speechLanguage} 
            onOpenComingSoonModal={props.onOpenComingSoonModal} 
            isStudyMode={props.isStudyMode}
            setIsStudyMode={props.setIsStudyMode}
            summarizationSource={props.summarizationSource}
            onOpenSummarizeSourceSelector={props.onOpenSummarizeSourceSelector}
            onClearSummarizationSource={props.onClearSummarizationSource}
            geminiApiKey={props.geminiApiKey}
          />
        </div>
      </main>
    </div>
  );
};