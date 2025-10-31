import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { NavigationTabs } from './NavigationTabs';
import { fetchTopHeadlines } from '../services/newsService';
import { fetchStockQuotes } from '../services/stockService';
import type { NewsArticle, StockQuote, UserProfile } from '../types';
import { LogoIcon } from './icons/LogoIcon';

interface DiscoverPageProps {
  navigate: (path: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
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
            <h3 className="font-bold text-gray-800 group-hover:text-black">{article.title}</h3>
            <p className="text-xs text-gray-500 mt-2">{new Date(article.publishedAt).toLocaleDateString()} &bull; {article.source.name}</p>
        </div>
    </a>
);


export const DiscoverPage: React.FC<DiscoverPageProps> = ({ navigate, onOpenLegalPage, ...headerProps }) => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [stocks, setStocks] = useState<StockQuote[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const [newsData, stockData] = await Promise.all([
                fetchTopHeadlines(),
                fetchStockQuotes()
            ]);
            setNews(newsData.filter(a => a.urlToImage)); // Only show articles with images
            setStocks(stockData);
            setIsLoading(false);
        };
        loadData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header {...headerProps} />
            <main className="flex-grow flex flex-col items-center px-4 pb-12">
                <NavigationTabs activeTab="discover" onNavigate={navigate} />
                {isLoading ? (
                     <div className="flex flex-col items-center justify-center flex-grow">
                        <LogoIcon className="w-16 h-16 animate-spin" />
                        <p className="mt-4 text-gray-600">Discovering what's new...</p>
                    </div>
                ) : (
                    <div className="w-full max-w-7xl">
                        <section className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Market Snapshot</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                                {stocks.map(stock => <StockCard key={stock['01. symbol']} stock={stock} />)}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Headlines</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {news.slice(0, 12).map((article, index) => <NewsCard key={index} article={article} />)}
                            </div>
                        </section>
                    </div>
                )}
            </main>
            <Footer onOpenLegalPage={onOpenLegalPage} showCopyright={true} className="pb-6" />
        </div>
    );
};
