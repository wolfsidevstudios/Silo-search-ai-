import React, { useState, useRef, useEffect } from 'react';
import { Header } from './Header';
import { SearchInput } from './SearchInput';
import { Footer } from './Footer';
import { GitHubIcon } from './icons/GitHubIcon';
import { LogoIcon } from './icons/LogoIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { SearchIcon } from './icons/SearchIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import type { UserProfile, ChatMessage } from '../types';
import { GoogleGenAI, Chat } from "@google/genai";
import { classifyGithubQuery } from '../services/geminiService';

interface GithubPageProps {
  geminiApiKey: string;
  githubToken: string;
  onHome: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

export const GithubPage: React.FC<GithubPageProps> = ({ geminiApiKey, githubToken, onHome, ...headerProps }) => {
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentRepo, setCurrentRepo] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize chat
    useEffect(() => {
        if (geminiApiKey) {
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-pro', // Use Pro for better coding reasoning
                config: {
                    systemInstruction: "You are an expert AI developer assistant integrated with GitHub. Your goal is to help users navigate, understand, and interact with repositories. You can explain code, summarize issues, review PRs, and answer general questions about the codebase. Be concise, accurate, and provide code snippets where relevant. When a user asks about a specific repo, assume you have context or ask for clarification.",
                    thinkingConfig: { thinkingBudget: 8192 },
                }
            });
        }
    }, [geminiApiKey]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [chatHistory, isLoading]);

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;
        setQuery('');
        setIsLoading(true);
        
        // Add user message
        const userMsg: ChatMessage = { role: 'user', text: searchQuery };
        setChatHistory(prev => [...prev, userMsg]);

        try {
            // 1. Classify intent
            const classification = await classifyGithubQuery(searchQuery, geminiApiKey);
            
            // 2. (Simulation) In a real app, we would fetch data from GitHub based on intent
            // For now, we will simulate the "fetching" part or let the AI hallucinate/answer generally if it's a general question.
            // To make it robust, we'd need to implement the tool calling to `githubService`.
            // Since this is a UI demo with simulated backend logic for the "Agent" part:
            
            let contextInfo = "";
            if (classification.action === 'explain_file') {
                 contextInfo = `[System: User wants explanation of file ${classification.path}. In a real scenario, I would fetch this file content.]`;
            } else if (classification.action === 'review_pr') {
                 contextInfo = `[System: User wants review of PR #${classification.pr_number}. In a real scenario, I would fetch the PR diff.]`;
            }

            // 3. Send to Chat
            if (chatRef.current) {
                const response = await chatRef.current.sendMessage({ message: searchQuery + (contextInfo ? `\n${contextInfo}` : "") });
                setChatHistory(prev => [...prev, { role: 'model', text: response.text }]);
            }
        } catch (error) {
            console.error("Error in GitHub chat:", error);
            setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        { icon: SearchIcon, label: "Find Repo", action: () => handleSearch("Find a react repository for a todo app") },
        { icon: FileTextIcon, label: "Explain Code", action: () => handleSearch("Explain how the authentication middleware works") },
        { icon: MessageSquareIcon, label: "Summarize Issue", action: () => handleSearch("Summarize the latest open issues regarding performance") },
        { icon: SparklesIcon, label: "Review PR", action: () => handleSearch("Review the latest pull request for potential bugs") },
    ];

    return (
        <div className="flex flex-col h-screen bg-white">
             <Header {...headerProps} onHome={onHome} showHomeButton={true} />
             
             <div className="flex-grow flex flex-col md:flex-row min-h-0">
                {/* Sidebar / Context Panel */}
                <div className="w-full md:w-1/4 border-r bg-gray-50 p-4 hidden md:flex flex-col">
                    <div className="flex items-center space-x-2 mb-6 text-gray-800">
                        <GitHubIcon className="w-6 h-6" />
                        <h2 className="font-bold">GitHub Agent</h2>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-3 bg-white rounded-xl border shadow-sm">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Context</p>
                            {currentRepo ? (
                                <div className="flex items-center space-x-2 text-sm font-medium text-gray-800">
                                    <BookOpenIcon className="w-4 h-4" />
                                    <span className="truncate">{currentRepo}</span>
                                    <button onClick={() => setCurrentRepo(null)} className="ml-auto text-gray-400 hover:text-red-500"><CloseIcon className="w-4 h-4" /></button>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No repository selected.</p>
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Actions</p>
                            <div className="space-y-2">
                                {features.map((f, i) => (
                                    <button key={i} onClick={f.action} className="w-full flex items-center space-x-3 p-2 hover:bg-white rounded-lg transition-colors text-left">
                                        <div className="p-1.5 bg-gray-200 rounded-md text-gray-600"><f.icon className="w-4 h-4" /></div>
                                        <span className="text-sm font-medium text-gray-700">{f.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-grow flex flex-col bg-white relative">
                    <div className="flex-grow overflow-y-auto p-4 space-y-6">
                        {chatHistory.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 opacity-60">
                                <GitHubIcon className="w-16 h-16 mb-4" />
                                <p className="text-lg font-medium">How can I help you with your code today?</p>
                            </div>
                        ) : (
                            chatHistory.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`rounded-2xl py-3 px-5 max-w-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                                        <div className="whitespace-pre-wrap">{msg.text}</div>
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-2xl py-3 px-5 border border-gray-200">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t bg-white">
                        <div className="max-w-3xl mx-auto relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                                placeholder="Ask about a repo, issue, or code snippet..."
                                className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                                disabled={isLoading}
                            />
                            <button 
                                onClick={() => handleSearch(query)} 
                                disabled={!query.trim() || isLoading}
                                className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-300 transition-colors"
                            >
                                <ArrowUpIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};