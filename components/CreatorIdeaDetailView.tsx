import React, { useState } from 'react';
import type { VideoIdeaDetail } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { LogoIcon } from './icons/LogoIcon';
import { LinkIcon } from './icons/LinkIcon';

interface CreatorIdeaDetailViewProps {
    ideaTitle: string;
    details: VideoIdeaDetail | null;
    isLoading: boolean;
    error: string | null;
    onClose: () => void;
}

type DetailTab = 'script' | 'titles' | 'tags' | 'inspiration' | 'related';

const TABS: { id: DetailTab; label: string }[] = [
    { id: 'script', label: 'Video Script' },
    { id: 'titles', label: 'Titles & Desc' },
    { id: 'tags', label: 'Tags & Hashtags' },
    { id: 'inspiration', label: 'Inspiration' },
    { id: 'related', label: 'Related Videos' },
];

export const CreatorIdeaDetailView: React.FC<CreatorIdeaDetailViewProps> = ({ ideaTitle, details, isLoading, error, onClose }) => {
    const [activeTab, setActiveTab] = useState<DetailTab>('script');
    
    const renderContent = () => {
        if (!details) return null;

        switch (activeTab) {
            case 'script':
                return (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Video Script</h3>
                        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap font-sans">{details.script}</pre>
                    </div>
                );
            case 'titles':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-2">Alternative Titles</h3>
                            <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
                                {details.titles.map((title, index) => <li key={index}>{title}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">Video Description</h3>
                            <p className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap">{details.description}</p>
                        </div>
                    </div>
                );
            case 'tags':
                 return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold mb-2">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {details.tags.map((tag, index) => <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{tag}</span>)}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-2">Hashtags</h3>
                            <div className="flex flex-wrap gap-2">
                                {details.hashtags.map((tag, index) => <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">{tag}</span>)}
                            </div>
                        </div>
                    </div>
                );
            case 'inspiration':
                return (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Inspiration & Creative Direction</h3>
                        <ul className="list-disc list-inside space-y-3 text-sm text-gray-800">
                            {details.inspiration.map((point, index) => <li key={index}>{point}</li>)}
                        </ul>
                    </div>
                );
            case 'related':
                 return (
                    <div>
                        <h3 className="text-lg font-bold mb-2">Related Video Examples</h3>
                        <div className="space-y-4">
                            {details.related_videos.map((video, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 flex items-center"><LinkIcon className="w-4 h-4 mr-2 text-gray-500" />{video.title}</h4>
                                    <p className="text-xs text-gray-600 mt-1 pl-6">{video.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-bold text-gray-800 truncate pr-4">{ideaTitle}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><CloseIcon /></button>
                </header>
                
                <div className="p-2 flex-shrink-0">
                    <div className="flex space-x-1 bg-gray-200 p-1 rounded-full text-sm font-medium overflow-x-auto">
                        {TABS.map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id)} 
                                className={`flex-shrink-0 px-3 py-1.5 rounded-full transition-colors ${activeTab === tab.id ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <main className="flex-grow p-4 md:p-6 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <LogoIcon className="w-12 h-12 animate-spin text-gray-400" />
                            <p className="mt-4 text-gray-600">Generating content plan...</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                            <p className="text-red-600">{error}</p>
                            <button onClick={onClose} className="mt-4 px-4 py-2 bg-black text-white rounded-lg">Close</button>
                        </div>
                    )}
                    {details && renderContent()}
                </main>
            </div>
        </div>
    );
};
