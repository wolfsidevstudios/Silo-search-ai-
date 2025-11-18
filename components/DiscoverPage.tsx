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

const YouTubeVideoCard: React.FC<{ video: YouTubeVideo; onClick: () => void; isShort?: boolean }> = ({ video, onClick, isShort }) => (
    <button onClick={onClick} className="bg-white rounded-xl border border-gray-200 overflow-hidden group flex flex-col hover:shadow-lg transition-shadow text-left">
        <div className="relative">
            <img src={video.thumbnailUrl} alt={video.title} className={`${isShort ? 'aspect-[9/16]' : 'aspect-video'} w-full object-cover`} />
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
        if (code === 0) return 'clear_day';
        if (code <= 2) return 'partly_cloudy_day';
        if (code === 3) return 'cloud';
        if (code >= 51 && code <= 67) return 'rainy';
        if (code >= 71 && code <= 77) return 'weather_snowy';
        if (code >= 95) return 'thunderstorm';
        return 'cloud';
    }

    if (!weather) return <div className="discover-weather-card"><LogoIcon className="w-8 h-8 animate-spin" /></div>;

    return (
        <div className="discover-weather-card">
            <h3 className="font-bold text-lg">Weather</h3>
            <div className="flex items-center space-x-4 mt-4">
                <span className="material-icons-outlined text-5xl text-yellow-500">{getWeatherIcon(weather.current.weather_code)}</span>
                <div>
                    <p className="text-5xl font-bold">{Math.round(weather.current.temperature_2m)}°</p>
                    <p className="text-gray-500">Mexticacán</p>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-2 text-center">
                {weather.daily.time.slice(1, 5).map((time: string, i: number) => (
                    <div key={time}>
                        <p className="text-xs font-bold text-gray-500">{new Date(time).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</p>
                        <span className="material-icons-outlined text-3xl my-1">{getWeatherIcon(weather.daily.weather_code[i+1])}</span>
                        <p className="text-sm font-semibold">{Math.round(weather.daily.temperature_2m_max[i+1])}°</p>
                        <p className="text-xs text-gray-400">{Math.round(weather.daily.temperature_2m_min[i+1])}°</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

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
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [newsVideos]);

    const currentStock = stocks[currentStockIndex];
    
    const TabButton: React.FC<{ label: string; tabId: typeof activeTab }> = ({ label, tabId }) => (
      <button onClick={() => setActiveTab(tabId)} className={`py-3 px-4 font-semibold border-b-2 transition-colors text-lg ${activeTab === tabId ? 'text-black border-black' : 'text-gray-500 border-transparent hover:text-black'}`}>
          {label}
      </button>
    );

    const renderHome = () => (
        <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="discover-info-card">{word ? <> <p className="text-xs font-bold text-gray-500 uppercase">Word of the Day</p><h4 className="text-lg font-bold capitalize">{word.word}</h4><p className="text-xs text-gray-500 line-clamp-2">{word.definition}</p> </> : <div className="shimmer h-16 rounded-md"></div>}</div>
                <div className="discover-info-card">{joke ? <> <p className="text-xs font-bold text-gray-500 uppercase">Daily Joke</p><p className="text-sm">{joke}</p> </> : <div className="shimmer h-16 rounded-md"></div>}</div>
                <div className="discover-info-card">{currentStock ? <><p className="text-xs font-bold text-gray-500 uppercase">Stock Market</p><div className="flex justify-between items-baseline"><span className="font-bold text-lg">{currentStock['01. symbol']}</span><span className={`font-semibold text-sm ${parseFloat(currentStock['09. change']) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{parseFloat(currentStock['09. change']) >= 0 ? '+' : ''}{parseFloat(currentStock['09. change']).toFixed(2)}</span></div><span className="font-semibold text-xl">${parseFloat(currentStock['05. price']).toFixed(2)}</span></> : <div className="shimmer h-16 rounded-md"></div>}</div>
                <div className="discover-info-card">{sports.length > 0 ? <> <p className="text-xs font-bold text-gray-500 uppercase">NBA</p><div className="text-xs"><p className="font-semibold truncate">{sports[0].home_team.full_name}</p><p className="font-semibold truncate">{sports[0].visitor_team.full_name}</p></div><div className="text-sm font-bold">{sports[0].home_team_score} - {sports[0].visitor_team_score}</div><p className="text-xs text-gray-500">{sports[0].status}</p> </> : <div className="shimmer h-16 rounded-md"></div>}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 discover-video-carousel">
                    {newsVideos.map((video, index) => (
                        <div key={video.id} className={`carousel-item ${index === carouselIndex ? 'active' : ''}`} onClick={() => onOpenVideoPlayer(video.id, newsVideos)}>
                            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 text-white">
                                <h3 className="text-2xl font-bold line-clamp-2">{video.title}</h3>
                                <p className="text-sm mt-1">{video.channelTitle}</p>
                            </div>
                        </div>
                    ))}
                    <div className="absolute bottom-4 left-4 z-10 flex space-x-2">
                        <button onClick={() => setCarouselIndex(i => (i - 1 + newsVideos.length) % newsVideos.length)} className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"><ArrowLeftIcon/></button>
                        <button onClick={() => setCarouselIndex(i => (i + 1) % newsVideos.length)} className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"><ArrowRightIcon/></button>
                    </div>
                </div>
                <WeatherWidget temperatureUnit="fahrenheit" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {news.slice(0, 3).map((article, index) => <NewsCard key={index} article={article} />)}
            </div>

            <div className="sponsored-ad-card mb-8">
                <img src="https://cdn.brandfetch.io/idH9OjyiUq/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1748239860810" alt="Lovable.dev Logo" className="w-16 h-16 rounded-lg"/>
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Sponsored</p>
                    <h4 className="font-bold text-lg mt-1">Lovable.dev</h4>
                    <p className="text-sm text-gray-300 mt-1">The AI platform for building and deploying intelligent applications with ease.</p>
                </div>
                <a href="https://lovable.dev/invite/K9A6723" target="_blank" rel="noopener noreferrer" className="ml-auto flex-shrink-0 px-4 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                    Get Started
                </a>
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Trending on YouTube</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {trendingVideos.slice(0, 5).map(video => <YouTubeVideoCard key={video.id} video={video} onClick={() => onOpenVideoPlayer(video.id, trendingVideos)} />)}
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Trending Shorts</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {trendingShorts.slice(0, 6).map(video => <YouTubeVideoCard key={video.id} video={video} onClick={() => onOpenVideoPlayer(video.id, trendingShorts)} isShort />)}
                </div>
            </section>
        </>
    );

    const renderContent = () => {
        if (isLoading) return <div className="flex justify-center py-20"><LogoIcon className="w-16 h-16 animate-spin" /></div>;

        switch (activeTab) {
            case 'home': return renderHome();
            case 'news': return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{news.slice(0, 20).map((article, index) => <NewsCard key={index} article={article} />)}</div>;
            case 'finance': return <p className="text-center">Finance tab coming soon.</p>;
            case 'videos': return <p className="text-center">Videos tab coming soon.</p>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen discover-page-bg">
            <Header {...headerProps} activeTab="discover" onNavigate={navigate}/>
            <main className="flex-grow flex flex-col items-center px-4 pt-8 pb-12">
                <div className="w-full max-w-7xl">
                    <div className="flex justify-center space-x-4 sm:space-x-8 border-b mb-8">
                        <TabButton label="Home" tabId="home" />
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