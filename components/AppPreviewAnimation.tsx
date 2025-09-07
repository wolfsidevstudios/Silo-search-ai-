import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

export const AppPreviewAnimation: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative aspect-[16/10] bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
        <div className="h-9 bg-gray-100 flex items-center px-3 border-b">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>

        <div className="animated-app-container">
          <div className="animated-app-slider">
            <div className="animated-app-page state-search flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-gray-700">
                    <LogoIcon className="w-7 h-7" />
                    <span className="text-lg font-semibold">Silo Search</span>
                </div>
                <div className="mt-8 flex items-center w-full p-2 pl-4 rounded-full shadow-lg bg-white border border-gray-200">
                    <SearchIcon className="text-gray-500 w-5 h-5" />
                    <div className="ml-2 text-gray-700 typing-text typing-animation"></div>
                    <button className="ml-auto flex-shrink-0 w-10 h-10 flex items-center justify-center bg-black text-white rounded-full">
                        <ArrowRightIcon />
                    </button>
                </div>
            </div>
            <div className="animated-app-page state-results flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-gray-700">
                    <LogoIcon className="w-7 h-7" />
                    <span className="text-lg font-semibold">Silo Search</span>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg shadow">
                     <h3 className="font-bold text-gray-800 text-sm">Summary</h3>
                     <div className="space-y-1 mt-2">
                         <div className="h-2.5 w-full bg-gray-200 rounded-full"></div>
                         <div className="h-2.5 w-5/6 bg-gray-200 rounded-full"></div>
                         <div className="h-2.5 w-3/4 bg-gray-200 rounded-full"></div>
                     </div>
                </div>
                <div className="mt-4">
                    <h3 className="font-bold text-gray-800 text-xs">Quick Links</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <div className="px-3 py-1 text-xs bg-gray-200 rounded-full">Source 1</div>
                        <div className="px-3 py-1 text-xs bg-gray-200 rounded-full">Source 2</div>
                        <div className="px-3 py-1 text-xs bg-gray-200 rounded-full">Source 3</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
