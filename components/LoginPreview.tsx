
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { BrushIcon } from './icons/BrushIcon';

export const LoginPreview: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h1 className="text-5xl font-bold text-gray-800 tracking-tight">
                Search at the speed of light.
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-md">
                Get concise AI summaries and quick links, instantly. No more digging through pages of results.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-lg">
                <div className="flex flex-col items-center space-y-2 text-gray-700">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <SparklesIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium">AI-Powered Summaries</span>
                </div>
                <div className="flex flex-col items-center space-y-2 text-gray-700">
                     <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <LinkIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium">Relevant Quick Links</span>
                </div>
                <div className="flex flex-col items-center space-y-2 text-gray-700">
                     <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BrushIcon />
                    </div>
                    <span className="text-sm font-medium">Fully Customizable</span>
                </div>
            </div>
        </div>
    );
};
