import React, { useState } from 'react';
import type { Flashcard } from '../types';

interface FlashcardViewProps {
  flashcards: Flashcard[];
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ flashcards }) => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const handleFlip = (index: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (!flashcards || flashcards.length === 0) {
    return <p className="text-center text-gray-500 py-8">No flashcards were generated for this topic.</p>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">Flashcards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
        {flashcards.map((card, index) => (
          <div
            key={index}
            className="w-full h-64 cursor-pointer"
            onClick={() => handleFlip(index)}
          >
            <div
              className="relative w-full h-full text-center transition-transform duration-500"
              style={{ transformStyle: 'preserve-3d', transform: flippedCards.has(index) ? 'rotateY(180deg)' : '' }}
            >
              {/* Front of card */}
              <div className="absolute w-full h-full bg-white rounded-xl shadow-lg border p-6 flex flex-col justify-center items-center" style={{ backfaceVisibility: 'hidden' }}>
                <p className="text-xs text-gray-500 mb-2 font-semibold">QUESTION</p>
                <p className="font-medium text-gray-800">{card.question}</p>
              </div>
              {/* Back of card */}
              <div className="absolute w-full h-full bg-gray-800 text-white rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col justify-center items-center" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <p className="text-xs text-gray-400 mb-2 font-semibold">ANSWER</p>
                <p className="text-sm">{card.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
