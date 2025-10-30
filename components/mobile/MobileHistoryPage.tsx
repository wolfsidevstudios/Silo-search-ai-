import React from 'react';
import { TrashIcon } from '../icons/TrashIcon';

interface MobileHistoryPageProps {
  recentSearches: string[];
  onSearch: (query: string) => void;
  onClear: () => void;
}

export const MobileHistoryPage: React.FC<MobileHistoryPageProps> = ({ recentSearches, onSearch, onClear }) => {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-gray-50/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold">History</h1>
        {recentSearches.length > 0 && (
          <button onClick={onClear} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
            <TrashIcon />
            <span>Clear</span>
          </button>
        )}
      </header>
      <div className="flex-grow overflow-y-auto p-2">
        {recentSearches.length > 0 ? (
          <ul>
            {recentSearches.map((query, index) => (
              <li key={index}>
                <button 
                  onClick={() => onSearch(query)} 
                  className="w-full text-left px-3 py-3 rounded-md hover:bg-gray-100 truncate"
                >
                  {query}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center mt-16">No recent searches yet.</p>
        )}
      </div>
    </div>
  );
};
