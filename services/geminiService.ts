import { GoogleGenAI, Type } from "@google/genai";
import type { SearchResult } from '../types';

const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("API_KEY has not been configured.");
}

const ai = new GoogleGenAI({ apiKey });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise and helpful summary of the search query, written in exactly 3 sentences."
    },
    quickLinks: {
      type: Type.ARRAY,
      description: "An array of exactly 5 related search terms or follow-up questions that a user might be interested in.",
      items: {
        type: Type.STRING
      }
    }
  },
  required: ["summary", "quickLinks"]
};

export async function fetchSearchResults(query: string): Promise<SearchResult> {
  const prompt = `Based on the user's search query, provide a concise 3-sentence summary and 5 related "quick link" search terms. The user's query is: "${query}"`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText);
    
    // Basic validation
    if (!parsedResult.summary || !Array.isArray(parsedResult.quickLinks)) {
        throw new Error("Invalid data structure received from API.");
    }

    return parsedResult as SearchResult;

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
}