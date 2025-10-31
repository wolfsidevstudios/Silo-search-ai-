import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentConfig, Type } from "@google/genai";
import type { AiCreativeTool, ChatMessage, UserProfile, DesignSpec, IllustrationElement } from '../types';
import { Header } from './Header';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { LogoIcon } from './icons/LogoIcon';
import { loadGoogleFonts, searchStreamline } from '../services/designService';

interface DesignEnginePageProps {
  session: { tool: AiCreativeTool, query: string };
  apiKeys: { [key: string]: string };
  onExit: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
}

const designSystemInstruction = `You are a world-class creative design AI. Your task is to generate a design specification in JSON format based on the user's request. The user can ask for a 'youtube-thumbnail', 'poster', or 'presentation-slide'. You have access to all Google Fonts and a vast library of illustrations from StreamlineHQ.

**JSON Schema:**
You MUST respond ONLY with a valid JSON object that adheres to this schema. Do not include any other text or markdown formatting.

{
  "designType": "'youtube-thumbnail' | 'poster' | 'presentation-slide'",
  "aspectRatio": "16/9" | "1/1" | "4/5" | "4/3",
  "backgroundColor": "string", // MUST be one of: 'white', 'light-blue-cream', 'cream', 'classic-cream', 'orange-cream', 'purple-cream', 'pink-cream', 'green-cream', 'peach-cream', 'gray-cream'.
  "elements": [
    {
      "type": "text", "id": "number", "content": "string", "fontFamily": "string", "fontSize": "number", "fontWeight": "number", "color": "string", "textAlign": "'left' | 'center' | 'right'",
      "position": { "x": "number", "y": "number" },
      "size": { "width": "number" }
    },
    {
      "type": "illustration", "id": "number", "searchTerm": "string",
      "position": { "x": "number", "y": "number" },
      "size": { "width": "number", "height": "number" }
    }
  ]
}

**Guidelines:**
- Be creative and generate visually appealing layouts. Use a good mix of text and illustrations.
- Ensure text is readable. Choose fonts and colors that match the user's theme.
- For \`searchTerm\`, be specific and use simple keywords for best results (e.g., 'happy robot', 'abstract background pattern').
- When a user asks for a modification, you will receive their new request. Generate a COMPLETELY NEW JSON object that incorporates the requested changes. Do not just describe the changes.`;

const extractJson = (text: string): string => {
    // Find JSON within ```json ... ``` markdown block
    const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
        return markdownMatch[1];
    }

    // Fallback to finding the first '{' and last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        return text.substring(firstBrace, lastBrace + 1);
    }
    
    // If all else fails, return the raw text
    return text;
};

const DesignCanvas: React.FC<{ spec: DesignSpec | null }> = ({ spec }) => {
    if (!spec) return null;

    return (
        <div 
            className={`relative w-full h-full design-bg-${spec.backgroundColor} overflow-hidden shadow-lg`}
            style={{ aspectRatio: spec.aspectRatio }}
        >
            {spec.elements.map(el => {
                const style: React.CSSProperties = {
                    position: 'absolute',
                    left: `${el.position.x}%`,
                    top: `${el.position.y}%`,
                    width: `${el.size.width}%`,
                    height: el.size.height ? `${el.size.height}%` : 'auto',
                };

                if (el.type === 'text') {
                    return (
                        <div key={el.id} style={{ ...style, fontFamily: `'${el.fontFamily}', sans-serif`, fontSize: `${el.fontSize}px`, fontWeight: el.fontWeight, color: el.color, textAlign: el.textAlign }}>
                            {el.content}
                        </div>
                    );
                }
                
                if (el.type === 'illustration' && el.imageUrl) {
                    return (
                        <img key={el.id} src={el.imageUrl} alt={el.searchTerm} style={{ ...style, objectFit: 'contain' }} />
                    );
                }
                return null;
            })}
        </div>
    );
};


