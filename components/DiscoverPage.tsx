
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { fetchTopHeadlines, searchNews } from '../services/newsService';
import { fetchStockQuotes, fetchStockQuote } from '../services/stockService';
import { fetchTrendingYouTubeVideos, fetchYouTubeNewsVideos, fetchTrendingYouTubeShorts } from '../services/youtubeService';
import { fetchWordOfTheDay } from '../services/wordService';
import { fetchDailyJoke } from '../services/jokeService';
import { fetchSportsScores } from '../services/sportsService';
import type { NewsArticle, StockQuote, UserProfile, YouTubeVideo, TikTokVideo } from '../types';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { TikTokIcon } from './icons/TikTokIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { VideoIcon } from './icons/VideoIcon';
import { NewspaperIcon } from './icons/NewspaperIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { HomeIcon } from './icons/HomeIcon';

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

interface WordData {
  word: string;
  definition: string;
}
interface SportsData {
  home_team: { full_name: string };
  visitor_team: { full_name: string };
  home_team_score: number;
  visitor_team_score: number;
  status: string;
}

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-3xl border border-gray-100 overflow-hidden group flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
        {article.urlToImage ? (
            <div className="h-48 overflow-hidden">
                <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
        ) : (
            <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400">
                <NewspaperIcon className="w-8 h-8 opacity-50" />
            </div>
        )}
        <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center space-x-2 mb-3">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-full">{article.source.name}</span>
                <span className="text-xs text-gray-400">&bull;</span>
                <span className="text-xs text-gray-400">{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-3 mb-2">{article.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-3">{article.description}</p>
        </div>
    </a>
);

