import type { StockQuote } from '../types';

const STOCK_API_KEY = 'B255MQKKF39YO1V8';
const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];

export async function fetchStockQuotes(): Promise<StockQuote[]> {
    try {
        const quotes = await Promise.all(SYMBOLS.map(async symbol => {
            const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${STOCK_API_KEY}`);
            if (!response.ok) {
                console.error(`Stock API request for ${symbol} failed with status:`, response.status);
                return null;
            }
            const data = await response.json();
            if (data['Global Quote']) {
                return data['Global Quote'];
            }
            if (data['Note']) {
                console.warn(`Stock API limit reached for ${symbol}: ${data['Note']}`);
            }
            return null;
        }));
        return quotes.filter((q): q is StockQuote => q !== null);
    } catch (error) {
        console.error("Error fetching stocks:", error);
        return [];
    }
}
