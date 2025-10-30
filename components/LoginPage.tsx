import React, { useEffect, useRef, useState } from 'react';
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

const handleSocialLogin = async (provider: 'github' | 'twitter' | 'spotify') => {
  const { error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) {
    console.error(`Error logging in with ${provider}:`, error.message);
  }
};

export const LoginPage: React.FC<LoginPageProps> = ({ onGoogleSignIn, onOpenLegalPage, onBackToLanding }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: '127898517822-hnff3rqt1kqk9u6uvivpec5p01m1f0bj.apps.googleusercontent.com',
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
  
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
    } else { // signup
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            setError(error.message);
        } else {
            setMessage('Check your email for a confirmation link to complete your registration.');
        }
    }
    setIsLoading(false);
  };


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
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h2>
             <p className="mt-2 text-center text-gray-500">
                {mode === 'signin' 
                    ? 'Sign in to access your personalized dashboard.'
                    : 'Sign up to unlock a smarter search experience.'
                }
            </p>

            <div className="mt-8">
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email" name="email" type="email" autoComplete="email" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password" name="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Password"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300"
                        >
                            {isLoading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                        </button>
                    </div>
                </form>

                {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
                {message && <p className="mt-2 text-center text-sm text-green-600">{message}</p>}

                 <p className="mt-4 text-center text-sm text-gray-600">
                    {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
                    <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null); }} className="font-medium text-purple-600 hover:text-purple-500">
                        {mode === 'signin' ? 'Sign up' : 'Sign in'}
                    </button>
                </p>

                <div className="mt-6 relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                    <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                </div>

                <div ref={googleButtonRef} className="flex justify-center mt-4"></div>

                <div className="mt-4 flex justify-center space-x-4">
                    <button onClick={() => handleSocialLogin('twitter')} className="p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition" aria-label="Sign in with X"><XIcon className="w-5 h-5 text-gray-700" /></button>
                    <button onClick={() => handleSocialLogin('github')} className="p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition" aria-label="Sign in with GitHub"><GitHubIcon className="w-5 h-5 text-gray-700" /></button>
                    <button onClick={() => handleSocialLogin('spotify')} className="p-3 bg-white border rounded-full hover:bg-gray-100 shadow-sm transition" aria-label="Sign in with Spotify"><SpotifyIcon className="w-5 h-5 text-gray-700" /></button>
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