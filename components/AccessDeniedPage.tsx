
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LogoIcon } from './icons/LogoIcon';

interface AccessDeniedPageProps {
  onDownloadData: () => void;
  onRemoveData: () => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ onDownloadData, onRemoveData }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] text-center p-6">
      <div className="bg-white p-10 md:p-14 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-100 max-w-md w-full">
        <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <LogoIcon className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Access Restricted</h1>
        <p className="mt-3 text-gray-500 leading-relaxed">
          You must agree to the Terms of Service to use Kyndra AI.
          Your data remains yours—download it or remove it completely.
        </p>

        <div className="flex flex-col gap-3 mt-10">
            <button
                onClick={onDownloadData}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-all hover:scale-[1.02]"
            >
                <DownloadIcon />
                <span>Download My Data</span>
            </button>
            <button
                onClick={onRemoveData}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold text-red-600 bg-red-50 border border-transparent rounded-full hover:bg-red-100 transition-all hover:scale-[1.02]"
            >
                <TrashIcon />
                <span>Remove App Data</span>
            </button>
        </div>
      </div>
    </div>
  );
};
