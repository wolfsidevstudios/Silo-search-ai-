import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface ChromeBannerProps {
  onClose: () => void;
}

export const ChromeBanner: React.FC<ChromeBannerProps> = ({ onClose }) => {
  return (
    <div className="bg-yellow-100 border-b border-yellow-200 text-yellow-800 text-sm px-4 py-2 flex justify-center items-center relative z-50">
      <p>
        We recommend using <strong>Google Chrome</strong> for the best experience.
      </p>
      <button 
        onClick={onClose} 
        className="absolute right-4 p-1 rounded-full hover:bg-yellow-200 transition-colors"
        aria-label="Dismiss recommendation"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
