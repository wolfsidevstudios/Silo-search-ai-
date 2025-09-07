
import React, { useEffect, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { XIcon } from './icons/XIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { supabase } from '../utils/supabase';
import { SpotifyIcon } from './icons/SpotifyIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { BrushIcon } from './icons/BrushIcon';

interface LandingPageProps {
  onGoogleSignIn: (response: any) => void;
}

const handleLogin = async (provider: 'github' | 'twitter' | 'spotify') => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
  });
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
          { theme: 'outline', size: 'large', type: 'standard', shape: 'pill', text: 'signin_with', width: 350 }
        );
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
      }
    }
  }, [onGoogleSignIn]);

  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          <LogoIcon className="w-8 h-8" />
          <span className="text-xl font-bold">Silo Search</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-12 bg-grid-gray-200/[0.2]">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600">
          Search, Summarized.
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Get instant AI-powered answers and quick links, cutting through the clutter of traditional search. Sign in to unlock the full experience.
        </p>
        <div className="mt-12 flex flex-col items-center space-y-4 w-full max-w-[350px]">
            <div ref={googleButtonRef} className="h-[48px] flex items-center justify-center"></div>
             <button
                onClick={() => handleLogin('twitter')}
                className="w-full flex items-center justify-center space-x-3 bg-black text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors"
                >
                <XIcon className="w-5 h-5" />
                <span className="font-semibold">Sign in with X</span>
            </button>
            <button
                onClick={() => handleLogin('github')}
                className="w-full flex items-center justify-center space-x-3 bg-[#333] text-white py-3 px-4 rounded-full hover:bg-[#444] transition-colors"
            >
                <GitHubIcon className="w-5 h-5" />
                <span className="font-semibold">Sign in with GitHub</span>
            </button>
            <button
                onClick={() => handleLogin('spotify')}
                className="w-full flex items-center justify-center space-x-3 bg-[#1DB954] text-white py-3 px-4 rounded-full hover:bg-[#1ed760] transition-colors"
            >
                <SpotifyIcon className="w-5 h-5" />
                <span className="font-semibold">Sign in with Spotify</span>
            </button>
            <p className="text-xs text-gray-500 max-w-xs pt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50 border-y">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold">A smarter way to find information</h2>
            <p className="mt-2 text-gray-600">Silo Search reimagines the search experience from the ground up.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center border">
                <SparklesIcon className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">AI-Powered Summaries</h3>
              <p className="mt-1 text-gray-600 text-sm">No more endless scrolling. Get a concise, easy-to-read summary for any query.</p>
            </div>
            <div className="flex flex-col items-center">
               <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center border">
                <LinkIcon className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Relevant Quick Links</h3>
              <p className="mt-1 text-gray-600 text-sm">Dive deeper with a curated list of the most relevant sources used to generate your summary.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center border">
                <BrushIcon className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="mt-4 font-semibold text-lg">Fully Customizable</h3>
              <p className="mt-1 text-gray-600 text-sm">Make it your own. Personalize your search page with wallpapers, widgets, and custom themes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8">
        <div className="max-w-5xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Silo Search. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};