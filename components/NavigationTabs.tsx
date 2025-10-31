import React from 'react';

interface NavigationTabsProps {
  activeTab: 'search' | 'discover';
  onNavigate: (path: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onNavigate }) => (
    <div className="mb-8 flex space-x-1 bg-gray-200 p-1 rounded-full">
        <button
            onClick={() => onNavigate('/search')}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'search' ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'}`}
        >
            Search
        </button>
        <button
            onClick={() => onNavigate('/discover')}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'discover' ? 'bg-white shadow' : 'text-gray-600 hover:bg-white/50'}`}
        >
            Discover
        </button>
    </div>
);
