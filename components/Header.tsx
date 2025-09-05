import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { HomeIcon } from './icons/HomeIcon';
import { MenuIcon } from './icons/MenuIcon';
import { IncognitoIcon } from './icons/IncognitoIcon';
import { BrushIcon } from './icons/BrushIcon';

interface HeaderProps {
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onToggleThemePanel: () => void;
  onHome?: () => void;
  showHomeButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isTemporaryMode, onToggleSidebar, onToggleTemporaryMode, onToggleThemePanel, onHome, showHomeButton }) => {
  return (
    <header className="p-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Open menu">
          <MenuIcon />
        </button>
        <button onClick={onToggleTemporaryMode} className={`p-2 rounded-md transition-colors ${isTemporaryMode ? 'bg-gray-800 text-white' : 'hover:bg-black/10'}`} aria-label="Toggle temporary mode">
          <IncognitoIcon />
        </button>
        <div className="flex items-center space-x-2">
          <LogoIcon />
          <span className="text-xl font-semibold">Silo Search</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={onToggleThemePanel} className="p-2 rounded-full hover:bg-black/10 transition-colors" aria-label="Customize theme">
          <BrushIcon />
        </button>
        {showHomeButton && onHome && (
          <button onClick={onHome} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" aria-label="Go to home page">
            <HomeIcon />
          </button>
        )}
      </div>
    </header>
  );
};