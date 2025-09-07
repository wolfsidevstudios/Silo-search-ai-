import React, { useEffect, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { LoginPreview } from './LoginPreview';
import { SpotifyIcon } from './icons/SpotifyIcon';

declare global {
  interface Window {
    google?: any;
  }
}

interface LoginPageProps {
  onLoginSuccess: (response: { credential?: string }) => void;
  isGsiScriptLoaded: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, isGsiScriptLoaded }) => {
  const signInRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentSignInRef = signInRef.current;
    
    if (isGsiScriptLoaded && window.google && currentSignInRef) {
      if (currentSignInRef.childElementCount === 0) {
        window.google.accounts.id.renderButton(
            currentSignInRef,
            { theme: 'outline', size: 'large', type: 'standard', shape: 'pill', text: 'signin_with', width: 350 }
        );
        window.google.accounts.id.prompt(); 
      }
    }
    
    return () => {
        if (currentSignInRef && currentSignInRef.innerHTML) {
            currentSignInRef.innerHTML = '';
        }
    };
  }, [isGsiScriptLoaded]);

  const handleSpotifyLogin = () => {
    const CLIENT_ID = '98c65aa1f5504956900a1358acf057c7';
    const REDIRECT_URI = window.location.origin;
    const SCOPES = 'user-read-private user-read-email';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
  };

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
                 <div ref={signInRef} id="signInButton-loginPage" />
                 
                 <div className="relative my-2 w-full max-w-xs">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white px-2 text-sm text-gray-500">OR</span>
                    </div>
                </div>

                <button
                    onClick={handleSpotifyLogin}
                    className="flex items-center justify-center w-full max-w-[350px] bg-[#1DB954] text-white rounded-full px-4 py-2.5 font-semibold hover:bg-[#1ED760] transition-colors"
                >
                    <SpotifyIcon className="w-6 h-6 mr-3" />
                    Sign in with Spotify
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