import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import type { UserProfile, Space } from '../types';
import { PlusSquareIcon } from './icons/PlusSquareIcon';

interface SpacesListPageProps {
  spaces: Space[];
  onOpenSpaceEditor: (space: Partial<Space> | null) => void;
  navigate: (path: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

export const SpacesListPage: React.FC<SpacesListPageProps> = ({ spaces, onOpenSpaceEditor, navigate, onOpenLegalPage, ...headerProps }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header {...headerProps} activeTab="spaces" onNavigate={navigate} />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="p-6">
                    <header className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">My Spaces</h2>
                        <button onClick={() => onOpenSpaceEditor(null)} className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800"><PlusSquareIcon className="w-4 h-4" /><span>New Space</span></button>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {spaces.length > 0 ? spaces.map(space => (
                            <button key={space.id} onClick={() => navigate(`/space/${space.id}`)} className="text-left p-4 bg-white rounded-lg border hover:shadow-md hover:-translate-y-0.5 transition-all">
                                <h3 className="font-bold text-gray-800">{space.name}</h3>
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{space.systemInstruction || 'No system instruction'}</p>
                                <div className="text-xs text-gray-500 mt-3">
                                    <p>{space.dataSources.length} data sources</p>
                                    <p>{space.websites.length} websites</p>
                                </div>
                            </button>
                        )) : (
                            <div className="md:col-span-2 lg:col-span-3 text-center text-gray-500 py-12">
                                <p>Create a Space to build a custom search agent.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer onOpenLegalPage={onOpenLegalPage} />
        </div>
    );
};
