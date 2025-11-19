import { GoogleGenAI, GenerateContentConfig, Type } from "@google/genai";
import type { SearchResult, QuickLink, SearchSettings, Flashcard, QuizItem, MapSearchResult, TravelPlan, CreatorIdeasResult, VideoIdeaSummary, VideoIdeaDetail, DeepResearchResult, Space } from '../types';

export async function fetchSearchResults(query: string, apiKey: string, searchSettings: SearchSettings, isStudyMode: boolean, fileContent?: string): Promise<SearchResult & { estimatedTokens: number }> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const modelName = searchSettings.model || 'gemini-2.5-flash';
  let summaryPrompt: string;
  const config: GenerateContentConfig = {};
  
  if (modelName === 'gemini-2.5-pro') {
    config.thinkingConfig = { thinkingBudget: 8192 };
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
        config: { responseMimeType: "application/json", responseSchema: flashcardSchema, ...(modelName === 'gemini-2.5-pro' && { thinkingConfig: { thinkingBudget: 4096 }}) },
      });

      const quizPromise = ai.models.generateContent({
        model: modelName,
        contents: quizPrompt,
        config: { responseMimeType: "application/json", responseSchema: quizSchema, ...(modelName === 'gemini-2.5-pro' && { thinkingConfig: { thinkingBudget: 4096 }}) },
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

    Examples:
    - "explain src/index.js" -> {"action": "explain_file", "path": "src/index.js"}
    - "can you review pr 123?" -> {"action": "review_pr", "pr_number": 123}
    - "what's the status of issue #45" -> {"action": "summarize_issue", "issue_number": 45}
    - "summarize the whole repo" -> {"action": "summarize_repo"}
    - "how do I run the tests?" -> {"action": "general_question"}
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

export async function fetchDeepResearch(query: string, apiKey: string): Promise<DeepResearchResult> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Generate a comprehensive research report outline for the topic: "${query}".
  The report should be well-structured and detailed. Use Google Search to gather up-to-date information and provide sources.
  Return the response in JSON format.
  - "title": A concise and informative title for the report.
  - "introduction": A brief introductory paragraph.
  - "sections": An array of objects, each with a "title" and "content". The content should be a detailed paragraph, possibly with markdown for lists.
  - "conclusion": A concluding paragraph summarizing the key points.
  - "keyTakeaways": An array of 5-7 distinct, single-sentence key takeaways.
  `;
  
  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      introduction: { type: Type.STRING },
      sections: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING, description: "Detailed content, can include markdown lists." }
          },
          required: ["title", "content"]
        }
      },
      conclusion: { type: Type.STRING },
      keyTakeaways: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["title", "introduction", "sections", "conclusion", "keyTakeaways"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: { 
        tools: [{googleSearch: {}}],
        responseMimeType: "application/json", 
        responseSchema: schema,
        thinkingConfig: { thinkingBudget: 8192 },
      },
    });

    const result: Omit<DeepResearchResult, 'sources'> = JSON.parse(response.text);

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: QuickLink[] = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any): web is QuickLink => !!(web && web.title && web.uri));
    
    return { ...result, sources };

  } catch (error) {
    console.error("Error fetching deep research from Gemini API:", error);
    throw new Error("Failed to get a valid research report from the AI model.");
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

export async function fetchCreatorIdeas(query: string, platform: string, apiKey: string): Promise<CreatorIdeasResult> {
    if (!apiKey) {
      throw new Error("Gemini API key is missing.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
  
    const prompt = `You are a viral content strategist. Generate 5 creative and engaging video ideas for the platform '${platform}' based on the topic: "${query}". For each idea, provide a catchy 'title', a brief 'description' of the video's content and style, and a 'virality_score' from 1 to 10 indicating its potential to go viral. The response should be a JSON object.`;
  
    const ideaSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A catchy, short title for the video." },
        description: { type: Type.STRING, description: "A one or two-sentence description of the video content and format." },
        virality_score: { type: Type.NUMBER, description: 'A score from 1 to 10 representing viral potential.' },
      },
      required: ["title", "description", "virality_score"]
    };

    const schema = {
        type: Type.OBJECT,
        properties: {
            topic: { type: Type.STRING, description: "The original topic provided by the user." },
            platform: { type: Type.STRING, description: "The target platform for the content." },
            ideas: {
                type: Type.ARRAY,
                items: ideaSchema,
                description: "An array of 5 video ideas."
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
  
      const result: CreatorIdeasResult = JSON.parse(response.text);
      return result;
  
    } catch (error) {
      console.error("Error fetching creator ideas from Gemini API:", error);
      throw new Error("Failed to get a valid response from the AI model for creator ideas.");
    }
}

export async function fetchCreatorIdeaDetails(idea: VideoIdeaSummary, topic: string, platform: string, apiKey: string): Promise<VideoIdeaDetail> {
    if (!apiKey) {
      throw new Error("Gemini API key is missing.");
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a viral content strategist. A user has selected a video idea to expand upon.
    Original Topic: "${topic}"
    Target Platform: "${platform}"
    Selected Idea Title: "${idea.title}"
    Selected Idea Description: "${idea.description}"

    Now, generate a detailed content plan for this video idea. The response must be a JSON object containing the following keys:
    - "script": A detailed video script, including scene descriptions, dialogue, and calls to action. Format it with clear sections (e.g., "Intro:", "Main Content:", "Outro:").
    - "titles": An array of 5 catchy, SEO-friendly alternative titles for the video.
    - "description": A well-written video description for the platform, including a summary, relevant links (as placeholders), and a call to action.
    - "tags": An array of 10-15 relevant tags (keywords).
    - "hashtags": An array of 10-15 relevant hashtags (including the '#' prefix).
    - "inspiration": An array of 3-4 bullet points describing creative inspiration, visual styles, or similar successful content formats to draw from.
    - "related_videos": An array of 3 objects, each representing an existing popular video on a similar topic. Each object should have a "title" and a "reason" explaining why it's a good reference.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            script: { type: Type.STRING, description: "A detailed video script." },
            titles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 5 alternative titles." },
            description: { type: Type.STRING, description: "A video description for the platform." },
            tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 10-15 tags." },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 10-15 hashtags." },
            inspiration: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 3-4 inspiration points." },
            related_videos: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    },
                    required: ["title", "reason"]
                },
                description: "Array of 3 related video examples."
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

        const result: VideoIdeaDetail = JSON.parse(response.text);
        return result;

    } catch (error) {
        console.error("Error fetching creator idea details from Gemini API:", error);
        throw new Error("Failed to get a valid response from the AI model for idea details.");
    }
}

