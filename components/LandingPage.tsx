import React, { useEffect, useRef } from 'react';
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


interface LandingPageProps {
  onGoogleSignIn: (response: any) => void;
}

const handleLogin = async (provider: 'github' | 'twitter' | 'spotify') => {
  const { error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) {
    console.error(`Error logging in with ${provider}:`, error.message);
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGoogleSignIn }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          <LogoIcon className="w-8 h-8" />
          <span className="text-xl font-bold">Silo Search</span>
        </div>
      </header>

      <main className="min-h-screen bg-gray-50 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-32 pb-16 lg:pt-40 lg:pb-24">
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
                          <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Or sign in with</span>
                          </div>
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
        </div>
      </main>

      <section className="py-16 md:py-24 bg-white border-t">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">A smarter way to find information</h2>
            <p className="mt-2 text-gray-600">Silo Search reimagines the search experience from the ground up.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-7 h-7" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">AI-Powered Summaries</h3>
              <p className="mt-1 text-gray-600 text-sm">No more endless scrolling. Get a concise, easy-to-read summary for any query.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <LinkIcon className="w-7 h-7" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Relevant Quick Links</h3>
              <p className="mt-1 text-gray-600 text-sm">Dive deeper with a curated list of the most relevant sources used to generate your summary.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <BrushIcon className="w-7 h-7" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Fully Customizable</h3>
              <p className="mt-1 text-gray-600 text-sm">Make it your own. Personalize your search page with wallpapers, widgets, and custom themes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t">
        <div className="max-w-5xl mx-auto px-4">
            <div className="text-center">
                <h2 className="text-base font-semibold text-gray-600 tracking-wider uppercase">Powered by the best</h2>
                <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
                    <div className="col-span-1 flex justify-center">
                        <LogoIcon className="h-10"/>
                    </div>
                    <div className="col-span-1 flex justify-center">
                        <OpenAIIcon className="h-10"/>
                    </div>
                    <div className="col-span-1 flex justify-center">
                        <AnthropicIcon className="h-10"/>
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                        <p className="text-gray-500 font-semibold text-lg">+ many more</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <footer className="bg-white py-8 border-t">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Silo Search. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};