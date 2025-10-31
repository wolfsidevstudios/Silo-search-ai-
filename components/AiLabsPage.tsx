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
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header {...headerProps} activeTab="ai-labs" onNavigate={navigate} />
            <main className="flex-grow flex min-h-0">
                <AiHomePage onSearch={onSearch} />
            </main>
            <Footer onOpenLegalPage={onOpenLegalPage} />
        </div>
    );
};