export async function fetchNewsSummary(apiKey: string): Promise<{ summary: string; sources: QuickLink[] }> {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Provide a concise, 2-3 sentence summary of the most important news headlines happening right now.`;
  const config: GenerateContentConfig = {
    tools: [{googleSearch: {}}],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: config,
    });

    const summary = response.text;
    if (!summary) {
        throw new Error("Received an empty summary from the API for news.");
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: QuickLink[] = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any): web is QuickLink => !!(web && web.title && web.uri));
    
    return { summary, sources };

  } catch (error) {
    console.error("Error fetching news summary from Gemini API:", error);
    throw new Error("Failed to get a valid news summary from the AI model.");
  }
}

export async function generateSuggestedQuestions(summary: string, apiKey: string): Promise<string[]> {
    if (!apiKey || !summary) {
      return [];
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Based on the following news summary, generate 3 short, insightful follow-up questions a user might be interested in asking.
    Summary: "${summary}"
    Return as a JSON array of strings.`;
    const schema = {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    };
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema },
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Error generating suggested questions:", error);
      return [];
    }
}

export async function fetchSearchSuggestions(query: string, apiKey: string): Promise<string[]> {
    if (!apiKey || !query.trim()) {
      return [];
    }
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Based on the user's partial search query "${query}", generate 3 concise and relevant search suggestions they might be interested in. The suggestions should be completions or related queries.
    Return as a JSON array of strings.`;
    const schema = {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    };
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema },
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      return [];
    }
}

// Fix: Added missing function `fetchSpaceSearchResult`.
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
        // The current SDK doesn't support grounding on specific websites. It's either googleSearch or nothing.
        // I'll assume googleSearch should be used if websites are available, as a proxy for web search capability.
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