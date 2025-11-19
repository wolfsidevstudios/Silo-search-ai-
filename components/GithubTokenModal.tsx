import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { KeyIcon } from './icons/KeyIcon';
import { LockIcon } from './icons/LockIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface GithubTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (token: string) => void;
}

export const GithubTokenModal: React.FC<GithubTokenModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [token, setToken] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
        onConnect(token.trim());
    }
  };

  // Direct link with pre-filled description and scopes
  // Scopes: repo (Full control of private repositories), read:user (Read all user profile data), user:email (Read user email addresses), read:org (Read org and team membership, read org projects)
  const tokenUrl = "https://github.com/settings/tokens/new?description=Kyndra+AI+Connected+App&scopes=repo,read:user,user:email,read:org";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true"></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">
                    <GitHubIcon className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Connect GitHub</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
            To enable deep integration features like semantic search and code review, Kyndra AI needs a Personal Access Token (Classic).
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="github-token" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Personal Access Token</label>
                <div className="relative">
                    <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        id="github-token"
                        type="password" 
                        value={token} 
                        onChange={(e) => setToken(e.target.value)} 
                        placeholder="ghp_..." 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        autoFocus
                    />
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-start space-x-3">
                    <LockIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">Secure & Local</p>
                        <p>Your token is stored locally on your device. We do not save it on our servers.</p>
                    </div>
                </div>
            </div>

            <button type="submit" disabled={!token.trim()} className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg">
                Connect Account
            </button>
        </form>

        <div className="mt-6 text-center">
            <a href={tokenUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                <span>Generate token on GitHub</span>
                <ExternalLinkIcon className="w-4 h-4" />
            </a>
        </div>
      </div>
    </div>
  );
};