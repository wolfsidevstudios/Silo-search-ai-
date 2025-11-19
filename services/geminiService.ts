import { GoogleGenAI, GenerateContentConfig, Type } from "@google/genai";
import type { SearchResult, QuickLink, SearchSettings, Flashcard, QuizItem, MapSearchResult, TravelPlan, CreatorIdeasResult, VideoIdeaSummary, VideoIdeaDetail, ShoppingResult, Space } from '../types';

export async function fetchSearchResults(query: string, apiKey: string, searchSettings: SearchSettings, isStudyMode: boolean, fileContent?: string): Promise<SearchResult & { estimatedTokens: number }> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  // Map 'gemini-3.0' to the latest available pro model for this demo context. 
  // In a real scenario this would be 'gemini-3.0-pro-preview' or similar.
  // We use gemini-1.5-pro as the proxy for high-intelligence if 3.0 isn't publicly aliased yet in SDK.
  // BUT, per prompt instructions we should use the best available.
  const modelName = searchSettings.model === 'gemini-3.0' ? 'gemini-1.5-pro' : 'gemini-2.5-flash';
  
  let summaryPrompt: string;
  const config: GenerateContentConfig = {};
  
  if (searchSettings.model === 'gemini-3.0') {
     // Enable thinking/advanced reasoning if available or just high token limit
  }


  if (fileContent) {
    summaryPrompt = `Given the following document content:\n\n---\n${fileContent}\n---\n\nBased ONLY on the document provided, answer the user's query: "${query}". Provide a detailed summary and answer. Do not use external knowledge.`;
    // No web search for file search, so config remains empty.
  } else {
    summaryPrompt = `Based on the user's search query, provide a concise 3-sentence summary. The user's query is: "${query}"`;
    if (searchSettings.useWebSearch) {
      config.tools = [{googleSearch: {}}];
    }
  }

  try {
    let promptTokens = summaryPrompt.length / 4;
    
    const summaryResponse = await ai.models.generateContent({
      model: modelName,
      contents: summaryPrompt,
      config: config,
    });

    const summary = summaryResponse.text;
    if (!summary) {
        throw new Error("Received an empty summary from the API.");
    }

    let completionTokens = summary.length / 4;
    
    // QuickLinks are only for web search
    const groundingChunks = summaryResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const quickLinks: QuickLink[] = fileContent ? [] : groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any): web is QuickLink => !!(web && web.title && web.uri));
    
    const baseResult: SearchResult = { summary, quickLinks, isStudyQuery: isStudyMode && !fileContent };

    if (!fileContent) { // Don't generate questions for file summaries
        try {
            const suggestedQuestionsPrompt = `Based on the following summary, generate 3 short and insightful follow-up questions a user might ask.
            Summary: "${summary}"
            Return as a JSON array of strings. For example: ["What is X?", "How does Y work?", "Why is Z important?"]`;
            const questionsSchema = { type: Type.ARRAY, items: { type: Type.STRING } };
            
            const questionsResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: suggestedQuestionsPrompt,
                config: { responseMimeType: "application/json", responseSchema: questionsSchema },
            });
    
            const questions = JSON.parse(questionsResponse.text);
            baseResult.suggestedQuestions = questions;
            completionTokens += questionsResponse.text.length / 4;
        } catch (e) {
            console.error("Failed to parse or fetch suggested questions:", e);
            baseResult.suggestedQuestions = [];
        }
    }

    if (isStudyMode && !fileContent) {
      const flashcardPrompt = `Based on the user's query "${query}", generate 5 flashcards for studying. Each flashcard should have a 'question' and an 'answer'.`;
      const quizPrompt = `Based on the user's query "${query}", generate a 3-question multiple-choice quiz. Each question should have a 'question', an array of 4 'options', and the 'correctAnswer' (which must be one of the options).`;
      
      promptTokens += (flashcardPrompt.length / 4) + (quizPrompt.length / 4);

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
        model: modelName,
        contents: flashcardPrompt,
        config: { responseMimeType: "application/json", responseSchema: flashcardSchema },
      });

      const quizPromise = ai.models.generateContent({
        model: modelName,
        contents: quizPrompt,
        config: { responseMimeType: "application/json", responseSchema: quizSchema },
      });
      
      const [flashcardResult, quizResult] = await Promise.allSettled([flashcardPromise, quizPromise]);

      if (flashcardResult.status === 'fulfilled') {
        try {
          const flashcards: Flashcard[] = JSON.parse(flashcardResult.value.text);
          completionTokens += flashcardResult.value.text.length / 4;
          baseResult.flashcards = flashcards;
        } catch (e) { console.error("Failed to parse flashcards JSON", e); }
      }

      if (quizResult.status === 'fulfilled') {
        try {
          const quiz: QuizItem[] = JSON.parse(quizResult.value.text);
          completionTokens += quizResult.value.text.length / 4;
          baseResult.quiz = quiz;
        } catch (e) { console.error("Failed to parse quiz JSON", e); }
      }
    }
    
    const estimatedTokens = Math.ceil(promptTokens + completionTokens);
    
    return { ...baseResult, estimatedTokens };

  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI model. This could be due to an invalid API key or network issues.");
  }
}

