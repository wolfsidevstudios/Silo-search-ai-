import React, { useState, useEffect, useMemo } from 'react';
import type { YouTubeVideo } from '../types';
import { fetchYouTubeVideoDetails } from '../services/youtubeService';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LogoIcon } from './icons/LogoIcon';

interface VideoPlayerModalProps {
  initialVideoId: string;
  playlist: YouTubeVideo[];
  onClose: () => void;
  apiKey: string;
}

const RelatedVideoCard: React.FC<{ video: YouTubeVideo; onClick: () => void; }> = ({ video, onClick }) => (
    <button onClick={onClick} className="w-full flex items-start space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left">
        <img src={video.thumbnailUrl} alt={video.title} className="w-32 aspect-video object-cover rounded flex-shrink-0 bg-white/20" />
        <div className="flex-grow min-w-0">
            <p className="text-sm font-semibold text-white line-clamp-2">{video.title}</p>
            <p className="text-xs text-gray-400 mt-1">{video.channelTitle}</p>
        </div>
    </button>
);


export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ initialVideoId, playlist, onClose, apiKey }) => {
    const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadVideo = async (videoId: string) => {
        setIsLoading(true);
        setError(null);
        setCurrentVideo(null);
        try {
            const details = await fetchYouTubeVideoDetails(videoId, apiKey);
            if (details) {
                setCurrentVideo(details);
            } else {
                throw new Error("Could not load video details.");
            }
        } catch (err) {
            setError("Sorry, an error occurred while loading the video. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVideo(initialVideoId);
    }, []); 

    const handleSelectVideo = (videoId: string) => {
        loadVideo(videoId);
    };

    const relatedVideos = useMemo(() => {
        if (!currentVideo) return playlist;
        return playlist.filter(v => v.id !== currentVideo.id);
    }, [playlist, currentVideo]);

    const renderMainContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <LogoIcon className="w-16 h-16 animate-spin" />
                    <p className="mt-4">Loading Video...</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-red-400">
                    <p>{error}</p>
                </div>
            );
        }
        if (currentVideo) {
            return (
                <>
                    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${currentVideo.id}?autoplay=1&rel=0`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="mt-4">
                        <h1 className="text-2xl font-bold text-white">{currentVideo.title}</h1>
                        <p className="mt-2 text-gray-300 font-semibold">{currentVideo.channelTitle}</p>
                        <div className="mt-4 bg-white/10 p-4 rounded-lg max-h-48 overflow-y-auto">
                            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">{currentVideo.description}</pre>
                        </div>
                    </div>
                </>
            );
        }
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col text-white animate-[fadeIn_0.3s_ease-out]" role="dialog" aria-modal="true">
            <header className="p-4 flex items-center flex-shrink-0">
                <button onClick={onClose} className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                    <ArrowLeftIcon />
                    <span className="font-semibold">Back to App</span>
                </button>
            </header>
            <main className="flex-grow flex flex-col md:flex-row min-h-0">
                <div className="w-full md:w-2/3 lg:w-3/4 p-4 md:p-6 overflow-y-auto">
                    {renderMainContent()}
                </div>
                <aside className="w-full md:w-1/3 lg:w-1/4 p-4 md:p-6 border-l border-white/20 flex flex-col h-full overflow-y-auto">
                    <h2 className="text-lg font-bold mb-4 flex-shrink-0">Up Next</h2>
                    <div className="space-y-3 flex-grow overflow-y-auto">
                        {relatedVideos.map(video => (
                            <RelatedVideoCard key={video.id} video={video} onClick={() => handleSelectVideo(video.id)} />
                        ))}
                    </div>
                </aside>
            </main>
        </div>
    );
};