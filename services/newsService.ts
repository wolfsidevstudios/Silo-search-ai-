import type { NewsArticle } from '../types';

const NEWS_API_KEY = '51663a890f03415aa4cf2502d6b01435';
const NEWS_API_URL = `https://api.worldnewsapi.com/top-news?source-country=us&language=en&api-key=${NEWS_API_KEY}`;

interface WorldNewsArticle {
    summary: string | null;
    image: string | null;
    author: string | null;
    url: string;
    title: string;
    publish_date: string;
}

export async function fetchTopHeadlines(): Promise<NewsArticle[]> {
    try {
        const response = await fetch(NEWS_API_URL);
        if (!response.ok) {
            console.error("World News API request failed with status:", response.status);
            return [];
        }
        const data = await response.json();
        
        if (data.top_news && data.top_news.length > 0) {
            const articles: WorldNewsArticle[] = data.top_news.flatMap((topic: any) => topic.news || []);
            return articles.map((article: WorldNewsArticle): NewsArticle => {
                let sourceName = 'Unknown Source';
                try {
                    sourceName = new URL(article.url).hostname.replace(/^www\./, '');
                } catch (e) {
                    console.warn(`Could not parse URL for source name: ${article.url}`);
                }

                return {
                    source: { name: sourceName },
                    author: article.author,
                    title: article.title,
                    description: article.summary,
                    url: article.url,
                    urlToImage: article.image,
                    publishedAt: article.publish_date,
                };
            });
        } else {
            if (data.message) {
                 console.error("World News API returned error:", data.message);
            } else {
                 console.error("World News API returned unexpected data structure:", data);
            }
            return [];
        }
    } catch (error) {
        console.error("Error fetching world news:", error);
        return [];
    }
}