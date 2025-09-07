
import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LogoIcon } from './icons/LogoIcon';

interface AboutPageProps {
  onClose: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm p-4 border-b flex items-center z-10">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100" aria-label="Go back">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4">About Silo Search</h1>
      </header>
      <main className="flex-grow p-6 md:p-8">
        <div className="max-w-3xl mx-auto text-center">
            <LogoIcon className="w-24 h-24 mx-auto mb-4" />
            <p className="text-lg text-gray-600">Version 1.3.0</p>
        </div>
        <div className="max-w-3xl mx-auto mt-8 prose prose-sm text-gray-700">
             <h4>Our Mission</h4>
             <p>Silo Search is an intelligent search application designed to provide quick, concise, and accurate summaries for your queries, powered by leading AI models. Our mission is to streamline your access to information, cutting through the noise to deliver what you need, when you need it.</p>
             
             <h4>Our Philosophy</h4>
             <p>We believe in creating a personal, customizable, and private search experience. The "bring-your-own-key" model is central to this philosophy, as it gives you, the user, complete control over your data and API usage. We handle the interface, you handle the power.</p>

             <h4>Support & Contact</h4>
             <p>Have questions, feedback, or need support? We'd love to hear from you. Please reach out to the appropriate email below:</p>
             <ul>
                <li><strong>For customer support and help:</strong> <a href="mailto:wolfsisupport@gmail.com">wolfsisupport@gmail.com</a></li>
                <li><strong>For development or business inquiries:</strong> <a href="mailto:emartinezra2121@gmail.com">emartinezra2121@gmail.com</a> or <a href="mailto:survivalcreativeminecraftadven@gmail.com">survivalcreativeminecraftadven@gmail.com</a></li>
             </ul>
             
             <div className="pt-4 mt-8 border-t text-center text-xs text-gray-400">
                <p>Made with ❤️ by Wolfsi Development Studios</p>
             </div>
        </div>
      </main>
    </div>
  );
};
