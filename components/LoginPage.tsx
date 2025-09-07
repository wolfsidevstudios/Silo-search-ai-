import React, { useEffect, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { LoginPreview } from './LoginPreview';
import { XIcon } from './icons/XIcon';

declare global {
  interface Window {
    google?: any;
  }
}

interface LoginPageProps {
  onLoginSuccess: (response: { credential?: string }) => void;
  isGsiScriptLoaded: boolean;
}

// --- PKCE Helper Functions for X Login ---

// Generates a random string for the code verifier
const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234GvWTsPF1-._~';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Hashes the verifier using SHA-256
const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

// Base64 URL encodes the hashed verifier
const base64urlencode = (a: ArrayBuffer): string => {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(a))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};


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

  const handleXLogin = async () => {
    const codeVerifier = generateRandomString(128);
    sessionStorage.setItem('x_code_verifier', codeVerifier);
    
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64urlencode(hashed);
  
    const clientId = 'YlVKNkxzUnZuTDZIaG5VODloRi06MTpjaQ';
    const redirectUri = 'https://silosearchai.netlify.app/';
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'users.read tweet.read offline.access',
      state: 'state', // In a production app, use a unique, unpredictable string
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
  
    window.location.href = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  };

  return (
    <>
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
                      onClick={handleXLogin}
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