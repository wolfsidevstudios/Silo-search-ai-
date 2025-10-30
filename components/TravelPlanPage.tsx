import React from 'react';
import type { TravelPlan, UserProfile } from '../types';
import { Header } from './Header';
import { Footer } from './Footer';
import { SearchInput } from './SearchInput';
import { CheckIcon } from './icons/CheckIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { InfoIcon } from './icons/InfoIcon';

interface TravelPlanPageProps {
  plan: TravelPlan;
  originalQuery: string;
  onSearch: (query: string, options: { studyMode?: boolean; mapSearch?: boolean; travelSearch?: boolean; shoppingSearch?: boolean; pexelsSearch?: boolean; }) => void;
  onHome: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

export const TravelPlanPage: React.FC<TravelPlanPageProps> = ({ plan, onSearch, onHome, ...headerProps }) => {

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${plan.mapBoundingBox.join('%2C')}&layer=mapnik`;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Header {...headerProps} onHome={onHome} showHomeButton={true} />
        <main className="flex-grow container mx-auto px-4 py-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{plan.destination}</h1>
                <p className="mt-2 text-lg text-gray-600">{plan.duration} Itinerary</p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-semibold text-gray-500">Est. Budget</p>
                        <p className="text-lg font-bold text-gray-800">{plan.budget}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p className="font-semibold text-gray-500">Flights</p>
                        <p className="text-gray-800">{plan.flightDetails.advice}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg col-span-1 md:col-span-2">
                        <p className="font-semibold text-gray-500">Accommodation ({plan.accommodation.type})</p>
                        <p className="text-gray-800">{plan.accommodation.suggestions.join(', ')}</p>
                    </div>
                </div>
            </div>
            
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-2">
                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md mb-8">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            src={embedUrl}
                            title={`Map of ${plan.destination}`}
                        ></iframe>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Daily Itinerary</h2>
                    <div className="space-y-6">
                        {plan.itinerary.map(day => (
                            <div key={day.day} id={`day-${day.day}`} className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold text-purple-700">Day {day.day}: {day.title}</h3>
                                <ul className="mt-4 space-y-4">
                                    {day.activities.map((activity, index) => (
                                        <li key={index} className="flex">
                                            <div className="flex-shrink-0 w-24 text-right pr-4">
                                                <p className="font-semibold text-gray-800">{activity.time}</p>
                                            </div>
                                            <div className="relative pl-4 border-l-2 border-gray-200">
                                                <div className="absolute -left-[7px] top-1 w-3 h-3 bg-purple-600 rounded-full border-2 border-white"></div>
                                                <p className="text-gray-700">{activity.description}</p>
                                                {activity.location && (
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center"><MapPinIcon className="w-3 h-3 mr-1" />{activity.location}</p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="lg:col-span-1 mt-8 lg:mt-0 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold mb-4">Packing List</h3>
                        <ul className="space-y-2 text-sm">
                            {plan.packingList.map((item, index) => (
                                <li key={index} className="flex items-center">
                                    <CheckIcon className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold mb-4">Local Tips</h3>
                        <ul className="space-y-3 text-sm">
                            {plan.localTips.map((tip, index) => (
                                <li key={index} className="flex items-start">
                                    <InfoIcon className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>

        </main>
        <footer className="sticky bottom-0 left-0 right-0 p-2 sm:p-4 bg-white/80 backdrop-blur-sm z-20">
            <div className="max-w-xl mx-auto">
                <SearchInput onSearch={onSearch} isLarge={false} speechLanguage="en-US" onOpenComingSoonModal={() => {}} isStudyMode={false} setIsStudyMode={() => {}} />
                <Footer onOpenLegalPage={headerProps.onOpenLegalPage} className="p-0 pt-2 text-xs" />
            </div>
      </footer>
    </div>
  );
};