
import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface PrivacyPageProps {
  onClose: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center z-20">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600" aria-label="Go back">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-lg font-bold text-gray-900 ml-4 tracking-tight">Privacy Policy</h1>
      </header>

      <main className="flex-grow p-6 md:p-12">
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="prose prose-gray max-w-none">
                <p className="text-sm text-gray-400 font-medium mb-8 uppercase tracking-wider">Last updated: August 5, 2024</p>
                
                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">Introduction</h4>
                <p className="text-gray-600 leading-relaxed">Your privacy is important to us at Wolfsi Development Studios ("we", "us", "our"). This Privacy Policy explains how we handle your information when you use our application, Kyndra AI (the "Service"). Our core privacy principle is simple: your data is yours. We are committed to building a product that is private by design.</p>
                
                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">Information We Collect</h4>
                <p className="text-gray-600 leading-relaxed">Kyndra AI is designed to minimize data collection. The information we handle can be broken down into two categories:</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600 mt-4">
                    <li><strong>Locally Stored Data:</strong> All of your personal settings, search history, customization choices, and API keys are stored exclusively in your browser's local storage on your device. This data is never transmitted to, stored on, or accessed by our servers. It remains on your machine for the sole purpose of personalizing your experience.</li>
                    <li><strong>Anonymous Usage Data (Analytics):</strong> If you choose to opt-in, we may collect anonymous, aggregated usage data to help us understand how our Service is being used and how we can improve it. This data may include information like feature usage frequency, session duration, and general UI interactions. This information is completely anonymous and cannot be used to identify you personally. You can disable this in the "Usage & Analytics" section of the settings at any time.</li>
                </ol>
                
                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">How We Use Your Information</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li><strong>To Provide and Personalize the Service:</strong> Your locally stored data is used directly by the application on your device to remember your preferences, display your recent searches, and maintain your settings between sessions.</li>
                    <li><strong>To Improve Our Service:</strong> The anonymous analytics data helps us identify popular features, diagnose problems, and enhance the overall user experience.</li>
                </ul>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">Third-Party Services</h4>
                <p className="text-gray-600 leading-relaxed">Kyndra AI functions by connecting to third-party AI providers (like Google Gemini) using an API key that you provide. When you perform a search, your query is sent to the respective third-party service. Your interactions with these services are governed by their own privacy policies and terms of service, which we strongly encourage you to review.</p>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">Data Security</h4>
                <p className="text-gray-600 leading-relaxed">Because your sensitive data (like API keys) is stored locally on your device, its security is intrinsically linked to the security of your device and browser. We do not implement additional encryption on locally stored data, so we recommend you take appropriate measures to secure your device.</p>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">Your Data Rights</h4>
                <p className="text-gray-600 leading-relaxed">You have complete control over your data. At any time, you can use the features within the "Import / Export" and "Delete Data" sections of the settings to:</p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 mt-2">
                    <li>Export a complete copy of your application data.</li>
                    <li>Permanently delete all of your application data from your browser's local storage.</li>
                </ul>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">Children's Privacy</h4>
                <p className="text-gray-600 leading-relaxed">Our Service is not intended for use by children under the age of 13. We do not knowingly collect any personally identifiable information from children under 13.</p>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">Changes to This Privacy Policy</h4>
                <p className="text-gray-600 leading-relaxed">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

                <h4 className="text-gray-900 font-bold text-lg mt-8 mb-4">Contact Us</h4>
                <p className="text-gray-600 leading-relaxed">If you have any questions about this Privacy Policy, please contact us at:</p>
                <ul className="list-none space-y-2 mt-2 text-gray-600">
                    <li><span className="font-semibold text-gray-900">Customer Support:</span> <a href="mailto:wolfsisupport@gmail.com" className="text-black underline decoration-gray-300 hover:decoration-black">wolfsisupport@gmail.com</a></li>
                    <li><span className="font-semibold text-gray-900">General Inquiries:</span> <a href="mailto:emartinezra2121@gmail.com" className="text-black underline decoration-gray-300 hover:decoration-black">emartinezra2121@gmail.com</a></li>
                </ul>
            </div>
        </div>
      </main>
    </div>
  );
};
