import React from 'react';
import type { UserProfile, ShoppingResult } from '../types';
import { Header } from './Header';
import { SearchInput } from './SearchInput';

interface ShoppingPageProps {
  initialResult: ShoppingResult;
  originalQuery: string;
  onSearch: (query: string, options: { studyMode?: boolean; mapSearch?: boolean; travelSearch?: boolean; shoppingSearch?: boolean; pexelsSearch?: boolean; }) => void;
  onHome: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
}

const ProductCard: React.FC<{ product: ShoppingResult['products'][0] }> = ({ product }) => (
  <div className="bg-gray-100 rounded-2xl p-4 flex flex-col h-full">
    <div className="aspect-square w-full bg-white rounded-xl flex items-center justify-center p-4">
      <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain rounded-lg" />
    </div>
    <div className="mt-4 flex flex-col flex-grow">
      <h3 className="font-bold text-gray-900">{product.name}</h3>
      <p className="text-sm text-gray-600 mt-2 flex-grow">{product.summary}</p>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xl font-extrabold text-gray-900">{product.price}</p>
        <a href={product.buyUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-colors">
          Buy Now
        </a>
      </div>
    </div>
  </div>
);

export const ShoppingPage: React.FC<ShoppingPageProps> = ({ initialResult, originalQuery, onSearch, onHome, ...headerProps }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header {...headerProps} onHome={onHome} showHomeButton={true} />
      <main className="flex-grow flex flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="w-full lg:w-1/3 xl:w-1/4 h-1/2 lg:h-auto flex flex-col border-r border-gray-200">
          <div className="p-4 border-b">
            <SearchInput 
              onSearch={onSearch} 
              initialValue={originalQuery}
              isLarge={false}
              speechLanguage="en-US" 
              onOpenComingSoonModal={() => {}} 
              isStudyMode={false}
              setIsStudyMode={() => {}}
            />
          </div>
          <div className="flex-grow overflow-y-auto p-6">
             <h2 className="text-xl font-bold text-gray-800 mb-2">Shopping Summary</h2>
             <p className="text-gray-600 whitespace-pre-wrap">{initialResult.overallSummary}</p>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="w-full lg:w-2/3 xl:w-3/4 h-1/2 lg:h-auto flex-grow bg-gray-50 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Top 3 Recommendations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {initialResult.products.slice(0, 3).map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};