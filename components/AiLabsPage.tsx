import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import type { UserProfile } from '../types';
import { AiHomePage } from './AiHomePage';

interface AiLabsPageProps {
  onSearch: (query: string, options: any) => void;
  navigate: (path: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

export const AiLabsPage: React.FC<AiLabsPageProps> = ({ onSearch, navigate, onOpenLegalPage, ...headerProps }) => {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header {...headerProps} activeTab="ai-labs" onNavigate={navigate} />
            <main className="flex-grow flex min-h-0 relative overflow-hidden">
                {/* Gradient Blobs */}
                <div className="absolute top-10 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
                <div className="absolute bottom-10 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
                
                <AiHomePage onSearch={onSearch} />
            </main>
            <Footer onOpenLegalPage={onOpenLegalPage} />
        </div>
    );
};