import { GoogleGenAI, GenerateContentConfig, Type } from "@google/genai";
import type { SearchResult, QuickLink, SearchSettings, Flashcard, QuizItem, MapSearchResult, TravelPlan, ShoppingResult, Product } from '../types';

export async function fetchSearchResults(query: string, apiKey: string, searchSettings: SearchSettings, isStudyMode: boolean): Promise<SearchResult> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const summaryPrompt = `Based on the user's search query, provide a concise 3-sentence summary. The user's query is: "${query}"`;
  
  const config: GenerateContentConfig = {};
  if (searchSettings.useWebSearch || searchSettings.model === 's1-mini') {
    config.tools = [{googleSearch: {}}];
  }

  try {
    const summaryResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: summaryPrompt,
      config: config,
    });

    const summary = summaryResponse.text;
    if (!summary) {
        throw new Error("Received an empty summary from the API.");
    }
    
    const groundingChunks = summaryResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const quickLinks: QuickLink[] = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any): web is QuickLink => !!(web && web.title && web.uri));
    
    const baseResult: SearchResult = { summary, quickLinks, isStudyQuery: isStudyMode };

    if (isStudyMode) {
      const flashcardPrompt = `Based on the user's query "${query}", generate 5 flashcards for studying. Each flashcard should have a 'question' and an 'answer'.`;
      const quizPrompt = `Based on the user's query "${query}", generate a 3-question multiple-choice quiz. Each question should have a 'question', an array of 4 'options', and the 'correctAnswer' (which must be one of the options).`;

      const flashcardSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
          },
          required: ["question", "answer"]
        }
      };

      const quizSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.STRING },
          },
          required: ["question", "options", "correctAnswer"]
        }
      };
      
      const flashcardPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: flashcardPrompt,
        config: { responseMimeType: "application/json", responseSchema: flashcardSchema },
      });

      const quizPromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: quizPrompt,
        config: { responseMimeType: "application/json", responseSchema: quizSchema },
      });
      
      const [flashcardResult, quizResult] = await Promise.allSettled([flashcardPromise, quizPromise]);

      if (flashcardResult.status === 'fulfilled') {
        try {
          const flashcards: Flashcard[] = JSON.parse(flashcardResult.value.text);
          baseResult.flashcards = flashcards;
        } catch (e) { console.error("Failed to parse flashcards JSON", e); }
      }

      if (quizResult.status === 'fulfilled') {
        try {
          const quiz: QuizItem[] = JSON.parse(quizResult.value.text);
          baseResult.quiz = quiz;
        } catch (e) { console.error("Failed to parse quiz JSON", e); }
      }
    }
    
    return baseResult;

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model. This could be due to an invalid API key or network issues.");
  }
}

export async function fetchMapSearchResults(query: string, apiKey: string): Promise<MapSearchResult> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `For the user query "${query}", find relevant places and determine a bounding box for the general area of the query.
Return the results in JSON format.
The bounding box should be an array of four numbers: [minimum longitude, minimum latitude, maximum longitude, maximum latitude].
The places should be an array of objects, each with 'name', 'address', 'rating' (as a string, e.g., "4.5 stars"), 'website' (if available), and a brief 'description'.
If the query is for a specific type of place in a location (e.g., 'best hotels in Hawaii'), list those places.
If the query is just a location (e.g., 'Paris'), list popular landmarks or points of interest in that location.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      places: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            address: { type: Type.STRING },
            rating: { type: Type.STRING, description: 'e.g., "4.5 stars"' },
            website: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ['name', 'address', 'description']
        }
      },
      locationName: { type: Type.STRING },
      boundingBox: {
        type: Type.ARRAY,
        items: { type: Type.NUMBER },
        description: '[min longitude, min latitude, max longitude, max latitude]'
      }
    },
    required: ['places', 'locationName', 'boundingBox']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: schema },
    });

    const result: MapSearchResult = JSON.parse(response.text);
    return result;

  } catch (error) {
    console.error("Error fetching map results from Gemini API:", error);
    throw new Error("Failed to get a valid map response from the AI model.");
  }
}

export async function fetchTravelPlan(query: string, apiKey: string): Promise<TravelPlan> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Create a detailed travel itinerary based on the user's request: "${query}".
The plan should be comprehensive and practical.
Return the results in JSON format.
- The 'destination' should be the primary location.
- The 'duration' should be stated clearly.
- The 'budget' should be an estimated range.
- 'flightDetails' should offer general advice for booking flights.
- 'accommodation' should suggest a 'type' (e.g., 'Hotels', 'Hostels', 'Airbnb') and a few specific 'suggestions'.
- The 'itinerary' should be an array of daily plans. Each day needs a 'day' number, a 'title' (e.g., 'Arrival and Shinjuku Exploration'), and an array of 'activities'.
- Each 'activity' must have a 'time' (e.g., 'Morning', '9:00 AM', 'Afternoon') and a 'description'.
- Include a 'packingList' of essential items.
- Provide some useful 'localTips'.
- Finally, provide a 'mapBoundingBox' for the destination as an array of four numbers: [minimum longitude, minimum latitude, maximum longitude, maximum latitude].`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      destination: { type: Type.STRING },
      duration: { type: Type.STRING },
      budget: { type: Type.STRING },
      flightDetails: {
        type: Type.OBJECT,
        properties: { advice: { type: Type.STRING } },
        required: ['advice'],
      },
      accommodation: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['type', 'suggestions'],
      },
      itinerary: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.INTEGER },
            title: { type: Type.STRING },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING },
                },
                required: ['time', 'description'],
              },
            },
          },
          required: ['day', 'title', 'activities'],
        },
      },
      packingList: { type: Type.ARRAY, items: { type: Type.STRING } },
      localTips: { type: Type.ARRAY, items: { type: Type.STRING } },
      mapBoundingBox: {
        type: Type.ARRAY,
        items: { type: Type.NUMBER },
        description: '[min longitude, min latitude, max longitude, max latitude]',
      },
    },
    required: ['destination', 'duration', 'budget', 'flightDetails', 'accommodation', 'itinerary', 'packingList', 'localTips', 'mapBoundingBox'],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: schema },
    });

    const result: TravelPlan = JSON.parse(response.text);
    return result;

  } catch (error) {
    console.error("Error fetching travel plan from Gemini API:", error);
    throw new Error("Failed to get a valid travel plan from the AI model.");
  }
}

