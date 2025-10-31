import React from 'react';
import { SearchIcon } from '../icons/SearchIcon';
import { HistoryIcon } from '../icons/HistoryIcon';
import { SettingsIcon } from '../icons/SettingsIcon';
import { MobileSearchPage } from './MobileSearchPage';
import { MobileHistoryPage } from './MobileHistoryPage';
import { SummarizationSource } from '../types';

interface MobileAppProps {
    currentPath: string;
    navigate: (path: string) => void;
    onSearch: (query: string, options: { studyMode?: boolean; mapSearch?: boolean; travelSearch?: boolean; shoppingSearch?: boolean; pexelsSearch?: boolean; agentSearch?: boolean; creatorSearch?: boolean; creatorPlatform?: 'youtube' | 'tiktok' | 'instagram', researchSearch?: boolean; }) => void;
    recentSearches: string[];
    onClearRecents: () => void;
    speechLanguage: 'en-US' | 'es-ES';
    onOpenComingSoonModal: () => void;
    isStudyMode: boolean;
    setIsStudyMode: (isStudyMode: boolean) => void;
    summarizationSource: SummarizationSource | null;
    onOpenSummarizeSourceSelector: () => void;
    onClearSummarizationSource: () => void;
}

export const MobileApp: React.FC<MobileAppProps> = ({ currentPath, navigate, ...props }) => {
    const renderContent = () => {
        switch (currentPath) {
            case '/history':
                return <MobileHistoryPage 
                            recentSearches={props.recentSearches}
                            onSearch={(query) => {
                                props.onSearch(query, {});
                            }}
                            onClear={props.onClearRecents}
                        />;
            case '/search':
            default:
                return <MobileSearchPage 
                            onSearch={props.onSearch}
                            speechLanguage={props.speechLanguage}
                            onOpenComingSoonModal={props.onOpenComingSoonModal}
                            isStudyMode={props.isStudyMode}
                            setIsStudyMode={props.setIsStudyMode}
                            summarizationSource={props.summarizationSource}
                            onOpenSummarizeSourceSelector={props.onOpenSummarizeSourceSelector}
                            onClearSummarizationSource={props.onClearSummarizationSource}
                        />;
        }
    };

    const TabButton: React.FC<{ targetPath: string, icon: React.ReactNode, label: string }> = ({ targetPath, icon, label }) => (
        <button onClick={() => navigate(targetPath)} className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${currentPath === targetPath ? 'text-black' : 'text-gray-500 hover:text-gray-800'}`}>
            {icon}
            <span className="text-xs mt-1">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-screen w-full">
            <main className="flex-grow overflow-y-auto">
                {renderContent()}
            </main>
            <footer className="flex-shrink-0 w-full bg-white border-t border-gray-200 flex justify-around shadow-inner">
                <TabButton targetPath="/search" icon={<SearchIcon className="w-6 h-6" />} label="Search" />
                <TabButton targetPath="/history" icon={<HistoryIcon className="w-6 h-6" />} label="History" />
                <button onClick={() => navigate('/settings')} className="flex flex-col items-center justify-center w-full pt-2 pb-1 text-gray-500 hover:text-gray-800 transition-colors">
                    <SettingsIcon className="w-6 h-6" />
                    <span className="text-xs mt-1">Settings</span>
                </button>
            </footer>
        </div>
    );
};
