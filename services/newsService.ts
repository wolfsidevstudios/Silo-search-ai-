import type { NewsArticle } from '../types';

const NEWS_API_KEY = 'eaf5164609874d75b4f00011ec6d819b';
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${NEWS_API_KEY}`;

export async function fetchTopHeadlines(): Promise<NewsArticle[]> {
    try {
        const response = await fetch(NEWS_API_URL);
        if (!response.ok) {
            console.error("News API request failed with status:", response.status);
            return [];
        }
        const data = await response.json();
        if (data.status === 'ok') {
            return data.articles;
        } else {
            console.error("News API returned error:", data.message);
            return [];
        }
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}