const YouTubeVideoCard: React.FC<{ video: YouTubeVideo; onClick: () => void; isShort?: boolean }> = ({ video, onClick, isShort }) => (
    <button onClick={onClick} className={`relative bg-white rounded-3xl border border-gray-100 overflow-hidden group flex flex-col hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left w-full h-full`}>
        <div className="relative w-full h-full overflow-hidden">
            <img src={video.thumbnailUrl} alt={video.title} className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isShort ? 'aspect-[9/16]' : 'aspect-video'}`} />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                 <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 shadow-lg">
                    <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-100">
                <h3 className="font-bold text-sm leading-tight line-clamp-2 text-shadow">{video.title}</h3>
                <p className="text-xs text-gray-300 mt-1 font-medium truncate">{video.channelTitle}</p>
            </div>
        </div>
    </button>
);

const WeatherWidget: React.FC<{ temperatureUnit: 'celsius' | 'fahrenheit' }> = ({ temperatureUnit }) => {
    const [weather, setWeather] = useState<any>(null);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=${temperatureUnit}`)
                .then(res => res.json())
                .then(data => setWeather(data));
        });
    }, [temperatureUnit]);

    const getWeatherIcon = (code: number) => {
        if (code === 0) return '☀️';
        if (code <= 2) return '⛅';
        if (code === 3) return '☁️';
        if (code >= 51 && code <= 67) return '🌧️';
        if (code >= 71 && code <= 77) return '❄️';
        if (code >= 95) return '⛈️';
        return '☁️';
    }

    if (!weather) return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full flex items-center justify-center">
            <LogoIcon className="w-8 h-8 animate-spin opacity-20" />
        </div>
    );

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors"></div>
            
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900 text-xl">Weather</h3>
                        <p className="text-sm text-gray-500 font-medium mt-1">Current Location</p>
                    </div>
                    <span className="text-4xl animate-pulse">{getWeatherIcon(weather.current.weather_code)}</span>
                </div>
                <div className="mt-4">
                    <p className="text-5xl font-bold text-gray-900 tracking-tighter">{Math.round(weather.current.temperature_2m)}°</p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2 text-center divide-x divide-gray-100">
                {weather.daily.time.slice(1, 5).map((time: string, i: number) => (
                    <div key={time} className="px-1">
                        <p className="text-[10px] font-bold text-gray-400 mb-1">{new Date(time).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</p>
                        <span className="text-lg block mb-1">{getWeatherIcon(weather.daily.weather_code[i+1])}</span>
                        <p className="text-sm font-bold text-gray-800">{Math.round(weather.daily.temperature_2m_max[i+1])}°</p>
                        <p className="text-xs text-gray-400">{Math.round(weather.daily.temperature_2m_min[i+1])}°</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const InfoCard: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow duration-300 ${className}`}>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{title}</p>
        <div className="flex-grow flex flex-col justify-center">
            {children}
        </div>
    </div>
);

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ navigate, onOpenLegalPage, apiKeys, onOpenVideoPlayer, ...headerProps }) => {
    const [activeTab, setActiveTab] = useState<'home' | 'news' | 'finance' | 'videos'>('home');
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [stocks, setStocks] = useState<StockQuote[]>([]);
    const [currentStockIndex, setCurrentStockIndex] = useState(0);
    const [word, setWord] = useState<WordData | null>(null);
    const [joke, setJoke] = useState<string | null>(null);
    const [sports, setSports] = useState<SportsData[]>([]);
    const [newsVideos, setNewsVideos] = useState<YouTubeVideo[]>([]);
    const [trendingVideos, setTrendingVideos] = useState<YouTubeVideo[]>([]);
    const [trendingShorts, setTrendingShorts] = useState<YouTubeVideo[]>([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            setIsLoading(true);
            const [newsRes, stocksRes, wordRes, jokeRes, sportsRes, newsVideosRes, trendingVideosRes, trendingShortsRes] = await Promise.allSettled([
                fetchTopHeadlines(),
                fetchStockQuotes(),
                fetchWordOfTheDay(),
                fetchDailyJoke(),
                fetchSportsScores(),
                fetchYouTubeNewsVideos(apiKeys.youtube),
                fetchTrendingYouTubeVideos(apiKeys.youtube),
                fetchTrendingYouTubeShorts(apiKeys.youtube)
            ]);
            if (newsRes.status === 'fulfilled') setNews(newsRes.value.filter(a => a.urlToImage));
            if (stocksRes.status === 'fulfilled') setStocks(stocksRes.value);
            if (wordRes.status === 'fulfilled') setWord(wordRes.value);
            if (jokeRes.status === 'fulfilled') setJoke(jokeRes.value);
            if (sportsRes.status === 'fulfilled') setSports(sportsRes.value);
            if (newsVideosRes.status === 'fulfilled') setNewsVideos(newsVideosRes.value.slice(0, 15));
            if (trendingVideosRes.status === 'fulfilled') setTrendingVideos(trendingVideosRes.value);
            if (trendingShortsRes.status === 'fulfilled') setTrendingShorts(trendingShortsRes.value);
            setIsLoading(false);
        };
        loadAllData();
    }, [apiKeys.youtube]);

    useEffect(() => {
        if (stocks.length > 0) {
            const interval = setInterval(() => {
                setCurrentStockIndex(prev => (prev + 1) % stocks.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [stocks]);

     useEffect(() => {
        if (newsVideos.length > 0) {
            const interval = setInterval(() => {
                setCarouselIndex(prev => (prev + 1) % newsVideos.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [newsVideos]);

    const currentStock = stocks[currentStockIndex];
    
    const TabButton: React.FC<{ label: string; tabId: typeof activeTab; icon: React.ElementType }> = ({ label, tabId, icon: Icon }) => (
      <button 
        onClick={() => setActiveTab(tabId)} 
        className={`flex items-center space-x-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${activeTab === tabId ? 'bg-black text-white shadow-lg scale-105' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
      >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
      </button>
    );

    const renderHome = () => (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            {/* Top Widgets Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InfoCard title="Word of the Day">
                    {word ? (
                        <>
                            <h4 className="text-2xl font-bold text-gray-900 capitalize tracking-tight">{word.word}</h4>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{word.definition}</p>
                        </>
                    ) : <div className="h-16 bg-gray-50 animate-pulse rounded-lg"></div>}
                </InfoCard>
                
                <InfoCard title="Daily Joke">
                    {joke ? (
                         <p className="text-sm text-gray-700 font-medium leading-relaxed italic">"{joke}"</p>
                    ) : <div className="h-16 bg-gray-50 animate-pulse rounded-lg"></div>}
                </InfoCard>
                
                <InfoCard title="Market Ticker">
                    {currentStock ? (
                        <>
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="font-bold text-2xl text-gray-900">{currentStock['01. symbol']}</span>
                                <span className={`font-bold text-sm px-2 py-0.5 rounded-full ${parseFloat(currentStock['09. change']) >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {parseFloat(currentStock['09. change']) >= 0 ? '+' : ''}{currentStock['10. change percent'].replace('%','')}%
                                </span>
                            </div>
                            <span className="font-medium text-3xl text-gray-800 tracking-tight">${parseFloat(currentStock['05. price']).toFixed(2)}</span>
                        </>
                    ) : <div className="h-16 bg-gray-50 animate-pulse rounded-lg"></div>}
                </InfoCard>
                
                <InfoCard title="Live Sports">
                    {sports.length > 0 ? (
                        <>
                            <div className="flex flex-col space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-800">{sports[0].home_team.full_name}</span>
                                    <span className="font-mono font-bold text-lg">{sports[0].home_team_score}</span>
                                </div>
                                <div className="w-full h-px bg-gray-100"></div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-800">{sports[0].visitor_team.full_name}</span>
                                    <span className="font-mono font-bold text-lg">{sports[0].visitor_team_score}</span>
                                </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-gray-50">
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider bg-gray-50 px-2 py-1 rounded-full">{sports[0].status}</span>
                            </div>
                        </>
                    ) : <div className="h-16 bg-gray-50 animate-pulse rounded-lg"></div>}
                </InfoCard>
            </div>

            {/* Main Content Grid: Video Carousel + Weather */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
                <div className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-md group bg-black">
                    {newsVideos.length > 0 && (
                        <>
                            <div className="absolute inset-0 transition-opacity duration-700 ease-in-out">
                                <img 
                                    src={newsVideos[carouselIndex].thumbnailUrl.replace('hqdefault', 'maxresdefault')} 
                                    alt={newsVideos[carouselIndex].title} 
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full">
                                <span className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full mb-4 shadow-lg">Top News</span>
                                <h3 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-2 drop-shadow-md line-clamp-2">{newsVideos[carouselIndex].title}</h3>
                                <p className="text-gray-300 font-medium text-sm flex items-center gap-2">
                                    <span>{newsVideos[carouselIndex].channelTitle}</span>
                                </p>
                                <button 
                                    onClick={() => onOpenVideoPlayer(newsVideos[carouselIndex].id, newsVideos)}
                                    className="mt-6 flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    <span>Watch Now</span>
                                </button>
                            </div>
                            
                            {/* Carousel Controls */}
                            <div className="absolute bottom-8 right-8 flex space-x-3 z-20">
                                <button onClick={(e) => { e.stopPropagation(); setCarouselIndex(i => (i - 1 + newsVideos.length) % newsVideos.length); }} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 border border-white/10 transition-colors">
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setCarouselIndex(i => (i + 1) % newsVideos.length); }} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 border border-white/10 transition-colors">
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Indicators */}
                            <div className="absolute top-6 right-6 flex space-x-1.5">
                                {newsVideos.slice(0, 5).map((_, idx) => (
                                    <div key={idx} className={`h-1 rounded-full transition-all duration-300 ${idx === (carouselIndex % 5) ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}></div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="h-full">
                    <WeatherWidget temperatureUnit="fahrenheit" />
                </div>
            </div>

            {/* Latest News Grid */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Latest Headlines</h2>
                    <button onClick={() => setActiveTab('news')} className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        View All <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {news.slice(0, 3).map((article, index) => <NewsCard key={index} article={article} />)}
                </div>
            </section>

            {/* Sponsored Ad */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-colors duration-500"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="bg-white p-3 rounded-2xl shadow-lg">
                        <img src="https://cdn.brandfetch.io/idH9OjyiUq/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1748239860810" alt="Lovable.dev Logo" className="w-12 h-12 object-contain"/>
                    </div>
                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider">Sponsored</span>
                            <h4 className="font-bold text-xl text-white">Lovable.dev</h4>
                        </div>
                        <p className="text-gray-300 text-sm max-w-md">Build stunning, full-stack applications with AI. From prompt to deployed app in minutes.</p>
                    </div>
                </div>
                <a href="https://lovable.dev/invite/K9A6723" target="_blank" rel="noopener noreferrer" className="mt-6 md:mt-0 relative z-10 bg-white text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-100 hover:scale-105 transition-all shadow-lg flex items-center gap-2">
                    Try for Free <ArrowRightIcon className="w-4 h-4" />
                </a>
            </div>

            {/* Trending YouTube */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Trending on YouTube</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {trendingVideos.slice(0, 4).map(video => <YouTubeVideoCard key={video.id} video={video} onClick={() => onOpenVideoPlayer(video.id, trendingVideos)} />)}
                </div>
            </section>
            
            {/* Trending Shorts */}
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight flex items-center gap-2">
                    <TikTokIcon className="w-6 h-6 text-red-500" /> Trending Shorts
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {trendingShorts.slice(0, 6).map(video => <YouTubeVideoCard key={video.id} video={video} onClick={() => onOpenVideoPlayer(video.id, trendingShorts)} isShort />)}
                </div>
            </section>
        </div>
    );

    const renderContent = () => {
        if (isLoading) return <div className="flex justify-center py-32"><LogoIcon className="w-12 h-12 animate-spin opacity-20" /></div>;

        switch (activeTab) {
            case 'home': return renderHome();
            case 'news': return (
                <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-gray-900">World News</h2>
                        <div className="text-sm text-gray-500">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {news.map((article, index) => <NewsCard key={index} article={article} />)}
                    </div>
                </div>
            );
            case 'finance': return (
                 <div className="flex flex-col items-center justify-center py-24 text-center animate-[fadeIn_0.5s_ease-out]">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <BarChartIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Finance Dashboard</h3>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">Deep market insights and portfolio tracking are coming in the next update.</p>
                </div>
            );
            case 'videos': return (
                <div className="flex flex-col items-center justify-center py-24 text-center animate-[fadeIn_0.5s_ease-out]">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <VideoIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Video Hub</h3>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">A dedicated space for trending videos and creator content is coming soon.</p>
                </div>
            );
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F9FA]">
            <Header {...headerProps} activeTab="discover" onNavigate={navigate}/>
            <main className="flex-grow flex flex-col items-center px-4 pt-6 pb-16">
                <div className="w-full max-w-[1400px]">
                    {/* Floating Tab Navigation */}
                    <div className="sticky top-4 z-30 flex justify-center mb-8">
                         <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-sm border border-gray-200/60 flex space-x-1">
                            <TabButton label="Home" tabId="home" icon={HomeIcon} />
                            <TabButton label="News" tabId="news" icon={NewspaperIcon} />
                            <TabButton label="Finance" tabId="finance" icon={BarChartIcon} />
                            <TabButton label="Videos" tabId="videos" icon={VideoIcon} />
                        </div>
                    </div>

                    {renderContent()}
                </div>
            </main>
            <Footer onOpenLegalPage={onOpenLegalPage} showCopyright={true} className="pb-6" />
        </div>
    );
};
