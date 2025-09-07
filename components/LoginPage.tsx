import React, { useEffect, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { LoginPreview } from './LoginPreview';
import { XIcon } from './icons/XIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { supabase } from '../utils/supabase';

interface LoginPageProps {
  onGoogleSignIn: (response: any) => void;
}

const handleLogin = async (provider: 'github' | 'twitter') => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
  });
  if (error) {
    console.error(`Error logging in with ${provider}:`, error.message);
  }
};

export const LoginPage: React.FC<LoginPageProps> = ({ onGoogleSignIn }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.google && googleButtonRef.current) {
      try {
        window.google.accounts.id.initialize({
          // IMPORTANT: Replace with your actual Google Client ID
          client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
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
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Left side: App Preview */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gray-50 relative overflow-hidden">
        <LoginPreview />
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col p-8">
        <div className="flex items-center space-x-3">
          <LogoIcon className="w-12 h-12" />
          <span className="text-3xl font-bold text-gray-800">Silo Search</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
              <p className="mt-2 text-gray-600">Sign in to unlock the full experience.</p>
    
              <div className="mt-12 flex flex-col items-center space-y-4">
                 <div ref={googleButtonRef} className="w-full max-w-[350px] h-[48px] flex items-center justify-center"></div>

                  <button
                    onClick={() => handleLogin('twitter')}
                    className="w-full max-w-[350px] flex items-center justify-center space-x-3 bg-black text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                    <span className="font-semibold">Sign in with X</span>
                  </button>
                  <button
                    onClick={() => handleLogin('github')}
                    className="w-full max-w-[350px] flex items-center justify-center space-x-3 bg-[#333] text-white py-3 px-4 rounded-full hover:bg-[#444] transition-colors"
                  >
                    <GitHubIcon className="w-5 h-5" />
                    <span className="font-semibold">Sign in with GitHub</span>
                  </button>
                  
                 <p className="text-xs text-gray-500 max-w-xs pt-4">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                 </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};