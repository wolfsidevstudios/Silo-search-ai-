
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-lg">
        <LogoIcon className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You must agree to the Terms of Service to use Silo Search.
          You can download your existing data or remove it completely.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
                onClick={onDownloadData}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
                <DownloadIcon />
                <span>Download My Data</span>
            </button>
            <button
                onClick={onRemoveData}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
            >
                <TrashIcon />
                <span>Remove App Data</span>
            </button>
        </div>
      </div>
    </div>
  );
};
