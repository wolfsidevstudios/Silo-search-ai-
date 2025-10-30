import React from 'react';

interface IntroModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
        className="fixed inset-0 bg-black bg-opacity-80 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className="relative bg-transparent w-full max-w-2xl flex flex-col items-center text-center transform transition-all">
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
          <video
            src="https://cdn-1.creatify.ai/media/21955ec5-c594-4f98-acf3-d0b0918ddf6b/video_21955ec5-c594-4f98-acf3-d0b0918ddf6b.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        <h2 id="intro-modal-title" className="text-3xl font-bold text-white mt-6">
          Welcome to Kyndra AI
        </h2>
        <button
            onClick={onClose}
            className="mt-6 px-8 py-3 text-lg font-medium text-black bg-white rounded-full hover:bg-gray-200"
        >
            Get Started
        </button>
      </div>
    </div>
  );
};