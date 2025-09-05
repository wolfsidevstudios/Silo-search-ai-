import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { HomeIcon } from './icons/HomeIcon';
import { MenuIcon } from './icons/MenuIcon';
import { IncognitoIcon } from './icons/IncognitoIcon';

interface HeaderProps {
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onHome?: () => void;
  showHomeButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isTemporaryMode, onToggleSidebar, onToggleTemporaryMode, onHome, showHomeButton }) => {
  return (
    <header className="p-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Open menu">
          <MenuIcon />
        </button>
        <button onClick={onToggleTemporaryMode} className={`p-2 rounded-md transition-colors ${isTemporaryMode ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'}`} aria-label="Toggle temporary mode">
          <IncognitoIcon />
        </button>
        <div className="flex items-center space-x-2">
          <LogoIcon />
          <span className="text-xl font-semibold">Silo Search</span>
        </div>
      </div>
      {showHomeButton && onHome && (
        <button onClick={onHome} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go to home page">
          <HomeIcon />
        </button>
      )}
    </header>
  );
};