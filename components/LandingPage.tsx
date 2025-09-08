import React, { useEffect, useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { XIcon } from './icons/XIcon';
import { GitHubIcon } from './icons/GitHubIcon';
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
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { CheckIcon } from './icons/CheckIcon';


interface LandingPageProps {
  onNavigateToLogin: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

const AnimatedSearchPrompt: React.FC = () => {
  const questions = [
    "what's a cat?",
    "how does photosynthesis work?",
    "best places to visit in Italy",
    "explain quantum computing simply",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % questions.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(timer);
  }, [questions.length]);

  return (
    <div className="text-xl text-gray-500 mt-8 text-center">
      Search for{' '}
      <span className="inline-block font-medium text-gray-700">
        <span key={index} className="animated-question">
          {questions[index]}
        </span>
      </span>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onOpenLegalPage }) => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToLogin();
  };

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
                <button onClick={onNavigateToLogin} className="hover:text-purple-600">Sign In</button>
            </nav>
            <button onClick={onNavigateToLogin} className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition">
                Get Started
            </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative text-center pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                    <span className="block text-gray-900">Search, Summarized.</span>
                    <span className="block text-purple-600">Instantly.</span>
                </h1>
                <p className="mt-5 max-w-2xl mx-auto text-base text-gray-500 sm:text-xl lg:text-lg xl:text-xl">
                    Get instant AI-powered answers and quick links, cutting through the clutter of traditional search.
                </p>
                <AnimatedSearchPrompt />
                <div className="mt-6 max-w-xl mx-auto">
                    <form onSubmit={handleSearchSubmit} className="hero-search-box-container">
                        <input 
                          type="search" 
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Ask anything..." 
                          className="hero-search-input" />
                        <button type="submit" className="hero-search-button" aria-label="Search">
                            <ArrowRightIcon />
                        </button>
                    </form>
                </div>
            </div>
        </section>

        {/* App Preview Section */}
        <section className="py-16 md:py-24 bg-gray-50 border-y">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900">See How It Works</h2>
                    <p className="mt-4 text-lg text-gray-500">A new, intuitive way to explore information.</p>
                </div>
                <div className="max-w-5xl mx-auto">
                    <AppPreviewAnimation />
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-white">
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
        <section className="py-16 md:py-24 bg-gray-50 border-y">
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
        <section className="bg-white py-16 md:py-24">
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

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 bg-gray-50 border-y">
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
                <button onClick={onNavigateToLogin} className="mt-6 block w-full text-center rounded-lg bg-purple-600 px-6 py-3 text-base font-medium text-white hover:bg-purple-700">
                  Get Started for Free
                </button>
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
        <section className="bg-gray-50">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    <span className="block">Ready to transform your search?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-gray-500">Create an account today and experience the future of information.</p>
                <button onClick={onNavigateToLogin} className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 sm:w-auto">
                    Get Started Now
                </button>
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