
import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { HomeIcon } from './icons/HomeIcon';
import { MenuIcon } from './icons/MenuIcon';
import { IncognitoIcon } from './icons/IncognitoIcon';
import type { UserProfile } from '../types';

declare global {
  interface Window {
    google?: any;
  }
}

interface HeaderProps {
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  onHome?: () => void;
  showHomeButton?: boolean;
  userProfile: UserProfile | null;
  onLogout: () => void;
  isGsiScriptLoaded: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isTemporaryMode, onToggleSidebar, onToggleTemporaryMode, onOpenSettings, onHome, showHomeButton, userProfile, onLogout, isGsiScriptLoaded }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const signInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentSignInRef = signInRef.current;

    if (isGsiScriptLoaded && !userProfile && currentSignInRef) {
        // To prevent duplicate buttons on re-renders, check if it's empty.
        if (currentSignInRef.childElementCount === 0) {
            window.google.accounts.id.renderButton(
                currentSignInRef,
                { theme: 'outline', size: 'medium', shape: 'pill', text: 'signin_with' }
            );
        }
    }
    
    // Cleanup function to remove the button rendered by the Google script.
    // This is crucial for when the user logs in and the sign-in div is removed from the DOM.
    return () => {
        if (currentSignInRef) {
            currentSignInRef.innerHTML = '';
        }
    };
  }, [isGsiScriptLoaded, userProfile]);

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
    <header className="p-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Open menu">
          <MenuIcon />
        </button>
        <div className="flex items-center space-x-2">
          <LogoIcon />
          <div className="flex items-center">
            <span className="text-xl font-semibold">Silo Search</span>
            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-semibold rounded-full">
              Beta
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
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
            <button onClick={() => setDropdownOpen(p => !p)} className="rounded-full transition-transform hover:scale-105">
              <img src={userProfile.picture} alt={userProfile.name} className="w-10 h-10 rounded-full" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold text-gray-900 truncate">{userProfile.name}</p>
                  <p className="text-sm text-gray-500 truncate">{userProfile.email}</p>
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
        ) : (
          <div ref={signInRef} id="signInButton" />
        )}
      </div>
    </header>
  );
};
