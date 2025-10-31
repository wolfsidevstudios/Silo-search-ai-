import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { fetchTopHeadlines } from '../services/newsService';
import { fetchStockQuotes } from '../services/stockService';
import { fetchTrendingProducts } from '../services/productHuntService';
import { fetchYouTubeVideos, fetchTrendingYouTubeVideos } from '../services/youtubeService';
import { fetchTrendingTikTokVideos } from '../services/tiktokService';
import type { NewsArticle, StockQuote, UserProfile, ProductHuntPost, YouTubeVideo, TikTokVideo, QuickLink } from '../types';
import { LogoIcon } from './icons/LogoIcon';
import { ProductHuntIcon } from './icons/ProductHuntIcon';
import { SearchIcon } from './icons/SearchIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { fetchNewsSummary } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';

interface DiscoverPageProps {
  navigate: (path: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
  apiKeys: { [key: string]: string };
  onOpenVideoPlayer: (videoId: string, playlist: YouTubeVideo[]) => void;
}

const StockCard: React.FC<{ stock: StockQuote }> = ({ stock }) => {
    const symbol = stock['01. symbol'];
    const price = parseFloat(stock['05. price']).toFixed(2);
    const change = parseFloat(stock['09. change']);
    const changePercent = parseFloat(stock['10. change percent']).toFixed(2);
    const isPositive = change >= 0;

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between items-baseline">
                <span className="font-bold text-lg">{symbol}</span>
                <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{change.toFixed(2)}
                </span>
            </div>
            <div className="flex justify-between items-baseline mt-1">
                <span className="font-semibold text-2xl">${price}</span>
                <span className={`px-2 py-0.5 rounded-md text-sm font-semibold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {isPositive ? '▲' : '▼'} {changePercent}%
                </span>
            </div>
        </div>
    );
};

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-gray-200 overflow-hidden group flex flex-col hover:shadow-lg transition-shadow">
        {article.urlToImage ? (
            <img src={article.urlToImage} alt={article.title} className="h-40 w-full object-cover" />
        ) : (
            <div className="h-40 w-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-gray-800 group-hover:text-black line-clamp-3">{article.title}</h3>
            <p className="text-xs text-gray-500 mt-auto pt-2">{new Date(article.publishedAt).toLocaleDateString()} &bull; {article.source.name}</p>
        </div>
    </a>
);

const ProductHuntCard: React.FC<{ product: ProductHuntPost }> = ({ product }) => (
    <a href={product.url} target="_blank" rel="noopener noreferrer" className="bg-white p-4 rounded-xl border border-gray-200 group flex items-start space-x-4 hover:shadow-md transition-shadow">
        <img src={product.thumbnail.url} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-grow min-w-0">
            <h4 className="font-bold text-gray-800 truncate group-hover:text-black">{product.name}</h4>
            <p className="text-sm text-gray-600 truncate mt-1">{product.tagline}</p>
            <p className="text-xs font-semibold text-gray-500 mt-2">▲ {product.votesCount}</p>
        </div>
    </a>
);

const YouTubeVideoCard: React.FC<{ video: YouTubeVideo; onClick: () => void; }> = ({ video, onClick }) => (
    <button onClick={onClick} className="bg-white rounded-xl border border-gray-200 overflow-hidden group flex flex-col hover:shadow-lg transition-shadow text-left">
        <div className="relative">
            <img src={video.thumbnailUrl} alt={video.title} className="aspect-video w-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
            </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-gray-800 group-hover:text-black text-sm line-clamp-2">{video.title}</h3>
            <p className="text-xs text-gray-500 mt-auto pt-2">{video.channelTitle}</p>
        </div>
    </button>
);

const TikTokVideoCard: React.FC<{ video: TikTokVideo }> = ({ video }) => (
    <a href={video.webVideoUrl} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl border border-gray-200 overflow-hidden group flex flex-col hover:shadow-lg transition-shadow">
        <div className="relative">
            <img src={video.coverUrl} alt={video.text} className="aspect-[9/16] w-full object-cover" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
            </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <p className="text-xs text-gray-600 line-clamp-2">{video.text}</p>
            <p className="text-xs font-semibold text-gray-800 mt-auto pt-2">@{video.authorNickname}</p>
        </div>
    </a>
);

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ navigate, onOpenLegalPage, apiKeys, onOpenVideoPlayer, ...headerProps }) => {
    const [activeTab, setActiveTab] = useState<'news' | 'finance' | 'videos'>('news');
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [stocks, setStocks] = useState<StockQuote[]>([]);
    const [trendingProducts, setTrendingProducts] = useState<ProductHuntPost[]>([]);
    const [newsSummary, setNewsSummary] = useState<string | null>(null);
    const [newsSummarySources, setNewsSummarySources] = useState<QuickLink[]>([]);
    const [isSummaryLoading, setIsSummaryLoading] = useState(true);
    
    const [youtubeSearchQuery, setYoutubeSearchQuery] = useState('');
    const [displayedVideos, setDisplayedVideos] = useState<YouTubeVideo[]>([]);
    const [isYoutubeLoading, setIsYoutubeLoading] = useState(false);
    const [tikTokVideos, setTikTokVideos] = useState<TikTokVideo[]>([]);
    const [isTikTokLoading, setIsTikTokLoading] = useState(false);
    const [tikTokError, setTikTokError] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDataAndSummary = async () => {
            setIsLoading(true);
            setIsSummaryLoading(true);

            const [
                newsResult,
                stockResult,
                productsResult,
                trendingVideosResult,
                summaryResult
            ] = await Promise.allSettled([
                fetchTopHeadlines(),
                fetchStockQuotes(),
                fetchTrendingProducts(),
                fetchTrendingYouTubeVideos(apiKeys.youtube),
                apiKeys.gemini ? fetchNewsSummary(apiKeys.gemini) : Promise.reject("Gemini API key not set"),
            ]);

            if (newsResult.status === 'fulfilled') setNews(newsResult.value.filter(a => a.urlToImage));
            if (stockResult.status === 'fulfilled') setStocks(stockResult.value);
            if (productsResult.status === 'fulfilled') setTrendingProducts(productsResult.value);
            if (trendingVideosResult.status === 'fulfilled') setDisplayedVideos(trendingVideosResult.value);

            if (summaryResult.status === 'fulfilled') {
                setNewsSummary(summaryResult.value.summary);
                setNewsSummarySources(summaryResult.value.sources);
            } else {
                setNewsSummary("AI news summary could not be loaded. Please check your Gemini API key in settings.");
                setNewsSummarySources([]);
            }
            
            setIsSummaryLoading(false);
            setIsLoading(false);
        };

        const loadTikTokData = async () => {
            if (!apiKeys.apify) {
                setTikTokError("Please add your Apify API key in settings to see TikTok videos.");
                return;
            }
            setIsTikTokLoading(true);
            setTikTokError(null);
            try {
                const videos = await fetchTrendingTikTokVideos(apiKeys.apify);
                setTikTokVideos(videos);
            } catch (error) {
                console.error(error);
                setTikTokError("Could not load TikTok videos. The Apify actor may take a moment. Please refresh or try again later.");
            } finally {
                setIsTikTokLoading(false);
            }
        };

        loadDataAndSummary();
        loadTikTokData();
    }, [apiKeys.gemini, apiKeys.youtube, apiKeys.apify]);

    const handleYoutubeSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!youtubeSearchQuery.trim()) {
            setIsYoutubeLoading(true);
            const trendingVideosData = await fetchTrendingYouTubeVideos(apiKeys.youtube);
            setDisplayedVideos(trendingVideosData);
            setIsYoutubeLoading(false);
            return;
        }
        setIsYoutubeLoading(true);
        const searchResults = await fetchYouTubeVideos(youtubeSearchQuery, apiKeys.youtube);
        setDisplayedVideos(searchResults);
        setIsYoutubeLoading(false);
    };
    
    const TabButton: React.FC<{ label: string; tabId: 'news' | 'finance' | 'videos' }> = ({ label, tabId }) => (
      <button
          onClick={() => setActiveTab(tabId)}
          className={`py-3 px-4 font-semibold border-b-2 transition-colors text-lg ${activeTab === tabId ? 'text-black border-black' : 'text-gray-500 border-transparent hover:text-black'}`}
      >
          {label}
      </button>
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center flex-grow py-20">
                    <LogoIcon className="w-16 h-16 animate-spin" />
                    <p className="mt-4 text-gray-600">Discovering what's new...</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'news':
                return (
                    <>
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                                <SparklesIcon className="w-6 h-6" />
                                <span>AI News Briefing</span>
                            </h2>
                            {isSummaryLoading ? (
                                <div className="bg-white p-6 rounded-xl border border-gray-200">
                                    <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-4 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded-full w-full mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded-full w-5/6 animate-pulse"></div>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-xl border border-gray-200">
                                    <p className="text-gray-700">{newsSummary}</p>
                                    {newsSummarySources.length > 0 && (
                                        <div className="mt-4 pt-4 border-t">
                                            <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center space-x-1.5"><LinkIcon className="w-4 h-4" /><span>Sources</span></h4>
                                            <div className="flex flex-wrap gap-2">
                                                {newsSummarySources.map((source, index) => (
                                                    <a key={index} href={source.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200">
                                                        {source.title}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Headlines</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {news.slice(0, 12).map((article, index) => <NewsCard key={index} article={article} />)}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                                <ProductHuntIcon className="w-6 h-6" />
                                <span>Trending on Product Hunt</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {trendingProducts.map(product => <ProductHuntCard key={product.id} product={product} />)}
                            </div>
                        </section>
                    </>
                );
            case 'finance':
                 return (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Market Snapshot</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {stocks.map(stock => <StockCard key={stock['01. symbol']} stock={stock} />)}
                        </div>
                    </section>
                 );
            case 'videos':
                 return (
                     <section>
                        <form onSubmit={handleYoutubeSearch} className="mb-8 max-w-lg mx-auto">
                            <div className="relative">
                                <input
                                    type="search"
                                    value={youtubeSearchQuery}
                                    onChange={(e) => setYoutubeSearchQuery(e.target.value)}
                                    placeholder="Search YouTube..."
                                    className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                />
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                        </form>

                        {isYoutubeLoading ? (
                             <div className="flex items-center justify-center py-10"><LogoIcon className="w-12 h-12 animate-spin" /></div>
                        ) : (
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {displayedVideos.map((video) => <YouTubeVideoCard key={video.id} video={video} onClick={() => onOpenVideoPlayer(video.id, displayedVideos)} />)}
                             </div>
                        )}

                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                                <TikTokIcon className="w-6 h-6" />
                                <span>Trending on TikTok</span>
                            </h2>
                            {isTikTokLoading ? (
                                <div className="flex items-center justify-center py-10"><LogoIcon className="w-12 h-12 animate-spin" /></div>
                            ) : tikTokError ? (
                                <div className="text-center py-10 px-4 bg-gray-100 rounded-lg">
                                    <p className="text-gray-600">{tikTokError}</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {tikTokVideos.map((video) => <TikTokVideoCard key={video.id} video={video} />)}
                                </div>
                            )}
                        </div>
                     </section>
                 );
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header 
                {...headerProps}
                activeTab="discover"
                onNavigate={navigate}
            />
            <main className="flex-grow flex flex-col items-center px-4 pt-8 pb-12">
                <div className="w-full max-w-7xl">
                    <div className="flex justify-center space-x-4 sm:space-x-8 border-b mb-8">
                        <TabButton label="News" tabId="news" />
                        <TabButton label="Finance" tabId="finance" />
                        <TabButton label="Videos" tabId="videos" />
                    </div>
                    {renderContent()}
                </div>
            </main>
            <Footer onOpenLegalPage={onOpenLegalPage} showCopyright={true} className="pb-6" />
        </div>
    );
};