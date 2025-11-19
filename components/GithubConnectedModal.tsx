import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { SearchIcon } from './icons/SearchIcon';
import { CodeIcon } from './icons/CodeIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { LayersIcon } from './icons/LayersIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';

interface GithubConnectedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubConnectedModal: React.FC<GithubConnectedModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    { icon: SearchIcon, title: "Natural Language Search", desc: "Find code, issues, or docs using plain English." },
    { icon: CodeIcon, title: "Semantic Code Search", desc: "Understand intent and context to find relevant functions." },
    { icon: FileTextIcon, title: "Code Explanation", desc: "Get natural language explanations for complex code segments." },
    { icon: LayersIcon, title: "Cross-Repository Knowledge", desc: "Draw insights from multiple connected repositories." },
    { icon: SparklesIcon, title: "Automated Code Review", desc: "AI analyzes PRs for bugs, style, and security issues." },
    { icon: MessageSquareIcon, title: "On-Demand Assistance", desc: "Chat with the AI about issues, PRs, and debugging." },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} aria-hidden="true"></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-[scaleIn_0.3s_ease-out]">
        
        {/* Left Panel (Visual) */}
        <div className="w-full md:w-1/3 github-connected-modal-bg p-8 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
             </div>
             <div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/10">
                    <GitHubIcon className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold leading-tight">GitHub Connected App is here.</h2>
                <p className="mt-4 text-gray-300 text-sm leading-relaxed">Unlock a new level of productivity with AI-powered insights, search, and automation for your repositories.</p>
             </div>
             <div className="mt-8">
                <div className="flex items-center space-x-2 text-xs font-medium bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span>Now Available</span>
                </div>
             </div>
        </div>

        {/* Right Panel (Features) */}
        <div className="w-full md:w-2/3 p-8 bg-white">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <CloseIcon className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                                <feature.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500 pl-11">{feature.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button onClick={onClose} className="px-6 py-3 bg-black text-white font-medium text-sm rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Get Started
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};