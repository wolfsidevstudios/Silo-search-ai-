import React from 'react';
import { SearchInput } from './SearchInput';

interface AiHomePageProps {
  onSearch: (query: string, options: any) => void;
}

export const AiHomePage: React.FC<AiHomePageProps> = ({ onSearch }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-white z-0">
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-100/50 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-100/50 rounded-full filter blur-3xl opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 text-center">
                Create with AI
            </h1>
            <p className="text-lg text-gray-500 mb-8 text-center">
                Generate designs, documents, and code with a single prompt.
            </p>
            <SearchInput
                onSearch={onSearch}
                variant="create"
                speechLanguage="en-US"
                onOpenComingSoonModal={() => {}}
                summarizationSource={null}
                onOpenSummarizeSourceSelector={() => {}}
                onClearSummarizationSource={() => {}}
            />
        </div>
    </div>
  );
};
