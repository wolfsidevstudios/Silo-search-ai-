import { GoogleGenAI, GenerateContentConfig } from "@google/genai";
import type { SearchResult, QuickLink, SearchSettings } from '../types';

export async function fetchSearchResults(query: string, apiKey: string, searchSettings: SearchSettings): Promise<SearchResult> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Based on the user's search query, provide a concise 3-sentence summary. The user's query is: "${query}"`;
  
  const config: GenerateContentConfig = {};
  if (searchSettings.useWebSearch || searchSettings.model === 's1-mini') {
    config.tools = [{googleSearch: {}}];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // S1 Mini is an alias for Flash with forced web search
      contents: prompt,
      config: config,
    });

    const summary = response.text;
    if (!summary) {
        throw new Error("Received an empty summary from the API.");
    }
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const quickLinks: QuickLink[] = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any): web is QuickLink => !!(web && web.title && web.uri));
    
    return { summary, quickLinks };

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model. This could be due to an invalid API key or network issues.");
  }
}
