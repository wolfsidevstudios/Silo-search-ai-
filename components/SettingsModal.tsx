import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] max-h-[800px] flex flex-col transform transition-all">
        <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 id="settings-modal-title" className="text-xl font-bold text-gray-800">
            Settings & Information
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors" 
            aria-label="Close settings"
          >
            <CloseIcon />
          </button>
        </header>

        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Documentation</h3>
              <p>
                Silo Search is an AI-powered search application designed to provide quick, concise summaries for your queries. It uses Google's Gemini model to understand your question and generate a helpful 3-sentence summary along with related "quick links" to help you explore topics further.
              </p>
            </section>
            <section>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Privacy Policy</h3>
              <p>
                Your privacy is important to us. Silo Search does not store your search queries on our servers. Recent searches are saved locally in your browser's local storage and can be cleared at any time from the sidebar menu using the "Clear Recent Searches" button.
              </p>
              <p className="mt-4">
                If you use the 'Temporary Chat' mode (toggled by the incognito icon in the header), your searches will not be saved to your recent searches list, providing a session-only experience. We do not collect any personal information.
              </p>
            </section>
            <section>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">About</h3>
              <p>This application was developed by:</p>
              <ul className="list-disc list-inside mt-4 pl-4 space-y-2">
                <li><span className="font-semibold">Development Studio:</span> Silo Intelligence</li>
                <li><span className="font-semibold">Creator:</span> Emanuel Martinez</li>
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};