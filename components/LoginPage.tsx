
import React, { useEffect, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface LoginPageProps {
  onGoogleSignIn: (response: any) => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGoogleSignIn, onOpenLegalPage, onBackToLanding }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Side - Visual (Desktop only) */}
      <div className="hidden md:flex w-1/2 bg-black relative overflow-hidden flex-col justify-between p-12 text-white">
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10">
           <div className="flex items-center space-x-2 mb-8">
                <div className="bg-white p-1.5 rounded-lg text-black">
                    <LogoIcon className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight">Kyndra AI</span>
           </div>
           <h1 className="text-5xl font-bold leading-tight max-w-md">
              Your intelligent gateway to the web.
           </h1>
        </div>

        <div className="relative z-10">
            <p className="text-white/60 text-sm">© {new Date().getFullYear()} Kyndra AI. Private by design.</p>
        </div>
      </div>

      {/* Right Side - Interaction */}
      <div className="w-full md:w-1/2 bg-white flex flex-col relative">
        <div className="absolute top-6 left-6">
            <button 
                onClick={onBackToLanding} 
                className="flex items-center space-x-2 text-gray-500 hover:text-black transition-colors px-3 py-2 rounded-full hover:bg-gray-100"
            >
                <ArrowLeftIcon />
                <span className="text-sm font-medium">Back</span>
            </button>
        </div>

        <div className="flex-grow flex items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-8 text-center">
                <div className="md:hidden flex justify-center mb-6">
                    <div className="bg-black p-3 rounded-2xl text-white">
                         <LogoIcon className="w-10 h-10" />
                    </div>
                </div>
                
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
                    <p className="mt-2 text-gray-500">Log in to access your workspace.</p>
                </div>

                <div className="space-y-4 pt-4">
                    <div className="flex justify-center">
                         <div ref={googleButtonRef}></div>
                    </div>
                </div>
                
                 <p className="text-xs text-gray-400 px-8 pt-8">
                    By continuing, you agree to our{' '}
                    <button onClick={() => onOpenLegalPage('terms')} className="hover:text-gray-600 hover:underline transition-colors">Terms of Service</button>
                    {' '}and{' '}
                    <button onClick={() => onOpenLegalPage('privacy')} className="hover:text-gray-600 hover:underline transition-colors">Privacy Policy</button>.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
