
import React, { useEffect, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { LoginPreview } from './LoginPreview';

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
              <p className="mt-2 text-gray-600">Sign in with your Google account to continue.</p>
    
              <div className="mt-12 flex flex-col items-center space-y-4">
                 <div ref={signInRef} id="signInButton-loginPage" />
                 <p className="text-xs text-gray-500 max-w-xs">
                    By signing in, you agree to our Terms of Service and Privacy Policy. 
                    Your account will be created automatically on your first sign-in.
                 </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
