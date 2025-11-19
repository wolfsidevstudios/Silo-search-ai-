
import React from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LogoIcon } from './icons/LogoIcon';

interface AboutPageProps {
  onClose: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAFA]">
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center z-20">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600" aria-label="Go back">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-lg font-bold text-gray-900 ml-4 tracking-tight">About Kyndra AI</h1>
      </header>

      <main className="flex-grow p-6 md:p-12 flex flex-col items-center">
        <div className="max-w-3xl w-full space-y-8">
            {/* Hero Card */}
            <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-black rounded-3xl flex items-center justify-center shadow-lg">
                    <LogoIcon className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Kyndra AI</h1>
                <p className="text-gray-500 font-medium mb-8">Version 2.5.0</p>
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl mx-auto">
                    Your intelligent gateway to the web. Designed to streamline your digital life with privacy, speed, and precision.
                </p>
            </div>

            {/* Mission & Philosophy */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
                     <h4 className="text-lg font-bold text-gray-900 mb-4">Our Mission</h4>
                     <p className="text-gray-600 leading-relaxed">
                        Kyndra AI is built to provide quick, concise, and accurate summaries for your queries. We cut through the noise to deliver exactly what you need, when you need it, powered by the world's best AI models.
                     </p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
                     <h4 className="text-lg font-bold text-gray-900 mb-4">Our Philosophy</h4>
                     <p className="text-gray-600 leading-relaxed">
                        We believe in a personal, customizable, and private search experience. The "bring-your-own-key" model gives you complete control over your data and API usage. We handle the interface; you hold the power.
                     </p>
                </div>
            </div>

            {/* Contact Section */}
             <div className="bg-white p-8 rounded-[2rem] border border-gray-100">
                 <h4 className="text-lg font-bold text-gray-900 mb-6">Support & Contact</h4>
                 <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <p className="font-semibold text-gray-900">Customer Support</p>
                            <p className="text-sm text-gray-500">For help with the app and features</p>
                        </div>
                        <a href="mailto:wolfsisupport@gmail.com" className="text-sm font-medium bg-white px-4 py-2 rounded-full border border-gray-200 hover:border-black transition-colors text-center">
                            wolfsisupport@gmail.com
                        </a>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <p className="font-semibold text-gray-900">Business Inquiries</p>
                            <p className="text-sm text-gray-500">For development and partnerships</p>
                        </div>
                        <a href="mailto:emartinezra2121@gmail.com" className="text-sm font-medium bg-white px-4 py-2 rounded-full border border-gray-200 hover:border-black transition-colors text-center">
                            emartinezra2121@gmail.com
                        </a>
                    </div>
                 </div>
             </div>
             
             <div className="text-center pt-4 pb-8">
                <p className="text-sm text-gray-400 font-medium">Made with ❤️ by Wolfsi Development Studios</p>
             </div>
        </div>
      </main>
    </div>
  );
};
