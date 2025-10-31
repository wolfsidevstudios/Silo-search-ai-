import React, { useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SearchIcon } from './icons/SearchIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface OnboardingProps {
  onComplete: (geminiApiKey: string) => void;
}

const ProgressBar: React.FC<{ current: number, total: number }> = ({ current, total }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-black h-2 rounded-full" style={{ width: `${(current / total) * 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
    </div>
);

const SURVEY_OPTIONS = ["Social Media", "Friend or Colleague", "Search Engine", "Blog or News Article", "Advertisement", "Other"];

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
                    <div className="text-center">
                        <LogoIcon className="w-16 h-16 mx-auto mb-6 bg-black text-white p-3 rounded-2xl" />
                        <h1 className="text-4xl font-bold text-gray-900">Welcome to Kyndra AI</h1>
                        <p className="mt-4 text-lg text-gray-600">Your intelligent search agent, reimagined.</p>
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"><SearchIcon className="w-8 h-8 text-gray-700" /></div>
                                <h3 className="mt-4 font-semibold">Find information faster</h3>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"><FileTextIcon className="w-8 h-8 text-gray-700" /></div>
                                <h3 className="mt-4 font-semibold">Organize your research</h3>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center"><LightbulbIcon className="w-8 h-8 text-gray-700" /></div>
                                <h3 className="mt-4 font-semibold">Get smarter insights</h3>
                            </div>
                        </div>
                        <button onClick={() => setStep('location')} className="mt-12 px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800">
                            Get Started
                        </button>
                    </div>
                );
            case 'location':
                 return (
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <MapPinIcon className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Enable Location for Local Weather</h1>
                        <p className="mt-4 text-gray-600">Kyndra uses your location to provide personalized and accurate weather forecasts. Your privacy is important to us.</p>
                        <div className="mt-8 space-y-3">
                            <button onClick={requestLocation} className="w-full px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800">Allow Location</button>
                            <button onClick={() => setStep('microphone')} className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300">Maybe Later</button>
                        </div>
                    </div>
                 );
            case 'microphone':
                return (
                     <div className="text-center max-w-md mx-auto w-full">
                        <div className="mb-8">
                           <p className="font-semibold mb-2">Onboarding</p>
                           <ProgressBar current={1} total={4} />
                           <p className="text-sm text-gray-500 mt-2">Step 1 of 4</p>
                        </div>
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <MicrophoneIcon className="w-10 h-10 text-gray-700" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Enable Your Microphone</h1>
                        <p className="mt-4 text-gray-600">Use your voice to search, ask questions, and command Kyndra AI. This will trigger your browser's native permission prompt.</p>
                        <div className="mt-8 space-y-3">
                            <button onClick={requestMicrophone} className="w-full px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800">Allow Access</button>
                            <button onClick={() => setStep('apiKey')} className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300">Not Now</button>
                        </div>
                    </div>
                );
            case 'apiKey':
                return (
                    <div className="text-center max-w-md mx-auto w-full">
                         <div className="mb-8">
                           <p className="font-semibold mb-2">Onboarding</p>
                           <ProgressBar current={2} total={4} />
                           <p className="text-sm text-gray-500 mt-2">Step 2 of 4</p>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Connect to Gemini AI</h1>
                        <p className="mt-4 text-gray-600">To get started, please enter your Google Gemini API key. Kyndra AI uses this to power your personal search agent.</p>
                        <div className="mt-8 text-left">
                            <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-700">Gemini API Key</label>
                            <input
                                id="gemini-key"
                                type="password"
                                value={geminiApiKey}
                                onChange={(e) => setGeminiApiKey(e.target.value)}
                                placeholder="Enter your Gemini API key"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                            />
                            <p className="mt-2 text-xs text-gray-500">You can find your API key in Google AI Studio. <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Find your API key here</a></p>
                        </div>
                        <button onClick={() => setStep('survey')} className="mt-8 w-full px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 disabled:bg-gray-400" disabled={!geminiApiKey.trim()}>
                            Continue
                        </button>
                    </div>
                );
            case 'survey':
                 return (
                     <div className="text-center max-w-md mx-auto w-full">
                         <div className="mb-8">
                           <p className="font-semibold mb-2">Onboarding</p>
                           <ProgressBar current={3} total={4} />
                           <p className="text-sm text-gray-500 mt-2">Step 3 of 4</p>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">How did you hear about Kyndra AI?</h1>
                        <p className="mt-4 text-gray-600">This helps us understand what's working. Thanks!</p>
                        <div className="mt-8 flex flex-wrap justify-center gap-2">
                            {SURVEY_OPTIONS.map(option => (
                                <button key={option} onClick={() => setSurveySelection(option)} className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${surveySelection === option ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                        {surveySelection === 'Other' && (
                            <div className="mt-6 text-left">
                                <label htmlFor="other-survey" className="block text-sm font-medium text-gray-700">Please specify</label>
                                <input
                                    id="other-survey"
                                    type="text"
                                    value={otherSurvey}
                                    onChange={(e) => setOtherSurvey(e.target.value)}
                                    placeholder="e.g., Podcast"
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        )}
                        <button onClick={handleFinish} className="mt-8 w-full px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800">
                            Finish
                        </button>
                    </div>
                 );
        }
    }
  
    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
           {renderStep()}
        </div>
    );
};