
import React, { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import type { UserProfile } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CrownIcon } from './icons/CrownIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface PlansPageProps {
  navigate: (path: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
  onActivatePro: () => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ navigate, onActivatePro, ...headerProps }) => {
  const [studentEmail, setStudentEmail] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

  const handleStudentVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationStatus('verifying');

    // Simulate network delay
    setTimeout(() => {
        const email = studentEmail.toLowerCase().trim();
        const validDomains = ['.edu', '.org', '.ac.uk', '.edu.', '.sch.', '.k12.', '.inst.', '.school'];
        
        const isValidStudent = validDomains.some(domain => email.endsWith(domain) || email.includes(domain));

        if (isValidStudent) {
            setVerificationStatus('success');
            setTimeout(() => {
                onActivatePro();
                navigate('/pro-success');
            }, 1500);
        } else {
            setVerificationStatus('error');
        }
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
        <Header {...headerProps} activeTab="plans" onNavigate={navigate} onHome={() => navigate('/search')} showHomeButton={true} />
        
        <main className="flex-grow container mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Choose Your Plan</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">Unlock the full potential of Kyndra AI with unlimited searches and advanced features.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Pro Plan Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-100 to-transparent w-64 h-64 rounded-bl-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-black text-white rounded-2xl">
                                <CrownIcon className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Pro</h2>
                        </div>

                        <div className="mb-8">
                            <span className="text-5xl font-extrabold text-gray-900">$10</span>
                            <span className="text-gray-500 text-lg ml-2">/ month</span>
                        </div>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Unlimited Search & Chat",
                                "Unlimited GitHub Agent usage",
                                "Access to Gemini 3.0 Pro",
                                "Travel Planner & Deep Research",
                                "Early access to AI Labs tools"
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center text-gray-700">
                                    <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                                    <span className="font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <a 
                            href="https://buy.polar.sh/polar_cl_PgUSah1HN8TPbImrWmo79oksFVegpUlMayl0y1Eqbhd" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full py-4 bg-black text-white text-center font-bold rounded-full hover:bg-gray-800 hover:scale-[1.02] transition-all shadow-lg"
                        >
                            Upgrade Now
                        </a>
                        <p className="text-xs text-gray-400 text-center mt-4">Secure payment via Polar.sh</p>
                    </div>
                </div>

                {/* Student Plan Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-lg border border-gray-200 relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-gradient-to-br from-blue-50 to-transparent w-full h-full"></div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                <BookOpenIcon className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Student</h2>
                        </div>

                        <div className="mb-8">
                            <span className="text-5xl font-extrabold text-gray-900">$0</span>
                            <span className="text-gray-500 text-lg ml-2">/ forever</span>
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We believe AI should be accessible to everyone. Students get full <strong>Pro</strong> access for free with a valid school email address.
                        </p>

                        <div className="mt-auto">
                            <form onSubmit={handleStudentVerify} className="space-y-4">
                                <div>
                                    <label htmlFor="student-email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">School Email Address</label>
                                    <input 
                                        id="student-email"
                                        type="email" 
                                        value={studentEmail}
                                        onChange={(e) => { setStudentEmail(e.target.value); setVerificationStatus('idle'); }}
                                        placeholder="you@university.edu" 
                                        className={`w-full px-6 py-4 bg-white border-2 rounded-full outline-none transition-all font-medium ${verificationStatus === 'error' ? 'border-red-300 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-blue-500'}`}
                                        disabled={verificationStatus === 'success'}
                                    />
                                    {verificationStatus === 'error' && (
                                        <p className="text-red-500 text-sm mt-2 ml-2">Please enter a valid .edu or school email address.</p>
                                    )}
                                    {verificationStatus === 'success' && (
                                        <p className="text-green-600 text-sm mt-2 ml-2 font-bold">Success! Upgrading your account...</p>
                                    )}
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={!studentEmail.trim() || verificationStatus === 'verifying' || verificationStatus === 'success'}
                                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {verificationStatus === 'verifying' ? 'Verifying...' : 'Verify & Upgrade'}
                                    {verificationStatus !== 'verifying' && <ArrowRightIcon className="w-5 h-5" />}
                                </button>
                            </form>
                             <p className="text-xs text-gray-400 text-center mt-4">Supports .edu, .org, .ac.uk, and other educational domains.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        
        <Footer onOpenLegalPage={headerProps.onOpenLegalPage} />
    </div>
  );
};
