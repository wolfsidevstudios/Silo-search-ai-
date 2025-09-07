import React, { useEffect, useRef, useState } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { LoginPreview } from './LoginPreview';
import { XIcon } from './icons/XIcon';
import { CloseIcon } from './icons/CloseIcon';

declare global {
  interface Window {
    google?: any;
  }
}

interface LoginPageProps {
  onLoginSuccess: (response: { credential?: string }) => void;
  isGsiScriptLoaded: boolean;
}

const XLoginInfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black bg-opacity-60" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100" aria-label="Close">
          <CloseIcon />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Developer Note: Backend Required</h2>
        <p className="mt-4 text-gray-600">
          The "Sign in with X" feature has been added to the UI.
        </p>
        <p className="mt-2 text-gray-600">
          However, a full, secure implementation of X (Twitter) login requires a backend server. This is necessary to safely store and use the <strong>Client Secret</strong> without exposing it in the browser, which would be a major security risk.
        </p>
        <div className="mt-8">
          <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, isGsiScriptLoaded }) => {
  const signInRef = useRef<HTMLDivElement>(null);
  const [isXInfoModalOpen, setXInfoModalOpen] = useState(false);
  
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
    <>
      <XLoginInfoModal isOpen={isXInfoModalOpen} onClose={() => setXInfoModalOpen(false)} />
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

                   <div className="flex items-center w-full max-w-[350px]">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                      onClick={() => setXInfoModalOpen(true)}
                      className="w-full max-w-[350px] flex items-center justify-center space-x-3 bg-black text-white py-3 px-4 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <XIcon className="w-5 h-5" />
                      <span className="font-semibold">Sign in with X</span>
                    </button>
  
                   <p className="text-xs text-gray-500 max-w-xs pt-4">
                      By signing in, you agree to our Terms of Service and Privacy Policy.
                   </p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};