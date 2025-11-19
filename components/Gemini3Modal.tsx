import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChipIcon } from './icons/ChipIcon';
import { ZapIcon } from './icons/ZapIcon';

interface Gemini3ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Gemini3Modal: React.FC<Gemini3ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-white/90 backdrop-blur-md transition-opacity" onClick={onClose} aria-hidden="true"></div>
      <div className="relative bg-white w-full max-w-2xl p-8 md:p-12 rounded-[2rem] shadow-2xl border border-gray-100 flex flex-col items-center text-center overflow-hidden animate-[scaleIn_0.4s_ease-out]">
        
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2"></div>

        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10">
          <CloseIcon className="w-6 h-6 text-gray-500" />
        </button>

        <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg mb-8">
                <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Introducing <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Gemini 3.0</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
                The next evolution in AI is here. Experience unparalleled reasoning, faster speeds, and a deeper understanding of your world. Now the default engine for Kyndra AI.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-10">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center space-x-4 text-left">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><ZapIcon className="w-5 h-5 text-amber-500" /></div>
                    <div>
                        <h4 className="font-bold text-gray-900">Lightning Fast</h4>
                        <p className="text-xs text-gray-500">Reduced latency for instant answers.</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center space-x-4 text-left">
                    <div className="p-2 bg-white rounded-xl shadow-sm"><ChipIcon className="w-5 h-5 text-blue-500" /></div>
                    <div>
                        <h4 className="font-bold text-gray-900">Deep Reasoning</h4>
                        <p className="text-xs text-gray-500">Handles complex queries with ease.</p>
                    </div>
                </div>
            </div>

            <button onClick={onClose} className="px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto">
                Experience Gemini 3.0
            </button>
        </div>
      </div>
    </div>
  );
};