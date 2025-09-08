import React, { useState, useMemo } from 'react';
import type { QuizItem } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { CloseIcon } from './icons/CloseIcon';

interface QuizViewProps {
  quiz: QuizItem[];
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz }) => {
  const [userAnswers, setUserAnswers] = useState<(string | null)[]>(Array(quiz.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (submitted) return;
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answer;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = useMemo(() => {
    if (!submitted) return 0;
    return userAnswers.reduce((correctCount, answer, index) => {
      if (answer === quiz[index].correctAnswer) {
        return correctCount + 1;
      }
      return correctCount;
    }, 0);
  }, [submitted, userAnswers, quiz]);
  
  const resetQuiz = () => {
    setUserAnswers(Array(quiz.length).fill(null));
    setSubmitted(false);
  }

  if (!quiz || quiz.length === 0) {
    return <p className="text-center text-gray-500 py-8">No quiz was generated for this topic.</p>;
  }

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Knowledge Check</h2>
      
      {submitted && (
        <div className="bg-gray-100 border border-gray-200 rounded-xl p-6 mb-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800">Quiz Complete!</h3>
            <p className="text-4xl font-bold my-2">{score} / {quiz.length}</p>
            <p className="text-gray-600">You answered {Math.round((score/quiz.length) * 100)}% of the questions correctly.</p>
            <button onClick={resetQuiz} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">
                Try Again
            </button>
        </div>
      )}

      <div className="space-y-8">
        {quiz.map((item, qIndex) => (
          <div key={qIndex} className="p-6 bg-white border border-gray-200 rounded-xl">
            <p className="font-semibold text-gray-800">{qIndex + 1}. {item.question}</p>
            <div className="mt-4 space-y-3">
              {item.options.map((option, oIndex) => {
                const isSelected = userAnswers[qIndex] === option;
                const isCorrect = item.correctAnswer === option;
                
                let optionClasses = "w-full text-left p-3 border rounded-lg transition-colors flex items-center justify-between";
                if (submitted) {
                    if (isCorrect) {
                        optionClasses += " bg-green-100 border-green-300 text-green-800 font-semibold";
                    } else if (isSelected && !isCorrect) {
                        optionClasses += " bg-red-100 border-red-300 text-red-800";
                    } else {
                        optionClasses += " border-gray-200";
                    }
                } else {
                    optionClasses += isSelected ? " bg-gray-200 border-gray-400" : " bg-gray-50 hover:bg-gray-100";
                }

                return (
                  <button
                    key={oIndex}
                    onClick={() => handleSelectAnswer(qIndex, option)}
                    disabled={submitted}
                    className={optionClasses}
                  >
                    <span>{option}</span>
                    {submitted && isCorrect && <CheckIcon className="w-5 h-5 text-green-600" />}
                    {submitted && isSelected && !isCorrect && <CloseIcon className="w-5 h-5 text-red-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted && (
        <div className="mt-8 text-center">
            <button
                onClick={handleSubmit}
                disabled={userAnswers.some(a => a === null)}
                className="px-8 py-3 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Submit Answers
            </button>
        </div>
      )}
    </div>
  );
};
