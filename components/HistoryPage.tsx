import React from 'react';
import type { HistoryRecord, UserProfile, YouTubeVideo } from '../types';
import { Header } from './Header';
import { Footer } from './Footer';
import { SearchIcon } from './icons/SearchIcon';

interface HistoryPageProps {
  history: HistoryRecord[];
  onSearch: (query: string) => void;
  onOpenVideoPlayer: (videoId: string, playlist: YouTubeVideo[]) => void;
  navigate: (path: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

const HistoryCard: React.FC<{ record: HistoryRecord; onSearch: (query: string) => void; onOpenVideoPlayer: (videoId: string, playlist: YouTubeVideo[]) => void; }> = ({ record, onSearch, onOpenVideoPlayer }) => (
    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden history-card-bg">
        <div className="p-4 border-b">
             <div className="flex items-center w-full p-1.5 pl-4 rounded-full bg-white/80 border">
                <SearchIcon className="text-gray-400 w-5 h-5" />
                <div className="ml-2 text-gray-700 text-sm flex-grow text-left">
                    <span className="typing-text" style={{ animation: `typing-kf 2s steps(${record.query.length}, end) forwards, blink-caret-kf .75s step-end infinite` }}>{record.query}</span>
                </div>
            </div>
        </div>
        <div className="p-6">
            <p className="text-gray-700 line-clamp-4">{record.summary}</p>
        </div>
        {record.videos && record.videos.length > 0 && (
            <div className="px-6 pb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {record.videos.slice(0, 4).map(video => (
                        <button key={video.id} onClick={() => onOpenVideoPlayer(video.id, record.videos || [])} className="aspect-video w-full group">
                           <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover rounded-md group-hover:opacity-80 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>
        )}
        <div className="p-4 bg-white/50 border-t flex justify-between items-center">
            <p className="text-xs text-gray-500">{new Date(record.timestamp).toLocaleString()}</p>
            <button onClick={() => onSearch(record.query)} className="px-4 py-1.5 text-sm font-medium bg-black text-white rounded-full hover:bg-gray-800">Re-Search</button>
        </div>
    </div>
);

export const HistoryPage: React.FC<HistoryPageProps> = ({ history, onSearch, onOpenVideoPlayer, navigate, onOpenLegalPage, ...headerProps }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header {...headerProps} activeTab="history" onNavigate={navigate} />
            <main className="flex-grow container mx-auto px-4 py-8">
                 <h1 className="text-3xl font-bold text-center mb-8">Your Smart History</h1>

                {history.length > 0 ? (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {history.map(record => (
                            <HistoryCard key={record.id} record={record} onSearch={onSearch} onOpenVideoPlayer={onOpenVideoPlayer} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500">Your search history will appear here.</p>
                    </div>
                )}
            </main>
            <Footer onOpenLegalPage={onOpenLegalPage} showCopyright={true} className="pb-6" />
        </div>
    );
};