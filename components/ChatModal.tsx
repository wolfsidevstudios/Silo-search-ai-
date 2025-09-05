import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, history, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-modal-title"
    >
      <header className="flex-shrink-0 p-4 flex justify-between items-center border-b">
        <h2 id="chat-modal-title" className="text-xl font-bold text-gray-800">
          Chat Mode
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close chat"
        >
          <CloseIcon />
        </button>
      </header>

      <main className="flex-grow p-4 md:p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {history.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="bg-black text-white rounded-2xl py-2 px-4 max-w-lg">
                  <p>{msg.text}</p>
                </div>
              ) : (
                <div className="text-gray-800 max-w-lg whitespace-pre-wrap">
                   {msg.text}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="text-gray-800 max-w-lg flex items-center space-x-2">
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="flex-shrink-0 p-4 bg-white border-t">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center w-full space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a follow-up question..."
              className="w-full px-5 py-4 bg-gray-100 rounded-full outline-none border-2 border-transparent focus:border-gray-300 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-black text-white rounded-full transition-colors disabled:bg-gray-300 hover:bg-gray-800"
              aria-label="Send message"
            >
              <ArrowUpIcon />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};
