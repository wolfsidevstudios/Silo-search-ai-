import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LogoIcon } from './icons/LogoIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import type { UserProfile } from '../types';
import { GiftIcon } from './icons/GiftIcon';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  recentSearches: string[];
  onSearch: (query: string) => void;
  onClear: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  proCredits: number;
  onDeleteRecentSearch: (search: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, recentSearches, onSearch, onClear, onOpenSettings, userProfile, onLogout, proCredits, onDeleteRecentSearch }) => {
  const handleSearchClick = (query: string) => {
    onSearch(query);
    onClose();
  };

  const handleLogoutAndClose = () => {
    onLogout();
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
                  <li key={index} className="group">
                    <div className="relative flex items-center">
                      <button 
                        onClick={() => handleSearchClick(query)} 
                        className="w-full text-left px-4 py-2 rounded-md group-hover:bg-gray-100 group-hover:rounded-full transition-all duration-200 truncate"
                      >
                        {query}
                      </button>
                      <button 
                        onClick={() => onDeleteRecentSearch(query)} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Delete search: ${query}`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center mt-8">No recent searches yet.</p>
            )}
          </div>
          <footer className="p-4 border-t space-y-2">
            {userProfile && (
              <div className="flex items-center justify-between p-2 mb-2 bg-gray-50 rounded-full border">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <img src={userProfile.picture} alt={userProfile.name} className="w-10 h-10 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{userProfile.name}</p>
                    <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                  </div>
                </div>
                <button onClick={() => onOpenSettings('rewards-store')} className="flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold text-amber-700 bg-amber-100 rounded-full hover:bg-amber-200 transition-colors ml-2">
                    <GiftIcon className="w-4 h-4" />
                    <span>{proCredits}</span>
                </button>
              </div>
            )}
            <button onClick={() => onOpenSettings()} className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <SettingsIcon />
                <span>Settings & Info</span>
            </button>
            {userProfile && (
              <button onClick={handleLogoutAndClose} className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors">
                <LogoutIcon />
                <span>Sign Out</span>
              </button>
            )}
            {recentSearches.length > 0 && (
              <button onClick={onClear} className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors">
                <TrashIcon />
                <span>Clear Recent Searches</span>
              </button>
            )}
          </footer>
        </div>
      </aside>
    </>
  );
};