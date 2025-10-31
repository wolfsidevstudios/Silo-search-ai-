import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import type { AiCreativeTool, ChatMessage, UserProfile } from '../types';
import { Header } from './Header';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { LogoIcon } from './icons/LogoIcon';

interface AiResultPageProps {
  session: { tool: AiCreativeTool, query: string };
  geminiApiKey: string;
  onExit: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
}

const getSystemInstruction = (tool: AiCreativeTool): string => {
    switch (tool) {
        case 'docs':
            return "You are a professional technical writer. Your task is to create a well-structured and beautifully formatted document in Markdown based on the user's request. Use headings, lists, bold text, and other markdown features to make the document clear and readable. Respond only with the Markdown content.";
        case 'code':
            return "You are an expert web developer. Your task is to create a complete, single-file HTML application based on the user's description. The response must be a single block of HTML code. Include all necessary HTML, CSS (in a <style> tag), and JavaScript (in a <script> tag) in one file. Respond ONLY with the raw HTML code. Do not include any explanations, markdown formatting, or any text outside of the HTML code block.";
        default:
            return "You are a helpful assistant.";
    }
};

const CodePreview: React.FC<{ html: string }> = ({ html }) => {
    const [showCode, setShowCode] = useState(false);
    
    const handleDownload = () => {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'code.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-shrink-0 p-2 border-b flex justify-end items-center space-x-4">
                <button onClick={() => setShowCode(!showCode)} className="px-3 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded-md">{showCode ? 'Show Preview' : 'Show Code'}</button>
                <button onClick={handleDownload} className="px-3 py-1 text-xs font-semibold bg-black text-white rounded-md">Download</button>
            </div>
            <div className="flex-grow bg-white relative">
                {showCode ? (
                    <pre className="w-full h-full overflow-auto p-4 text-sm bg-gray-800 text-white"><code>{html}</code></pre>
                ) : (
                    <iframe srcDoc={html} title="Code Preview" className="w-full h-full border-none" sandbox="allow-scripts allow-forms" />
                )}
            </div>
        </div>
    );
};

const DocPreview: React.FC<{ markdown: string }> = ({ markdown }) => {
    // A very basic markdown to HTML converter for presentation
    const renderMarkdown = (md: string) => {
        return md
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2">$1</h3>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*)\*/g, '<em>$1</em>')
            .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc list-inside mb-4">$1</ul>')
            .replace(/\n/g, '<br />');
    };
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-grow bg-white p-6 overflow-y-auto">
                <div className="prose prose-sm max-w-full" dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
            </div>
        </div>
    );
};

export const AiResultPage: React.FC<AiResultPageProps> = ({ session, geminiApiKey, onExit, ...headerProps }) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userInput, setUserInput] = useState('');
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const startSession = async () => {
            if (!geminiApiKey) {
                alert('Please set your Gemini API key in settings.');
                onExit();
                return;
            }
            setIsLoading(true);
            
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            chatRef.current = ai.chats.create({ 
              model: 'gemini-2.5-flash',
              config: { systemInstruction: getSystemInstruction(session.tool) }
            });

            setChatHistory([{ role: 'user', text: session.query }]);

            try {
                const response = await chatRef.current.sendMessage({ message: session.query });
                const modelResponse = response.text;
                setGeneratedContent(modelResponse);
                setChatHistory(prev => [...prev, { role: 'model', text: `Here is the first draft for: "${session.query}"` }]);
            } catch (err) {
                console.error("AI chat error:", err);
                setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
            } finally {
                setIsLoading(false);
            }
        };
        startSession();
    }, [session, geminiApiKey, onExit]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading || !userInput.trim() || !chatRef.current) return;

        setIsLoading(true);
        const userMessage: ChatMessage = { role: 'user', text: userInput };
        setChatHistory(prev => [...prev, userMessage]);
        setUserInput('');

        try {
            const response = await chatRef.current.sendMessage({ message: userMessage.text });
            const modelResponse = response.text;
            setGeneratedContent(modelResponse);
            setChatHistory(prev => [...prev, { role: 'model', text: "Here's the updated version." }]);
        } catch (err) {
            console.error("AI chat error:", err);
            setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderPreview = () => {
        if (isLoading && !generatedContent) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                    <LogoIcon className="w-12 h-12 animate-spin" />
                    <p className="mt-4 text-gray-600">Generating...</p>
                </div>
            )
        }
        switch(session.tool) {
            case 'docs': return <DocPreview markdown={generatedContent} />;
            case 'code': return <CodePreview html={generatedContent} />;
            default: return null;
        }
    };
    
    return (
        <div className="flex flex-col h-screen bg-white">
            <Header {...headerProps} onHome={onExit} showHomeButton={true} />
            <div className="flex-grow flex flex-col md:flex-row min-h-0">
                {/* Chat Panel */}
                <div className="w-full md:w-1/3 flex flex-col bg-gray-50 border-r h-1/2 md:h-auto">
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

                {/* Preview Panel */}
                <div className="w-full md:w-2/3 flex-grow relative">
                    {renderPreview()}
                </div>
            </div>
        </div>
    );
};