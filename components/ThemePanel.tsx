import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ThemePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = {
  Default: [
    { name: 'White', class: 'bg-white' },
    { name: 'Light Gray', class: 'bg-gray-100' },
  ],
  Gradients: [
    { name: 'Peachy', class: 'theme-gradient-2' },
    { name: 'Lavender', class: 'theme-gradient-1' },
    { name: 'Minty', class: 'theme-gradient-3' },
  ],
  Animated: [
    { name: 'Aurora', class: 'theme-animated-1' },
  ]
};

const ThemeSwatch: React.FC<{ themeClass: string; isSelected: boolean; onClick: () => void; }> = ({ themeClass, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full h-16 rounded-lg border-2 transition-all ${isSelected ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
    aria-label={`Select theme: ${themeClass}`}
  >
    <div className={`w-full h-full rounded-md flex items-center justify-center ${themeClass}`}>
      {isSelected && (
        <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-blue-600">
            <CheckIcon />
        </div>
      )}
    </div>
  </button>
);


export const ThemePanel: React.FC<ThemePanelProps> = ({ isOpen, onClose, currentTheme, onThemeChange }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-panel-title"
      >
        <div className="flex flex-col h-full">
          <header className="p-4 flex justify-between items-center border-b">
            <h2 id="theme-panel-title" className="text-lg font-semibold">Customize Theme</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100" aria-label="Close theme panel">
              <CloseIcon />
            </button>
          </header>
          <div className="flex-grow overflow-y-auto p-4 space-y-6">
            {Object.entries(themes).map(([category, themeList]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-gray-500 mb-3">{category}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {themeList.map(theme => (
                    <ThemeSwatch 
                      key={theme.class}
                      themeClass={theme.class}
                      isSelected={currentTheme === theme.class}
                      onClick={() => onThemeChange(theme.class)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};