async function scrapeUrlWithScrapingBee(url: string, apiKey: string): Promise<string> {
    const endpoint = `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(url)}&render_js=true`;
    try {
        const response = await fetch(`https://proxy.cors.sh/${endpoint}`, {
            headers: {
                'x-cors-api-key': 'temp_1a2c3b4d5e6f7g8h9i0j',
            }
        });

        if (!response.ok) {
            throw new Error(`ScrapingBee API error: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Failed to scrape URL ${url}:`, error);
        // Fallback for direct fetch if proxy fails
        try {
            const response = await fetch(endpoint);
            if (!response.ok) throw new Error(`ScrapingBee API error (direct): ${response.statusText}`);
            return await response.text();
        } catch (directError) {
             console.error(`Direct fetch for URL ${url} also failed:`, directError);
             throw directError;
        }
    }
}

export async function fetchShoppingResults(query: string, geminiApiKey: string, scrapingBeeApiKey: string): Promise<ShoppingResult> {
    if (!geminiApiKey) {
        throw new Error("Gemini API key is missing.");
    }
    if (!scrapingBeeApiKey) {
        throw new Error("ScrapingBee API key is missing. Please add it in settings.");
    }

    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    // Step 1: Find product URLs
    const findUrlsPrompt = `Based on the user's shopping query "${query}", find the top 3 most relevant product page URLs from major e-commerce sites using Google Search. Return a JSON object with a single key "urls" which is an array of strings.`;
    const urlSchema = {
        type: Type.OBJECT,
        properties: {
            urls: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['urls']
    };

    const urlResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: findUrlsPrompt,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: urlSchema
        },
    });
    
    const { urls } = JSON.parse(urlResponse.text);
    if (!urls || urls.length === 0) {
        throw new Error("Could not find any relevant product pages.");
    }

    // Step 2 & 3: Scrape pages and extract data
    const products: Product[] = [];
    
    const productSchema = {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING, description: "The full name of the product." },
            summary: { type: Type.STRING, description: "A concise summary of the product's features and why it's recommended." },
            price: { type: Type.STRING, description: "The current price of the product as a string (e.g., '$199.99'). If not found, use 'Price not available'." },
            imageUrl: { type: Type.STRING, description: "A direct, publicly accessible URL to a high-quality image of the product. Find the best one from the page content." }
        },
        required: ['name', 'summary', 'price', 'imageUrl']
    };

    for (const url of urls.slice(0, 3)) {
        try {
            const htmlContent = await scrapeUrlWithScrapingBee(url, scrapingBeeApiKey);
            const manageableHtml = htmlContent.substring(0, 100000); 

            const extractDataPrompt = `From the following HTML content of a product page, extract the product details. Focus on the main content and ignore irrelevant parts like headers, footers, and ads. HTML: """${manageableHtml}"""`;

            const productDataResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: extractDataPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: productSchema
                },
            });

            const productData = JSON.parse(productDataResponse.text);
            products.push({ ...productData, buyUrl: url });
        } catch (error) {
            console.error(`Failed to process URL ${url}:`, error);
        }
    }

    if (products.length === 0) {
        throw new Error("Failed to extract product information from any of the found pages. This could be due to anti-scraping measures or an invalid ScrapingBee API key.");
    }

    // Step 4: Generate overall summary
    const summaryPrompt = `Based on these product findings for the query "${query}", write a brief overall summary of your recommendations. Products: ${JSON.stringify(products)}`;
    
    const summaryResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: summaryPrompt,
    });
    const overallSummary = summaryResponse.text;

    return { products, overallSummary };
}

export async function processPexelsQuery(query: string, apiKey: string): Promise<{ searchTerm: string, mediaType: 'photo' | 'video' }> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Analyze the user's query: "${query}".
Determine the primary search term for a stock media website (like Pexels) and whether the user wants 'photo' or 'video'.
If the query contains words like "video", "clip", "footage", or "motion", the mediaType should be 'video'.
If it contains "image", "photo", "picture", "still", or "snapshot", it should be 'photo'.
If neither is specified, default to 'photo'.
Return a JSON object with 'searchTerm' and 'mediaType'.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      searchTerm: { type: Type.STRING, description: 'The core subject of the search query.' },
      mediaType: { type: Type.STRING, description: "Should be either 'photo' or 'video'." },
    },
    required: ['searchTerm', 'mediaType']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: schema },
    });

    const result = JSON.parse(response.text);
    if (result.mediaType !== 'photo' && result.mediaType !== 'video') {
        result.mediaType = 'photo'; // Fallback
    }
    return result;

  } catch (error) {
    console.error("Error processing Pexels query with Gemini:", error);
    throw new Error("AI failed to process the media query.");
  }
}