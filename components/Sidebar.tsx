
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LogoIcon } from './icons/LogoIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  recentSearches: string[];
  onSearch: (query: string) => void;
  onClear: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, recentSearches, onSearch, onClear }) => {
  const handleSearchClick = (query: string) => {
    onSearch(query);
    onClose();
  };
  
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside 
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex flex-col h-full">
          <header className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center space-x-2">
                <LogoIcon />
                <h2 id="sidebar-title" className="text-lg font-semibold">Recent Searches</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close sidebar">
              <CloseIcon />
            </button>
          </header>
          <div className="flex-grow overflow-y-auto p-4">
            {recentSearches.length > 0 ? (
              <ul>
                {recentSearches.map((query, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => handleSearchClick(query)} 
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 truncate"
                    >
                      {query}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center mt-8">No recent searches yet.</p>
            )}
          </div>
          {recentSearches.length > 0 && (
            <footer className="p-4 border-t">
              <button onClick={onClear} className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <TrashIcon />
                <span>Clear Recent Searches</span>
              </button>
            </footer>
          )}
        </div>
      </aside>
    </>
  );
};