export const DesignEnginePage: React.FC<DesignEnginePageProps> = ({ session, apiKeys, onExit, ...headerProps }) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [designSpec, setDesignSpec] = useState<DesignSpec | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userInput, setUserInput] = useState('');
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const generateDesign = async (prompt: string) => {
        if (!chatRef.current) return;
        setIsLoading(true);
        setDesignSpec(null);
        try {
            const response = await chatRef.current.sendMessage({ message: prompt });
            let spec: DesignSpec;
            try {
                const jsonString = extractJson(response.text);
                spec = JSON.parse(jsonString);
            } catch (e) {
                console.error("Failed to parse JSON from AI response:", response.text);
                throw new Error("The AI returned an invalid design format. Please try rephrasing your request.");
            }

            // Fetch illustrations
            const illustrationPromises = spec.elements.filter(el => el.type === 'illustration').map(async el => {
                const illEl = el as IllustrationElement;
                const imageUrl = await searchStreamline(illEl.searchTerm, apiKeys.streamline);
                return { ...illEl, imageUrl: imageUrl || undefined };
            });

            const illustrations = await Promise.all(illustrationPromises);
            
            // Update spec with image URLs
            const finalSpec: DesignSpec = {
                ...spec,
                elements: spec.elements.map(el => {
                    if (el.type === 'illustration') {
                        return illustrations.find(i => i.id === el.id) || el;
                    }
                    return el;
                })
            };
            
            // Load fonts
            const fontFamilies = finalSpec.elements.filter(el => el.type === 'text').map(el => (el as any).fontFamily);
            loadGoogleFonts(fontFamilies);

            setDesignSpec(finalSpec);
            return `Here is the first draft for: "${prompt}"`;
        } catch (err) {
            console.error("AI design generation error:", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const startSession = async () => {
            if (!apiKeys.gemini) {
                alert('Please set your Gemini API key in settings.');
                onExit();
                return;
            }
            if (!apiKeys.streamline) {
                alert('Please set your StreamlineHQ API key in settings to use illustrations.');
            }
            
            const ai = new GoogleGenAI({ apiKey: apiKeys.gemini });
            chatRef.current = ai.chats.create({ 
              model: 'gemini-2.5-flash',
              config: { systemInstruction: designSystemInstruction }
            });

            setChatHistory([{ role: 'user', text: session.query }]);
            try {
                const modelResponseText = await generateDesign(session.query);
                setChatHistory(prev => [...prev, { role: 'model', text: modelResponseText || "An error occurred." }]);
            } catch (e: any) {
                setChatHistory(prev => [...prev, { role: 'model', text: `Sorry, I encountered an error: ${e.message}` }]);
            }
        };
        startSession();
    }, [session.query, apiKeys, onExit]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !userInput.trim() || !chatRef.current) return;

        const userMessage: ChatMessage = { role: 'user', text: userInput };
        setChatHistory(prev => [...prev, userMessage]);
        setUserInput('');
        
        try {
            const modelResponseText = await generateDesign(userInput);
            setChatHistory(prev => [...prev, { role: 'model', text: modelResponseText || "An error occurred." }]);
        } catch (e: any) {
             setChatHistory(prev => [...prev, { role: 'model', text: `Sorry, I encountered an error: ${e.message}` }]);
        }
    };
    
    return (
        <div className="flex flex-col h-screen bg-white">
            <Header {...headerProps} onHome={onExit} showHomeButton={true} />
            <div className="flex-grow flex flex-col md:flex-row min-h-0">
                <div className="w-full md:w-2/3 lg:w-3/4 flex-grow relative bg-gray-200 p-4 md:p-8 flex items-center justify-center">
                    {isLoading && !designSpec && (
                        <div className="flex flex-col items-center justify-center text-center">
                            <LogoIcon className="w-12 h-12 animate-spin" />
                            <p className="mt-4 text-gray-600">Generating your design...</p>
                        </div>
                    )}
                    {designSpec && <DesignCanvas spec={designSpec} />}
                </div>
                <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col bg-gray-50 border-l h-1/2 md:h-auto">
                    <div className="flex-grow p-4 overflow-y-auto space-y-4">
                        {chatHistory.map((msg, index) => (
                          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg py-2 px-3 max-w-xs ${msg.role === 'user' ? 'bg-black text-white' : 'bg-white border text-gray-800'}`}>
                              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                        {isLoading && <div className="text-center text-sm text-gray-500">Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t bg-gray-50">
                        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Describe your changes..."
                            className="w-full px-4 py-2 bg-white rounded-full outline-none border-2 border-gray-200 focus:border-black"
                            disabled={isLoading}
                          />
                          <button
                            type="submit"
                            disabled={isLoading || !userInput.trim()}
                            className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-black text-white rounded-full disabled:bg-gray-300"
                          >
                            <ArrowUpIcon />
                          </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
