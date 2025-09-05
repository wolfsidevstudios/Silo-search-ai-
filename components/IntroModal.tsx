import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { Clock } from './Clock';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const previewClockSettings = {
    style: 'diagonal' as const,
    theme: 'neon' as const,
    font: 'bungee' as const,
    size: 10,
    thickness: 4,
};

export const IntroModal: React.FC<IntroModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-modal-title"
    >
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center text-center p-8 transform transition-all">
        <SparklesIcon className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 id="intro-modal-title" className="text-2xl font-bold text-gray-800">
          Expressive Clock UI 2.0 is Here!
        </h2>
        <p className="mt-2 text-gray-600">
            We've added tons of new ways to personalize your home screen clock.
        </p>
        
        <div className="bg-gray-800 rounded-xl p-8 my-8 w-full flex items-center justify-center overflow-hidden">
            <Clock settings={previewClockSettings} />
        </div>

        <p className="text-sm text-gray-500">
            Check out the new fonts, colors, and layouts in Settings {'>'} Appearance {'>'} Clock Display.
        </p>

        <button 
            onClick={onClose} 
            className="mt-8 px-6 py-3 text-lg font-medium text-white bg-black rounded-full hover:bg-gray-800 w-full"
        >
            Got it!
        </button>

        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors" 
            aria-label="Close"
        >
            <CloseIcon />
        </button>
      </div>
    </div>
  );
};