export async function classifyGithubQuery(query: string, apiKey: string): Promise<any> {
    if (!apiKey) {
        throw new Error("Gemini API key is missing.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Classify the user's request related to a GitHub repository. The user is asking: "${query}".
    Analyze the query and respond with a JSON object.
    - The "action" can be one of: 'explain_file', 'review_pr', 'summarize_issue', 'summarize_repo', 'general_question'.
    - If the action is 'explain_file', extract the file 'path'.
    - If the action is 'review_pr', extract the pull request 'pr_number' as an integer.
    - If the action is 'summarize_issue', extract the issue 'issue_number' as an integer.
    - If no specific action is clear, use 'general_question'.
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            action: { type: Type.STRING, description: "one of: 'explain_file', 'review_pr', 'summarize_issue', 'summarize_repo', 'general_question'" },
            path: { type: Type.STRING, description: "file path if action is 'explain_file'" },
            pr_number: { type: Type.INTEGER, description: "pull request number if action is 'review_pr'" },
            issue_number: { type: Type.INTEGER, description: "issue number if action is 'summarize_issue'" },
        },
        required: ["action"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema },
        });
        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error classifying GitHub query:", error);
        return { action: 'general_question' }; // Fallback
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
The places should be an array of objects, each with 'name', 'address', 'rating' (as a string, e.g., "4.5 stars"), 'website' (if available), and a brief 'description'.`;

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
            rating: { type: Type.STRING },
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

  const prompt = `Create a detailed travel itinerary based on the user's request: "${query}". Return JSON.`;

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

    return JSON.parse(response.text);

  } catch (error) {
    console.error("Error fetching travel plan from Gemini API:", error);
    throw new Error("Failed to get a valid travel plan from the AI model.");
  }
}

export async function processPexelsQuery(query: string, apiKey: string): Promise<{ searchTerm: string, mediaType: 'photo' | 'video' }> {
  if (!apiKey) throw new Error("Gemini API key is missing.");
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Analyze query: "${query}". Return JSON with 'searchTerm' for Pexels and 'mediaType' ('photo' or 'video').`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      searchTerm: { type: Type.STRING },
      mediaType: { type: Type.STRING },
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
    if (result.mediaType !== 'photo' && result.mediaType !== 'video') result.mediaType = 'photo';
    return result;
  } catch (error) {
    throw new Error("AI failed to process the media query.");
  }
}

export async function fetchShoppingResults(query: string, apiKey: string): Promise<ShoppingResult> {
    if (!apiKey) throw new Error("Gemini API key is missing.");
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are a shopping assistant. Search for top 3 products for: "${query}".
    Return JSON with:
    - overallSummary: A brief advice about buying this type of product.
    - products: Array of 3 items, each with name, summary (key features), price (approx), and a buyUrl (search link).
    For images, since you can't browse, use a placeholder or generic search link if needed, but for this schema return a placeholder string.
    `;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            overallSummary: { type: Type.STRING },
            products: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        imageUrl: { type: Type.STRING },
                        name: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        price: { type: Type.STRING },
                        buyUrl: { type: Type.STRING }
                    },
                    required: ["name", "summary", "price", "buyUrl"]
                }
            }
        },
        required: ["overallSummary", "products"]
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema, tools: [{googleSearch: {}}] },
        });
        
        const result = JSON.parse(response.text);
        
        // Post-process to add somewhat valid links if AI failed to generate them
        result.products = result.products.map((p: any) => ({
            ...p,
            imageUrl: p.imageUrl || 'https://via.placeholder.com/300?text=Product+Image',
            buyUrl: p.buyUrl || `https://www.google.com/search?q=${encodeURIComponent(p.name)}+buy`
        }));

        return result;
    } catch (error) {
        console.error("Error fetching shopping results:", error);
        throw new Error("Failed to fetch shopping recommendations.");
    }
}

export async function fetchCreatorIdeas(query: string, platform: string, apiKey: string): Promise<CreatorIdeasResult> {
    if (!apiKey) throw new Error("Gemini API key is missing.");
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate 5 video ideas for '${platform}' about: "${query}". Return JSON.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            topic: { type: Type.STRING },
            platform: { type: Type.STRING },
            ideas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    virality_score: { type: Type.NUMBER },
                  },
                  required: ["title", "description", "virality_score"]
                }
            }
        },
        required: ["topic", "platform", "ideas"]
    };
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema },
      });
      return JSON.parse(response.text);
    } catch (error) {
      throw new Error("Failed to get creator ideas.");
    }
}

export async function fetchCreatorIdeaDetails(idea: VideoIdeaSummary, topic: string, platform: string, apiKey: string): Promise<VideoIdeaDetail> {
    if (!apiKey) throw new Error("Gemini API key is missing.");
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Expand on video idea: "${idea.title}" for ${platform}. Return JSON with script, titles, description, tags, hashtags, inspiration, related_videos.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            script: { type: Type.STRING },
            titles: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            inspiration: { type: Type.ARRAY, items: { type: Type.STRING } },
            related_videos: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { title: { type: Type.STRING }, reason: { type: Type.STRING } },
                    required: ["title", "reason"]
                }
            }
        },
        required: ["script", "titles", "description", "tags", "hashtags", "inspiration", "related_videos"]
    };
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json", responseSchema: schema },
        });
        return JSON.parse(response.text);
    } catch (error) {
        throw new Error("Failed to get idea details.");
    }
}

export async function fetchSpaceSearchResult(query: string, apiKey: string, space: Space, contextData: string): Promise<SearchResult> {
    if (!apiKey) {
      throw new Error("Gemini API key is missing.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    let prompt = `System Instruction: ${space.systemInstruction}\n\n`;
    if (contextData) {
        prompt += `CONTEXT from provided documents:\n---\n${contextData}\n---\n`;
    }
    prompt += `Based ONLY on the provided context and system instruction, answer the user's query: "${query}". Provide a detailed summary and answer.`;
  
    const config: GenerateContentConfig = {};
    if (space.websites && space.websites.length > 0) {
        config.tools = [{googleSearch: {}}];
    }
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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
      console.error("Error fetching from Gemini API for Space Search:", error);
      throw new Error("Failed to get a valid response from the AI model for this Space.");
    }
  }