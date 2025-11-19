
import React, { useEffect, useRef, useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { XIcon } from './icons/XIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { supabase } from '../utils/supabase';
import { SpotifyIcon } from './icons/SpotifyIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { GoogleIcon } from './icons/GoogleIcon';

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
    <div className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden bg-[#FDFBF7]">
       {/* Background Ambience */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
        </div>

      <button 
        onClick={onBackToLanding} 
        className="absolute top-8 left-8 flex items-center space-x-2 text-gray-500 hover:text-black transition-colors z-10 px-4 py-2 rounded-full hover:bg-white/50 backdrop-blur-sm border border-transparent hover:border-gray-200"
      >
          <ArrowLeftIcon />
          <span className="text-sm font-medium">Back to Home</span>
      </button>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 p-8 md:p-10">
            <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
                    <LogoIcon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {mode === 'signin' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="mt-2 text-gray-500">
                    {mode === 'signin' 
                        ? 'Enter your details to access your workspace.'
                        : 'Start your intelligent search journey today.'
                    }
                </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-5">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email" name="email" type="email" autoComplete="email" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="block w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password" name="password" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                >
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        mode === 'signin' ? 'Sign In' : 'Create Account'
                    )}
                </button>
            </form>

            {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 text-center">
                    {error}
                </div>
            )}
            {message && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-600 text-center">
                    {message}
                </div>
            )}

            <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="px-3 bg-white text-gray-400 font-medium">Or continue with</span></div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
                 <button onClick={() => handleSocialLogin('github')} className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all" aria-label="Sign in with GitHub">
                    <GitHubIcon className="w-5 h-5 text-gray-900" />
                 </button>
                 <button onClick={() => handleSocialLogin('twitter')} className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all" aria-label="Sign in with X">
                    <XIcon className="w-5 h-5 text-gray-900" />
                 </button>
                 <button onClick={() => handleSocialLogin('spotify')} className="flex items-center justify-center p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all" aria-label="Sign in with Spotify">
                    <SpotifyIcon className="w-5 h-5 text-green-500" />
                 </button>
            </div>
            
             <div className="mt-4" ref={googleButtonRef}></div>

            <p className="mt-8 text-center text-sm text-gray-600">
                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null); }} className="font-bold text-black hover:underline">
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
            </p>
        </div>
        
         <p className="mt-8 text-xs text-gray-400 text-center">
            By continuing, you agree to our{' '}
            <button onClick={() => onOpenLegalPage('terms')} className="hover:text-gray-600 hover:underline transition-colors">Terms of Service</button>
            {' '}and{' '}
            <button onClick={() => onOpenLegalPage('privacy')} className="hover:text-gray-600 hover:underline transition-colors">Privacy Policy</button>.
        </p>
      </div>
    </div>
  );
};
