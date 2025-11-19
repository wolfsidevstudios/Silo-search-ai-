
import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface OnboardingProps {
  onComplete: (geminiApiKey: string) => void;
}

const ProgressBar: React.FC<{ current: number, total: number }> = ({ current, total }) => (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-8 overflow-hidden">
        <div className="bg-black h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${(current / total) * 100}%` }}></div>
    </div>
);

const SURVEY_OPTIONS = ["Social Media", "Friend", "Search Engine", "Blog/News", "Ad", "Other"];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState('welcome');
    const [geminiApiKey, setGeminiApiKey] = useState('');
    const [surveySelection, setSurveySelection] = useState<string | null>(null);
    const [otherSurvey, setOtherSurvey] = useState('');

    const handleFinish = () => {
        if (!geminiApiKey.trim()) {
            alert('Please enter your Google Gemini API key to continue.');
            setStep('apiKey');
            return;
        }
        onComplete(geminiApiKey);
    };

    const requestLocation = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(() => {}, () => {});
        }
        setStep('microphone');
    };

    const requestMicrophone = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {}).catch(() => {});
        setStep('apiKey');
    };
    
    const renderStep = () => {
        switch(step) {
            case 'welcome':
                return (
                    <div className="text-center max-w-2xl mx-auto animate-[fadeIn_0.6s_ease-out]">
                        <div className="w-24 h-24 mx-auto mb-8 bg-black text-white p-5 rounded-[2rem] shadow-2xl shadow-purple-500/20 transform hover:scale-105 transition-transform duration-500">
                            <LogoIcon className="w-full h-full" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Welcome to Kyndra AI</h1>
                        <p className="text-xl text-gray-500 font-medium mb-12">Your intelligent gateway to the web.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                            {[
                                { icon: SearchIcon, text: "Smart Search" },
                                { icon: FileTextIcon, text: "Summaries" },
                                { icon: LightbulbIcon, text: "Insights" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 text-gray-900">
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <span className="font-bold text-gray-800">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => setStep('location')} className="px-10 py-4 bg-black text-white text-lg font-bold rounded-full hover:bg-gray-800 hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 mx-auto">
                            Get Started <ArrowRightIcon />
                        </button>
                    </div>
                );
            case 'location':
                 return (
                    <div className="text-center max-w-md mx-auto w-full animate-[fadeIn_0.5s_ease-out]">
                        <ProgressBar current={1} total={4} />
                        <div className="w-24 h-24 mx-auto mb-8 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center border-4 border-blue-100">
                            <MapPinIcon className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Local Intelligence</h2>
                        <p className="text-gray-500 mb-10 leading-relaxed">Enable location to get hyper-local weather forecasts and relevant search results. Your data stays on your device.</p>
                        <div className="space-y-3">
                            <button onClick={requestLocation} className="w-full px-6 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg">
                                Allow Location Access
                            </button>
                            <button onClick={() => setStep('microphone')} className="w-full px-6 py-4 bg-white text-gray-600 font-semibold rounded-full hover:bg-gray-50 transition-colors">
                                Skip for Now
                            </button>
                        </div>
                    </div>
                 );
            case 'microphone':
                return (
                     <div className="text-center max-w-md mx-auto w-full animate-[fadeIn_0.5s_ease-out]">
                        <ProgressBar current={2} total={4} />
                        <div className="w-24 h-24 mx-auto mb-8 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center border-4 border-red-100">
                            <MicrophoneIcon className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Voice Command</h2>
                        <p className="text-gray-500 mb-10 leading-relaxed">Speak naturally to search, ask questions, and interact with your AI agent hands-free.</p>
                        <div className="space-y-3">
                            <button onClick={requestMicrophone} className="w-full px-6 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg">
                                Enable Microphone
                            </button>
                            <button onClick={() => setStep('apiKey')} className="w-full px-6 py-4 bg-white text-gray-600 font-semibold rounded-full hover:bg-gray-50 transition-colors">
                                Skip for Now
                            </button>
                        </div>
                    </div>
                );
            case 'apiKey':
                return (
                    <div className="text-center max-w-md mx-auto w-full animate-[fadeIn_0.5s_ease-out]">
                        <ProgressBar current={3} total={4} />
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Power Your AI</h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">Kyndra AI uses the Gemini API to provide intelligence. Enter your key to activate the agent.</p>
                        
                        <div className="text-left mb-8">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-4">Gemini API Key</label>
                            <input
                                type="password"
                                value={geminiApiKey}
                                onChange={(e) => setGeminiApiKey(e.target.value)}
                                placeholder="Paste your key here..."
                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-full outline-none transition-all text-lg font-medium placeholder:text-gray-400"
                                autoFocus
                            />
                            <div className="mt-4 text-center">
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                                    Get a free key from Google &rarr;
                                </a>
                            </div>
                        </div>

                        <button onClick={() => setStep('survey')} className="w-full px-6 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg" disabled={!geminiApiKey.trim()}>
                            Continue
                        </button>
                    </div>
                );
            case 'survey':
                 return (
                     <div className="text-center max-w-md mx-auto w-full animate-[fadeIn_0.5s_ease-out]">
                        <ProgressBar current={4} total={4} />
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">One last thing...</h2>
                        <p className="text-gray-500 mb-8">How did you discover Kyndra AI?</p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {SURVEY_OPTIONS.map(option => (
                                <button 
                                    key={option} 
                                    onClick={() => setSurveySelection(option)} 
                                    className={`px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 border ${surveySelection === option ? 'bg-black text-white border-black shadow-lg transform scale-[1.02]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        
                        {surveySelection === 'Other' && (
                            <input
                                type="text"
                                value={otherSurvey}
                                onChange={(e) => setOtherSurvey(e.target.value)}
                                placeholder="Please specify..."
                                className="w-full px-6 py-3 mb-6 bg-gray-50 border-2 border-transparent focus:border-gray-300 rounded-full outline-none"
                            />
                        )}

                        <button onClick={handleFinish} className="w-full px-6 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all shadow-lg mt-4">
                            Complete Setup
                        </button>
                    </div>
                 );
        }
    }
  
    return (
        <div className="fixed inset-0 bg-[#FAFAFA] z-50 flex flex-col items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-4xl bg-white/50 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/50">
                {renderStep()}
            </div>
            <div className="mt-8 text-center text-xs font-medium text-gray-400">
                <p>© {new Date().getFullYear()} Kyndra AI. Private & Secure.</p>
            </div>
        </div>
    );
};
