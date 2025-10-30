
import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface PrivacyPageProps {
  onClose: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm p-4 border-b flex items-center z-10">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Go back">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4">Privacy Policy</h1>
      </header>
      <main className="flex-grow p-6 md:p-8">
        <div className="max-w-3xl mx-auto prose prose-sm text-gray-700">
            <p className="text-sm text-gray-500">Last updated: August 5, 2024</p>
            
            <h4>Introduction</h4>
            <p>Your privacy is important to us at Wolfsi Development Studios ("we", "us", "our"). This Privacy Policy explains how we handle your information when you use our application, Kyndra AI (the "Service"). Our core privacy principle is simple: your data is yours. We are committed to building a product that is private by design.</p>
            
            <h4>Information We Collect</h4>
            <p>Kyndra AI is designed to minimize data collection. The information we handle can be broken down into two categories:</p>
            <ol>
                <li><strong>Locally Stored Data:</strong> All of your personal settings, search history, customization choices, and API keys are stored exclusively in your browser's local storage on your device. This data is never transmitted to, stored on, or accessed by our servers. It remains on your machine for the sole purpose of personalizing your experience.</li>
                <li><strong>Anonymous Usage Data (Analytics):</strong> If you choose to opt-in, we may collect anonymous, aggregated usage data to help us understand how our Service is being used and how we can improve it. This data may include information like feature usage frequency, session duration, and general UI interactions. This information is completely anonymous and cannot be used to identify you personally. You can disable this in the "Usage & Analytics" section of the settings at any time.</li>
            </ol>
            
            <h4>How We Use Your Information</h4>
            <ul>
                <li><strong>To Provide and Personalize the Service:</strong> Your locally stored data is used directly by the application on your device to remember your preferences, display your recent searches, and maintain your settings between sessions.</li>
                <li><strong>To Improve Our Service:</strong> The anonymous analytics data helps us identify popular features, diagnose problems, and enhance the overall user experience.</li>
            </ul>

            <h4>Third-Party Services</h4>
            <p>Kyndra AI functions by connecting to third-party AI providers (like Google Gemini) using an API key that you provide. When you perform a search, your query is sent to the respective third-party service. Your interactions with these services are governed by their own privacy policies and terms of service, which we strongly encourage you to review.</p>

            <h4>Data Security</h4>
            <p>Because your sensitive data (like API keys) is stored locally on your device, its security is intrinsically linked to the security of your device and browser. We do not implement additional encryption on locally stored data, so we recommend you take appropriate measures to secure your device.</p>

            <h4>Your Data Rights</h4>
            <p>You have complete control over your data. At any time, you can use the features within the "Import / Export" and "Delete Data" sections of the settings to:</p>
            <ul>
                <li>Export a complete copy of your application data.</li>
                <li>Permanently delete all of your application data from your browser's local storage.</li>
            </ul>

            <h4>Children's Privacy</h4>
            <p>Our Service is not intended for use by children under the age of 13. We do not knowingly collect any personally identifiable information from children under 13.</p>

            <h4>Changes to This Privacy Policy</h4>
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

            <h4>Contact Us</h4>
            <p>If you have any questions about this Privacy Policy, please contact us at:</p>
            <ul>
                <li><strong>Customer Support:</strong> <a href="mailto:wolfsisupport@gmail.com">wolfsisupport@gmail.com</a></li>
                <li><strong>General Inquiries:</strong> <a href="mailto:emartinezra2121@gmail.com">emartinezra2121@gmail.com</a> or <a href="mailto:survivalcreativeminecraftadven@gmail.com">survivalcreativeminecraftadven@gmail.com</a></li>
            </ul>
        </div>
      </main>
    </div>
  );
};