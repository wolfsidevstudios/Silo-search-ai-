
import React from 'react';

interface FooterProps {
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
  showCopyright?: boolean;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegalPage, showCopyright = false, className = '' }) => {
  return (
    <footer className={`w-full text-center text-sm text-gray-500 z-10 p-4 ${className}`}>
        <div>
            <button onClick={() => onOpenLegalPage('privacy')} className="px-2 hover:underline focus:outline-none focus:ring-2 focus:ring-black rounded">Privacy Policy</button>
            <span className="mx-1 select-none" aria-hidden="true">·</span>
            <button onClick={() => onOpenLegalPage('terms')} className="px-2 hover:underline focus:outline-none focus:ring-2 focus:ring-black rounded">Terms & Conditions</button>
            <span className="mx-1 select-none" aria-hidden="true">·</span>
            <button onClick={() => onOpenLegalPage('about')} className="px-2 hover:underline focus:outline-none focus:ring-2 focus:ring-black rounded">About</button>
        </div>
        {showCopyright && (
            <p className="mt-2 text-xs text-gray-400">&copy; {new Date().getFullYear()} Silo Search. All rights reserved.</p>
        )}
    </footer>
  );
};
