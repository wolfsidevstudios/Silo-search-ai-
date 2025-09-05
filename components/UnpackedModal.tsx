import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface UnpackedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnpackedModal: React.FC<UnpackedModalProps> = ({ isOpen, onClose }) => {
  const [isEnvelopeOpen, setEnvelopeOpen] = useState(false);

  if (!isOpen) return null;

  const handleOpenEnvelope = () => {
    setEnvelopeOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unpacked-modal-title"
    >
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
            onClick={onClose}
            aria-hidden="true"
        ></div>

      <div className="relative w-full max-w-lg">
        {/* Envelope Structure */}
        <div 
            className={`envelope-container ${isEnvelopeOpen ? 'open' : ''}`}
            onClick={!isEnvelopeOpen ? handleOpenEnvelope : undefined}
        >
          <div className="envelope-back"></div>
          
          {/* Invitation Card */}
          <div className="invitation-card">
            <div className="p-8 text-center bg-white rounded-lg shadow-2xl relative overflow-hidden">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors" 
                    aria-label="Close"
                >
                    <CloseIcon />
                </button>
                <img src="https://i.ibb.co/nMKT4CBj/IMG-3750.png" alt="Silo Unpacked" className="w-32 h-32 mx-auto mb-4" />
                <h2 id="unpacked-modal-title" className="text-3xl font-bold text-gray-800">
                    You're Invited
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                    Get ready for Silo Unpacked!
                </p>
                
                <div className="my-6 border-t border-b border-gray-200 py-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Sneak Peek</h3>
                    <ul className="text-left text-gray-700 space-y-2 max-w-xs mx-auto">
                        <li className="flex items-start"><span className="text-indigo-500 mr-2">✨</span> <strong>AI Wallpapers:</strong> Generate unique backgrounds with a simple prompt.</li>
                        <li className="flex items-start"><span className="text-indigo-500 mr-2">🤝</span> <strong>Shared Spaces:</strong> Collaborate on your home screen with friends in real-time.</li>
                        <li className="flex items-start"><span className="text-indigo-500 mr-2">📝</span> <strong>Intelligent Notes:</strong> Your sticky notes just got smarter with AI summaries.</li>
                    </ul>
                </div>

                <button 
                    onClick={onClose} 
                    className="mt-4 px-6 py-3 text-lg font-medium text-white bg-black rounded-full hover:bg-gray-800 w-full"
                >
                    I'm Excited!
                </button>
            </div>
          </div>
          
          <div className="envelope-flap"></div>
          <div className="envelope-seal"></div>
        </div>
      </div>
    </div>
  );
};