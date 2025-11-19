
import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { HomeIcon } from './icons/HomeIcon';
import { MenuIcon } from './icons/MenuIcon';
import { IncognitoIcon } from './icons/IncognitoIcon';
import type { UserProfile } from '../types';
import { NavigationTabs } from './NavigationTabs';
import { VoiceIcon } from './icons/VoiceIcon';
import { ProfileIcon } from './icons/ProfileIcon';
import { AiSparkleIcon } from './icons/AiSparkleIcon';
import { CrownIcon } from './icons/CrownIcon';

interface HeaderProps {
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  onHome?: () => void;
  showHomeButton?: boolean;
  userProfile: UserProfile | null;
  onLogout: () => void;
  activeTab?: 'search' | 'discover' | 'history' | 'ai-labs' | 'plans';
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ isTemporaryMode, onToggleSidebar, onToggleTemporaryMode, onOpenSettings, onHome, showHomeButton, userProfile, onLogout, activeTab, onNavigate }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <header className="p-6 flex justify-between items-center relative">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Open menu">
          <MenuIcon />
        </button>
        <div className="flex items-center space-x-2">
          <LogoIcon />
          <div className="flex items-center">
            <span className="text-xl font-semibold">Kyndra AI</span>
            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
              2.5
            </span>
          </div>
        </div>
      </div>
      
      {activeTab && onNavigate && activeTab !== 'plans' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <NavigationTabs activeTab={activeTab === 'ai-labs' ? 'search' : activeTab} onNavigate={onNavigate} />
        </div>
      )}

      <div className="flex items-center space-x-4">
        {onNavigate && (
          <>
            {(!userProfile?.isPro) && (
                <button
                    onClick={() => onNavigate('/plans')}
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 text-yellow-900"
                    aria-label="Upgrade to Pro"
                >
                    <CrownIcon className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-wider">Upgrade</span>
                </button>
            )}
            
            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
            
            <button
                onClick={() => onNavigate('/labs')}
                className="relative flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow border hover:shadow-md transition-all group overflow-hidden"
                aria-label="Open AI Labs"
            >
                <div className="absolute inset-0 labs-button-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                    <ProfileIcon className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-sm text-gray-700">Labs</span>
                    <AiSparkleIcon className="w-5 h-5 text-purple-500" />
                </div>
            </button>
            <button onClick={() => onNavigate('/live')} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow border hover:bg-gray-100 transition-colors" aria-label="Open Kyndra Live">
              <VoiceIcon className="w-5 h-5" />
            </button>
          </>
        )}
        <button onClick={onToggleTemporaryMode} className={`p-2 rounded-full transition-colors ${isTemporaryMode ? 'bg-gray-800 text-white' : 'hover:bg-black/10'}`} aria-label="Toggle temporary mode">
          <IncognitoIcon />
        </button>
        {showHomeButton && onHome && (
          <button onClick={onHome} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go to home page">
            <HomeIcon />
          </button>
        )}
        {userProfile ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(p => !p)} className="rounded-full transition-transform hover:scale-105 border-2 border-transparent hover:border-gray-200">
              <img src={userProfile.picture} alt={userProfile.name} className="w-10 h-10 rounded-full" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold text-gray-900 truncate">{userProfile.name}</p>
                  <p className="text-sm text-gray-500 truncate">{userProfile.email}</p>
                  {userProfile.isPro && <span className="mt-1 inline-block px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded-full">PRO MEMBER</span>}
                </div>
                <button 
                  onClick={() => { onLogout(); setDropdownOpen(false); }} 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
};
