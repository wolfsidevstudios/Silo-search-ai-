import { GoogleGenAI } from "@google/genai";
import type { SearchResult, QuickLink } from '../types';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("API_KEY has not been configured.");
}

const ai = new GoogleGenAI({ apiKey });

export async function fetchSearchResults(query: string): Promise<SearchResult> {
  const prompt = `Based on the user's search query, provide a concise 3-sentence summary. The user's query is: "${query}"`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
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
    throw new Error("Failed to get a valid response from the AI model.");
  }
}