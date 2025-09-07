import React, { useEffect, useRef, useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { XIcon } from './icons/XIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { supabase } from '../utils/supabase';
import { SpotifyIcon } from './icons/SpotifyIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { BrushIcon } from './icons/BrushIcon';
import { AppPreviewAnimation } from './AppPreviewAnimation';
import { OpenAIIcon } from './icons/OpenAIIcon';
import { AnthropicIcon } from './icons/AnthropicIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { LockIcon } from './icons/LockIcon';
import { KeyIcon } from './icons/KeyIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { PrivacyIcon } from './icons/PrivacyIcon';
import { MailIcon } from './icons/MailIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { NotionIcon } from './icons/NotionIcon';
import { ZapIcon } from './icons/ZapIcon';
import { CheckIcon } from './icons/CheckIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ClipboardCheckIcon } from './icons/ClipboardCheckIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { LayersIcon } from './icons/LayersIcon';
import { ListIcon } from './icons/ListIcon';
import { FileDownIcon } from './icons/FileDownIcon';


interface LandingPageProps {
  onGoogleSignIn: (response: any) => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

const handleLogin = async (provider: 'github' | 'twitter' | 'spotify') => {
  const { error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) {
    console.error(`Error logging in with ${provider}:`, error.message);
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGoogleSignIn, onOpenLegalPage }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: '127898517822-f4j5ha3e2n6futbhehvtf06cfqhjhgej.apps.googleusercontent.com',
          callback: onGoogleSignIn,
        });
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: 'outline', size: 'large', type: 'standard', shape: 'pill', text: 'continue_with', width: '350' }
        );
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
      }
    }
  }, [onGoogleSignIn]);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 font-sans antialiased">
      <header className={`fixed top-0 left-0 right-0 p-4 transition-all duration-300 z-50 ${headerScrolled ? 'bg-white/80 backdrop-blur-sm shadow-md' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <LogoIcon className="w-8 h-8" />
                <span className="text-xl font-bold">Silo Search</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                <a href="#features" className="hover:text-purple-600">Features</a>
                <a href="#pricing" className="hover:text-purple-600">Pricing</a>
                <a href="#signin" className="hover:text-purple-600">Sign In</a>
            </nav>
            <a href="#signin" className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition">
                Get Started
            </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="signin" className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                        <h1>
                            <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                                <span className="block text-gray-900">Search, Summarized.</span>
                                <span className="block text-purple-600">Instantly.</span>
                            </span>
                        </h1>
                        <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                            Get instant AI-powered answers and quick links, cutting through the clutter of traditional search. Sign in to unlock a customizable, private, and intelligent search experience.
                        </p>
                        <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:mx-0 lg:text-left">
                            <div ref={googleButtonRef} className="flex justify-center lg:justify-start"></div>
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300" /></div>
                                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-50 text-gray-500">Or sign in with</span></div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-center lg:justify-start space-x-4">
                                <button onClick={() => handleLogin('twitter')} className="p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition" aria-label="Sign in with X"><XIcon className="w-5 h-5 text-gray-700" /></button>
                                <button onClick={() => handleLogin('github')} className="p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition" aria-label="Sign in with GitHub"><GitHubIcon className="w-5 h-5 text-gray-700" /></button>
                                <button onClick={() => handleLogin('spotify')} className="p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition" aria-label="Sign in with Spotify"><SpotifyIcon className="w-5 h-5 text-gray-700" /></button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6">
                        <AppPreviewAnimation />
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-white border-y">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">A smarter way to find information</h2>
                    <p className="mt-4 text-lg text-gray-500">Silo Search reimagines the search experience from the ground up.</p>
                </div>
                <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><SparklesIcon className="w-7 h-7" /></div>
                        <h3 className="mt-4 font-semibold text-lg">AI-Powered Summaries</h3>
                        <p className="mt-1 text-gray-600 text-sm">No more endless scrolling. Get a concise, easy-to-read summary for any query.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><LinkIcon className="w-7 h-7" /></div>
                        <h3 className="mt-4 font-semibold text-lg">Relevant Quick Links</h3>
                        <p className="mt-1 text-gray-600 text-sm">Dive deeper with a curated list of the most relevant sources used to generate your summary.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><MessageSquareIcon className="w-7 h-7" /></div>
                        <h3 className="mt-4 font-semibold text-lg">Deep Dive with Chat</h3>
                        <p className="mt-1 text-gray-600 text-sm">Ask follow-up questions and have a natural conversation to explore topics further.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><BrushIcon className="w-7 h-7" /></div>
                        <h3 className="mt-4 font-semibold text-lg">Your Personal Dashboard</h3>
                        <p className="mt-1 text-gray-600 text-sm">Make it your own. Personalize your search page with wallpapers, widgets, and custom themes.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><LockIcon className="w-7 h-7" /></div>
                        <h3 className="mt-4 font-semibold text-lg">Private by Design</h3>
                        <p className="mt-1 text-gray-600 text-sm">Your API keys and settings are stored locally on your device, never on our servers.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"><KeyIcon className="w-7 h-7" /></div>
                        <h3 className="mt-4 font-semibold text-lg">Bring Your Own Key</h3>
                        <p className="mt-1 text-gray-600 text-sm">Connect your own API keys from leading AI providers for complete control over your usage.</p>
                    </div>
                </div>
            </div>
        </section>
        
        {/* How it works Section */}
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Get started in minutes</h2>
                    <p className="mt-4 text-lg text-gray-500">Three simple steps to a better search experience.</p>
                </div>
                <div className="mt-12 space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md ring-1 ring-gray-200"><span className="text-2xl font-bold text-purple-600">1</span></div>
                        <h3 className="mt-4 font-semibold text-lg">Create an Account</h3>
                        <p className="mt-1 text-gray-600 text-sm">Sign in quickly and securely using Google or your favorite social provider.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md ring-1 ring-gray-200"><span className="text-2xl font-bold text-purple-600">2</span></div>
                        <h3 className="mt-4 font-semibold text-lg">Add Your API Key</h3>
                        <p className="mt-1 text-gray-600 text-sm">Head to settings and add your API key from a provider like Google AI Studio.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md ring-1 ring-gray-200"><span className="text-2xl font-bold text-purple-600">3</span></div>
                        <h3 className="mt-4 font-semibold text-lg">Start Searching</h3>
                        <p className="mt-1 text-gray-600 text-sm">Ask anything and get instant, intelligent summaries and related links.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Privacy Section */}
        <section className="bg-white py-16 md:py-24 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Your Search, Your Data. Period.</h2>
                        <p className="mt-4 text-lg text-gray-500">We believe your information belongs to you. That's why Silo Search is built with privacy at its core.</p>
                        <dl className="mt-8 space-y-6">
                            <div className="flex">
                                <CheckCircleIcon className="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Local-First Storage.</span> All your data, including API keys and history, stays on your device.</dd>
                            </div>
                            <div className="flex">
                                <CheckCircleIcon className="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">No Tracking Servers.</span> We don't have servers that store your personal information or search queries.</dd>
                            </div>
                            <div className="flex">
                                <CheckCircleIcon className="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Full Data Control.</span> Export or delete all your app data at any time from the settings.</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="mt-10 lg:mt-0 flex items-center justify-center">
                        <PrivacyIcon className="w-48 h-48 text-purple-200" />
                    </div>
                </div>
            </div>
        </section>

        {/* Coming Soon Section - Gmail */}
        <section className="py-16 md:py-24 bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
                    <div className="relative w-full aspect-[4/3] max-w-lg mx-auto lg:max-w-none">
                        <div className="absolute inset-0 bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <LogoIcon className="w-6 h-6" />
                                    <span className="font-semibold text-sm">Silo Search</span>
                                </div>
                                <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Gmail Connected</div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Search your emails...</p>
                                <div className="relative">
                                    <input type="text" readOnly value="summary of last week's project update" className="w-full bg-gray-100 rounded-lg p-3 text-sm border-gray-200" />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg">
                                        <ArrowRightIcon />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl p-6 border transform rotate-3">
                             <h4 className="font-bold">Summary: Project Update</h4>
                             <p className="text-sm mt-2 text-gray-600">The team completed the UI mockups. John is now working on the backend integration, expected to be done by Friday. Marketing assets are pending review.</p>
                        </div>
                    </div>
                    <div className="mt-16 lg:mt-0">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 font-semibold text-sm rounded-full mb-4">Coming Soon</span>
                        <h2 className="text-3xl font-extrabold text-gray-900">Your personal email assistant.</h2>
                        <p className="mt-4 text-lg text-gray-500">Connect Gmail to instantly find any email and get intelligent summaries of conversations, right from the search bar.</p>
                        <dl className="mt-8 space-y-6">
                            <div className="flex">
                                <MailIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Lightning-Fast Search.</span> Instantly find any email, attachment, or conversation across your entire inbox.</dd>
                            </div>
                            <div className="flex">
                                <SparklesIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">AI-Powered Summaries.</span> Get the gist of long emails or threads in seconds without having to read everything.</dd>
                            </div>
                            <div className="flex">
                                <LinkIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Seamless Integration.</span> Search your emails alongside the web, all from the same powerful search bar.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </section>

        {/* Coming Soon Section - Connected Apps */}
        <section className="py-16 md:py-24 bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
                    <div className="lg:col-start-2">
                        <div className="relative w-full aspect-[4/3] max-w-lg mx-auto lg:max-w-none">
                            <div className="absolute inset-0 bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Search everything...</p>
                                    <div className="relative">
                                        <input type="text" readOnly value="marketing plan Q3" className="w-full bg-gray-100 rounded-lg p-3 text-sm border-gray-200" />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg">
                                            <ArrowRightIcon />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">All</button>
                                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Web</button>
                                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Gmail</button>
                                    <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded-full ring-2 ring-purple-300">Notion</button>
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-xl shadow-2xl p-4 border transform -rotate-3">
                                <div className="flex items-start space-x-3">
                                    <NotionIcon className="w-5 h-5 mt-1 text-gray-800 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-sm">Q3 Marketing Plan</h4>
                                        <p className="text-xs mt-1 text-gray-500">The Q3 marketing plan focuses on expanding our reach through content marketing and targeted social media campaigns...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 lg:mt-0 lg:row-start-1 lg:col-start-1">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 font-semibold text-sm rounded-full mb-4">Coming Soon</span>
                        <h2 className="text-3xl font-extrabold text-gray-900">Your single source of truth.</h2>
                        <p className="mt-4 text-lg text-gray-500">Connect your work apps to Silo Search and find anything, anywhere. Stop jumping between tabs and start finding.</p>
                        <dl className="mt-8 space-y-6">
                            <div className="flex">
                                <LinkIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Unified Search.</span> Search across Notion, Slack, Drive, and more from one place.</dd>
                            </div>
                            <div className="flex">
                                <SparklesIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Contextual Answers.</span> Get AI summaries that understand the context of your personal documents and conversations.</dd>
                            </div>
                            <div className="flex">
                                <ZapIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Boost Productivity.</span> Spend less time looking for information and more time using it.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Coming Soon Section - Study Mode */}
        <section className="py-16 md:py-24 bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
                    <div className="relative w-full aspect-[4/3] max-w-lg mx-auto lg:max-w-none">
                        <div className="absolute inset-0 bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <LogoIcon className="w-6 h-6" />
                                    <span className="font-semibold text-sm">Silo Search</span>
                                </div>
                                <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Study Mode</div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Study topic...</p>
                                <div className="relative">
                                    <input type="text" readOnly value="photosynthesis" className="w-full bg-gray-100 rounded-lg p-3 text-sm border-gray-200" />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg">
                                        <SparklesIcon className="w-5 h-5"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-xl shadow-2xl p-4 border transform rotate-3">
                            <h4 className="font-bold text-sm">Flashcard</h4>
                            <p className="text-xs mt-1 text-gray-500">What is the role of chlorophyll?</p>
                            <div className="mt-2 text-center py-2 bg-green-50 rounded-md text-sm text-green-800 font-medium">Flip Card</div>
                        </div>
                    </div>
                    <div className="mt-16 lg:mt-0">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 font-semibold text-sm rounded-full mb-4">Coming Soon</span>
                        <h2 className="text-3xl font-extrabold text-gray-900">Ace your exams with Study Mode.</h2>
                        <p className="mt-4 text-lg text-gray-500">Turn any search topic into a personalized study session. Generate flashcards, quizzes, and simplified explanations to master any subject.</p>
                        <dl className="mt-8 space-y-6">
                            <div className="flex">
                                <BookOpenIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Generate Flashcards.</span> Automatically create flashcards for key terms and concepts.</dd>
                            </div>
                            <div className="flex">
                                <ClipboardCheckIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Create Practice Quizzes.</span> Test your knowledge with multiple-choice questions based on the topic.</dd>
                            </div>
                            <div className="flex">
                                <LightbulbIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Simplify Complex Topics.</span> Get 'Explain Like I'm 5' summaries for difficult subjects.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </section>

        {/* Coming Soon Section - Deep Research */}
        <section className="py-16 md:py-24 bg-white border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
                    <div className="lg:col-start-2">
                         <div className="relative w-full aspect-[4/3] max-w-lg mx-auto lg:max-w-none">
                            <div className="absolute inset-0 bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between border">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Deep Research...</p>
                                    <div className="relative">
                                        <input type="text" readOnly value="the future of renewable energy" className="w-full bg-gray-100 rounded-lg p-3 text-sm border-gray-200" />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black text-white rounded-lg">
                                            <ZapIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                     <div className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">5 Sources</div>
                                     <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Outline</div>
                                     <div className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Summary</div>
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-xl shadow-2xl p-4 border transform -rotate-3">
                                 <h4 className="font-bold text-sm">Generated Outline</h4>
                                 <ul className="mt-2 text-xs text-gray-600 space-y-1 list-decimal list-inside">
                                    <li>Introduction to Renewable Energy</li>
                                    <li>Current State of Solar Power</li>
                                    <li>Innovations in Wind Turbines</li>
                                    <li>Conclusion and Future Outlook</li>
                                 </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 lg:mt-0 lg:row-start-1 lg:col-start-1">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 font-semibold text-sm rounded-full mb-4">Coming Soon</span>
                        <h2 className="text-3xl font-extrabold text-gray-900">Go beyond the surface with Deep Research.</h2>
                        <p className="mt-4 text-lg text-gray-500">For when you need more than a quick summary. Our Deep Research mode synthesizes information from multiple sources to give you a comprehensive understanding of any topic.</p>
                        <dl className="mt-8 space-y-6">
                            <div className="flex">
                                <LayersIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Multi-Source Synthesis.</span> Get a unified perspective by pulling information from up to 10 different web sources.</dd>
                            </div>
                            <div className="flex">
                                <ListIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Generate Outlines & Reports.</span> Instantly create structured outlines for essays, articles, or presentations.</dd>
                            </div>
                            <div className="flex">
                                <FileDownIcon className="flex-shrink-0 w-6 h-6 text-purple-600" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Export to Docs.</span> Send your research directly to a Google Doc or download as a Markdown file.</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900">Simple, transparent pricing</h2>
              <p className="mt-4 text-lg text-gray-500">
                Start for free. As we add more powerful features, a Pro plan will be introduced.
              </p>
            </div>
            <div className="mt-16 max-w-lg mx-auto grid gap-8 lg:max-w-4xl lg:grid-cols-2">
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
                <h3 className="text-2xl font-semibold text-gray-900">Free</h3>
                <p className="mt-2 text-gray-500">For individuals getting started with smarter search.</p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-gray-900">$0</span>
                  <span className="text-base font-medium text-gray-500">/ month</span>
                </div>
                <a href="#signin" className="mt-6 block w-full text-center rounded-lg bg-purple-600 px-6 py-3 text-base font-medium text-white hover:bg-purple-700">
                  Get Started for Free
                </a>
                <ul className="mt-8 space-y-4 text-sm text-gray-600">
                  <li className="flex space-x-3"><CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /><span>AI-Powered Summaries</span></li>
                  <li className="flex space-x-3"><CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /><span>Relevant Quick Links</span></li>
                  <li className="flex space-x-3"><CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /><span>Follow-up Chat Mode</span></li>
                  <li className="flex space-x-3"><CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /><span>Homepage Personalization</span></li>
                  <li className="flex space-x-3"><CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /><span>Local-First Privacy</span></li>
                </ul>
              </div>
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-12 -mt-12">
                   <div className="bg-purple-100 text-purple-700 text-xs font-semibold tracking-wider uppercase py-4 px-12 transform rotate-45">Coming Soon</div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Pro</h3>
                <p className="mt-2 text-gray-500">For power users who need to search across all their apps.</p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-gray-400">TBA</span>
                </div>
                <button disabled className="mt-6 block w-full text-center rounded-lg bg-gray-300 px-6 py-3 text-base font-medium text-gray-500 cursor-not-allowed">
                  Notify Me
                </button>
                 <ul className="mt-8 space-y-4 text-sm text-gray-600">
                  <li className="flex space-x-3 font-semibold text-gray-700"><span>Everything in Free, plus:</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Connect Apps (Gmail, Notion, Slack)</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Cloud Sync & Backup</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Access to Advanced AI Models</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Collaboration Features</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Logo Cloud Section */}
        <section className="py-16 bg-white border-t">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-base font-semibold text-gray-600 tracking-wider uppercase">Powered by the best</h2>
                    <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
                        <div className="col-span-1 flex justify-center"><LogoIcon className="h-10"/></div>
                        <div className="col-span-1 flex justify-center"><OpenAIIcon className="h-10"/></div>
                        <div className="col-span-1 flex justify-center"><AnthropicIcon className="h-10"/></div>
                        <div className="col-span-1 flex justify-center items-center"><p className="text-gray-500 font-semibold text-lg">+ many more</p></div>
                    </div>
                </div>
            </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gray-50 border-t">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    <span className="block">Ready to transform your search?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-gray-500">Create an account today and experience the future of information.</p>
                <a href="#signin" className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 sm:w-auto">
                    Get Started Now
                </a>
            </div>
        </section>
      </main>

      <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="col-span-2 md:col-span-1">
                      <div className="flex items-center space-x-2">
                          <LogoIcon className="w-8 h-8" />
                          <span className="text-xl font-bold">Silo Search</span>
                      </div>
                      <p className="mt-4 text-gray-500 text-sm">Search, Summarized. Instantly.</p>
                      <div className="mt-6 flex space-x-6">
                        <a href="#" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-gray-500"><span className="sr-only">GitHub</span><GitHubIcon className="w-6 h-6" /></a>
                        <a href="#" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-gray-500"><span className="sr-only">X</span><XIcon className="w-6 h-6" /></a>
                      </div>
                  </div>
                  <div>
                      <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
                      <ul className="mt-4 space-y-2">
                          <li><a href="#features" className="text-base text-gray-500 hover:text-gray-900">Features</a></li>
                           <li><a href="#pricing" className="text-base text-gray-500 hover:text-gray-900">Pricing</a></li>
                          <li><button onClick={() => onOpenLegalPage('about')} className="text-base text-gray-500 hover:text-gray-900">About Us</button></li>
                      </ul>
                  </div>
                  <div>
                      <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
                      <ul className="mt-4 space-y-2">
                          <li><a href="https://www.freeprivacypolicy.com/live/b441984d-6ae7-468f-b21d-0e7b93a9ed4e" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">Privacy Policy</a></li>
                          <li><button onClick={() => onOpenLegalPage('terms')} className="text-base text-gray-500 hover:text-gray-900">Terms of Service</button></li>
                      </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="mailto:wolfsisupport@gmail.com" className="text-base text-gray-500 hover:text-gray-900">Support</a></li>
                    </ul>
                  </div>
              </div>
              <div className="mt-8 border-t border-gray-200 pt-8">
                  <p className="text-base text-gray-400 text-center">&copy; {new Date().getFullYear()} Silo Search. All rights reserved.</p>
              </div>
          </div>
      </footer>
    </div>
  );
};