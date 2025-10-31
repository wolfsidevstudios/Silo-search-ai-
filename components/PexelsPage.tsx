
import React from 'react';
import type { UserProfile, PexelsResult, PexelsMedia } from '../types';
import { Header } from './Header';
import { SearchInput } from './SearchInput';
import { DownloadIcon } from './icons/DownloadIcon';
import { downloadMedia } from '../services/pexelsService';
import { VideoIcon } from './icons/VideoIcon';
import { CameraIcon } from './icons/CameraIcon';

interface PexelsPageProps {
  initialResult: PexelsResult;
  originalQuery: string;
  onSearch: (query: string, options: { studyMode?: boolean; mapSearch?: boolean; travelSearch?: boolean; shoppingSearch?: boolean; pexelsSearch?: boolean; agentSearch?: boolean; researchSearch?: boolean; }) => void;
  onHome: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
}

const MediaCard: React.FC<{ media: PexelsMedia }> = ({ media }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadMedia(media);
  };

  const authorName = media.type === 'Photo' ? media.photographer : media.user.name;
  const authorUrl = media.type === 'Photo' ? media.photographer_url : media.user.url;
  const mediaUrl = media.url;
  const thumbnail = media.type === 'Photo' ? media.src.large : media.image;
  
  return (
    <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square w-full bg-gray-200 rounded-lg overflow-hidden">
      <img src={thumbnail} alt={media.type === 'Photo' ? media.alt : `Video by ${authorName}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
      {media.type === 'Video' && (
        <div className="absolute top-2 left-2 bg-black/50 text-white rounded-full p-1.5">
          <VideoIcon className="w-4 h-4" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <a href={authorUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-sm font-semibold hover:underline truncate">{authorName}</a>
        </div>
        <button onClick={handleDownload} className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 text-black rounded-full flex items-center justify-center hover:bg-white scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" aria-label="Download media">
          <DownloadIcon />
        </button>
      </div>
    </a>
  );
};

export const PexelsPage: React.FC<PexelsPageProps> = ({ initialResult, originalQuery, onSearch, onHome, ...headerProps }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header {...headerProps} onHome={onHome} showHomeButton={true} />
      <main className="flex-grow flex flex-col">
        <div className="w-full p-4 border-b border-gray-200 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <SearchInput 
                    onSearch={onSearch} 
                    initialValue={originalQuery}
                    isLarge={false}
                    speechLanguage="en-US" 
                    onOpenComingSoonModal={() => {}} 
                    isStudyMode={false}
                    setIsStudyMode={() => {}}
                    onFileSelect={()=>{}}
                    selectedFile={null}
                    onClearFile={()=>{}}
                />
            </div>
        </div>
        <div className="flex-grow p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Media Results</h1>
                    <p className="mt-2 text-gray-600">{initialResult.summary}</p>
                </div>
                {initialResult.media.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {initialResult.media.map((media) => (
                            <MediaCard key={media.id} media={media} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <CameraIcon className="w-12 h-12 mx-auto text-gray-300" />
                        <h3 className="mt-4 text-lg font-semibold text-gray-800">No results found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search query to find what you're looking for.</p>
                    </div>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};