
import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface TermsPageProps {
  isInitialPrompt: boolean;
  onClose?: () => void;
  onAgree?: () => void;
  onDisagree?: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ isInitialPrompt, onClose, onAgree, onDisagree }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center z-20">
        {!isInitialPrompt && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600" aria-label="Go back">
              <ArrowLeftIcon />
            </button>
        )}
        <h1 className="text-lg font-bold text-gray-900 ml-4 tracking-tight">Terms of Service</h1>
      </header>
      
      <main className="flex-grow p-6 md:p-12">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="prose prose-gray max-w-none">
                <p className="text-sm text-gray-400 font-medium mb-8 uppercase tracking-wider">Last updated: August 5, 2024</p>
                
                <p className="lead text-xl text-gray-600 mb-8">Welcome to Kyndra AI ("the Service"), provided by Wolfsi Development Studios. By accessing or using our application, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.</p>
                
                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">1. License to Use</h4>
                <p className="text-gray-600 leading-relaxed">We grant you a limited, non-exclusive, non-transferable, revocable license to use Kyndra AI for your personal, non-commercial purposes, subject to these Terms.</p>
                
                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">2. User Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li><strong>API Keys:</strong> To use the core functionality of the Service, you must provide your own API key from a supported third-party AI provider (e.g., Google). You are solely responsible for obtaining this key and for all charges, usage limits, and compliance with the terms of service of that third-party provider.</li>
                    <li><strong>Acceptable Use:</strong> You agree not to use the Service for any unlawful purpose or to conduct any activity that would violate the rights of others. You are responsible for the content of your search queries.</li>
                </ul>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">3. Third-Party Services</h4>
                <p className="text-gray-600 leading-relaxed">The Service relies on third-party services for its AI-powered search capabilities. We do not control and are not responsible for the availability, accuracy, content, or policies of these third-party services. The information provided by the AI is for informational purposes only and should not be considered professional advice.</p>
                
                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">4. Intellectual Property</h4>
                <p className="text-gray-600 leading-relaxed">The Service and its original content, features, and functionality are and will remain the exclusive property of Wolfsi Development Studios. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">5. Disclaimer of Warranties</h4>
                <p className="text-gray-600 leading-relaxed">The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, regarding the operation or availability of the Service, or the accuracy, reliability, or completeness of any information provided through the Service. Your use of the Service is at your sole risk.</p>
                
                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">6. Limitation of Liability</h4>
                <p className="text-gray-600 leading-relaxed">In no event shall Wolfsi Development Studios, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">7. Termination</h4>
                <p className="text-gray-600 leading-relaxed">We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">8. Changes to Terms</h4>
                <p className="text-gray-600 leading-relaxed">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">9. Contact Us</h4>
                <p className="text-gray-600 leading-relaxed">If you have any questions about these Terms, please contact us at <a href="mailto:wolfsisupport@gmail.com" className="text-black underline decoration-gray-300 hover:decoration-black transition-all">wolfsisupport@gmail.com</a>.</p>
            </div>
        </div>
      </main>
      
      {isInitialPrompt && (
        <footer className="sticky bottom-0 bg-white/90 backdrop-blur-xl p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500">Please review and agree to continue.</p>
            <div className="flex gap-4 w-full sm:w-auto">
                <button onClick={onDisagree} className="flex-1 sm:flex-none px-8 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    Disagree
                </button>
                <button onClick={onAgree} className="flex-1 sm:flex-none px-8 py-3 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Agree & Continue
                </button>
            </div>
        </footer>
      )}
    </div>
  );
};
