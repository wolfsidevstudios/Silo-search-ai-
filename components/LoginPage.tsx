import React, { useEffect, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { XIcon } from './icons/XIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { supabase } from '../utils/supabase';
import { SpotifyIcon } from './icons/SpotifyIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface LoginPageProps {
  onGoogleSignIn: (response: any) => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
  onBackToLanding: () => void;
}

const handleLogin = async (provider: 'github' | 'twitter' | 'spotify') => {
  const { error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) {
    console.error(`Error logging in with ${provider}:`, error.message);
  }
};

export const LoginPage: React.FC<LoginPageProps> = ({ onGoogleSignIn, onOpenLegalPage, onBackToLanding }) => {
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
    <div className="min-h-screen flex font-sans">
      {/* Left Pane */}
      <div className="hidden lg:flex w-1/2 login-left-pane flex-col items-center justify-center p-12 text-white relative">
        <button onClick={onBackToLanding} className="absolute top-8 left-8 flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeftIcon />
            <span>Back to Home</span>
        </button>
        <div className="text-center">
            <LogoIcon className="w-20 h-20 mx-auto bg-white/20 p-2"/>
            <h1 className="text-4xl font-bold mt-6">Silo Search</h1>
            <p className="mt-4 text-xl text-white/80">Search, Summarized. Instantly.</p>
        </div>
      </div>

      {/* Right Pane */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm mx-auto">
            <div className="lg:hidden mb-8 text-center">
                <LogoIcon className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center">Create your account</h2>
            <p className="mt-2 text-center text-gray-500">
                Sign in to unlock a smarter search experience.
            </p>

            <div className="mt-8">
                <div ref={googleButtonRef} className="flex justify-center"></div>
                
                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or sign in with</span></div>
                </div>

                <div className="mt-4 flex justify-center space-x-4">
                    <button onClick={() => handleLogin('twitter')} className="p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition" aria-label="Sign in with X"><XIcon className="w-5 h-5 text-gray-700" /></button>
                    <button onClick={() => handleLogin('github')} className="p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition" aria-label="Sign in with GitHub"><GitHubIcon className="w-5 h-5 text-gray-700" /></button>
                    <button onClick={() => handleLogin('spotify')} className="p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition" aria-label="Sign in with Spotify"><SpotifyIcon className="w-5 h-5 text-gray-700" /></button>
                </div>

                <p className="mt-8 text-xs text-gray-500 text-center">
                    By continuing, you agree to our{' '}
                    <button onClick={() => onOpenLegalPage('terms')} className="font-medium text-purple-600 hover:underline">Terms of Service</button>
                    {' '}and{' '}
                    <button onClick={() => onOpenLegalPage('privacy')} className="font-medium text-purple-600 hover:underline">Privacy Policy</button>.
                </p>
            </div>
            <div className="lg:hidden mt-8 text-center">
                <button onClick={onBackToLanding} className="text-sm text-gray-600 hover:text-black">
                    &larr; Back to Home
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};