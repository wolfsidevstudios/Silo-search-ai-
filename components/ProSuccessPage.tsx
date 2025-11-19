
import React, { useEffect } from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LogoIcon } from './icons/LogoIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ProSuccessPageProps {
  onGoHome: () => void;
  onActivatePro: () => void;
}

export const ProSuccessPage: React.FC<ProSuccessPageProps> = ({ onGoHome, onActivatePro }) => {
  useEffect(() => {
    onActivatePro();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
      <div className="bg-black text-white p-6 rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden">
         {/* Confetti/Sparkle Effect */}
         <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
         </div>

        <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                <CheckCircleIcon className="w-10 h-10 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Welcome to Pro!</h1>
            <p className="text-gray-300 mb-8">Your account has been successfully upgraded.</p>

            <div className="bg-white/10 rounded-2xl p-4 w-full mb-8 border border-white/10">
                <div className="flex items-center justify-center space-x-2 mb-2">
                    <LogoIcon className="w-6 h-6 text-white" />
                    <span className="font-bold text-lg">Kyndra AI</span>
                    <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full">PRO</span>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                    <p className="flex items-center justify-center gap-2"><SparklesIcon className="w-4 h-4 text-yellow-400"/> Unlimited Credits</p>
                    <p className="flex items-center justify-center gap-2"><SparklesIcon className="w-4 h-4 text-purple-400"/> GitHub Agent Unlocked</p>
                    <p className="flex items-center justify-center gap-2"><SparklesIcon className="w-4 h-4 text-blue-400"/> Priority Access</p>
                </div>
            </div>

            <button onClick={onGoHome} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors">
                Start Searching
            </button>
        </div>
      </div>
    </div>
  );
};
