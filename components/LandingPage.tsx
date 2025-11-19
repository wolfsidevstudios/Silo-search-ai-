import React from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { PlaneIcon } from './icons/PlaneIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { LockIcon } from './icons/LockIcon';
import { KeyIcon } from './icons/KeyIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CheckIcon } from './icons/CheckIcon';
import { StarIcon } from './icons/StarIcon';
import { OpenAIIcon } from './icons/OpenAIIcon';
import { AnthropicIcon } from './icons/AnthropicIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { BrowserIcon } from './icons/BrowserIcon';
import { ChipIcon } from './icons/ChipIcon';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
  <div className="group p-8 bg-white/50 backdrop-blur-sm border border-gray-100 rounded-3xl hover:shadow-xl hover:bg-white transition-all duration-300">
    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
  </div>
);

const testimonials = [
    {
        text: "Kyndra AI has completely transformed my research workflow. The summaries are incredibly accurate.",
        author: "Sarah Jenkins",
        role: "Product Designer"
    },
    {
        text: "Finally, a search tool that respects my privacy and gives me control over my API usage.",
        author: "David Chen",
        role: "Software Engineer"
    },
    {
        text: "The new Gemini 3.0 integration is mind-blowing. It's faster and smarter than anything else.",
        author: "Elena Rodriguez",
        role: "Content Creator"
    }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onOpenLegalPage }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-black selection:text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <LogoIcon className="w-8 h-8" />
                <span className="text-xl font-bold tracking-tight">Kyndra AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
                <a href="#features" className="hover:text-black transition-colors">Features</a>
                <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
                <a href="#testimonials" className="hover:text-black transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={onNavigateToLogin} className="text-sm font-medium hover:text-gray-600 transition-colors hidden sm:block">Sign In</button>
                <button onClick={onNavigateToLogin} className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all hover:scale-105">Get Started</button>
            </div>
        </div>
      </header>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="px-6 lg:px-8 pb-24 pt-16 text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm animate-fade-in-up">
                <SparklesIcon className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">New: Gemini 3.0 Integration</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
                Search intelligently.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">Summarize instantly.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                Experience the next generation of search. Powered by Gemini 3.0, Kyndra AI delivers precise summaries, deep insights, and actionable answers—without the noise.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={onNavigateToLogin} className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
                    Start Searching Free
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all">
                    View Demo
                </button>
            </div>
            
            <div className="mt-20 relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 aspect-[16/9] bg-gray-900">
                 {/* Placeholder for App Screenshot/Demo */}
                 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                    <div className="text-center">
                        <LogoIcon className="w-24 h-24 mx-auto text-white/20 mb-4" />
                        <p className="text-white/40 font-medium">App Interface Preview</p>
                    </div>
                 </div>
            </div>
        </section>

        {/* Partners / Models */}
        <section className="py-12 border-y border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Powered by World-Class AI</p>
                <div className="flex justify-center items-center flex-wrap gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="flex items-center gap-2 font-bold text-xl"><LogoIcon className="w-8 h-8"/> Google Gemini</span>
                    <span className="flex items-center gap-2 font-bold text-xl"><OpenAIIcon className="w-8 h-8"/> OpenAI</span>
                    <span className="flex items-center gap-2 font-bold text-xl"><AnthropicIcon className="w-8 h-8"/> Anthropic</span>
                </div>
            </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 px-6 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need to know,<br/>without the fluff.</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Designed for clarity, privacy, and speed. Kyndra AI puts you in control of your search experience.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard icon={SparklesIcon} title="Smart Summaries" description="Get concise, accurate answers synthesized from multiple trusted sources instantly." />
                    <FeatureCard icon={LinkIcon} title="Quick Links" description="Direct access to the most relevant websites and citations used in your summary." />
                    <FeatureCard icon={MessageSquareIcon} title="Follow-up Chat" description="Dive deeper into any topic with a conversational interface that remembers context." />
                    <FeatureCard icon={PlaneIcon} title="Travel Planner" description="Generate complete itineraries with flights, hotels, and local tips in seconds." />
                    <FeatureCard icon={ShoppingCartIcon} title="Shopping Agent" description="Find the best products with AI-driven recommendations, comparisons, and price checks." />
                    <FeatureCard icon={LockIcon} title="Private by Design" description="Your data and API keys live on your device. We never store your search history." />
                    <FeatureCard icon={KeyIcon} title="Bring Your Own Key" description="Connect your personal API keys for complete control over usage and models." />
                    <FeatureCard icon={BrowserIcon} title="Web Agent" description="An intelligent agent that can browse and interact with websites for you." />
                    <FeatureCard icon={GitHubIcon} title="GitHub Integration" description="Search repositories, explain code, and review PRs directly from the interface." />
                </div>
            </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-32 px-6 bg-white">
             <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, transparent pricing.</h2>
                    <p className="text-gray-500">Start for free. Upgrade for power.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="p-8 rounded-3xl border border-gray-200 bg-[#FAFAFA] flex flex-col">
                        <h3 className="text-2xl font-bold mb-2">Free</h3>
                        <p className="text-gray-500 mb-6">Essential AI search for everyone.</p>
                        <div className="text-4xl font-bold mb-8">$0 <span className="text-lg font-normal text-gray-500">/mo</span></div>
                        
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-gray-700"><CheckIcon className="w-5 h-5 text-black" /> Unlimited standard searches</li>
                            <li className="flex items-center gap-3 text-sm text-gray-700"><CheckIcon className="w-5 h-5 text-black" /> Gemini 2.5 Flash access</li>
                            <li className="flex items-center gap-3 text-sm text-gray-700"><CheckIcon className="w-5 h-5 text-black" /> Travel & Shopping modes</li>
                            <li className="flex items-center gap-3 text-sm text-gray-700"><CheckIcon className="w-5 h-5 text-black" /> Local history storage</li>
                        </ul>
                        
                        <button onClick={onNavigateToLogin} className="w-full py-4 rounded-full border border-gray-300 font-semibold hover:bg-gray-100 transition-colors">
                            Get Started
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-3xl bg-black text-white flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-600 to-transparent w-32 h-32 opacity-20 rounded-bl-full"></div>
                        <h3 className="text-2xl font-bold mb-2">Pro</h3>
                        <p className="text-gray-400 mb-6">Power features for power users.</p>
                        <div className="text-4xl font-bold mb-8">Coming Soon</div>
                        
                        <ul className="space-y-4 mb-8 flex-grow">
                             <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon className="w-5 h-5 text-white" /> <strong>Gemini 3.0</strong> priority access</li>
                             <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon className="w-5 h-5 text-white" /> Advanced Cloud Sync</li>
                             <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon className="w-5 h-5 text-white" /> Custom AI Agents</li>
                             <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon className="w-5 h-5 text-white" /> Early access to new features</li>
                        </ul>
                        
                        <button disabled className="w-full py-4 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors cursor-not-allowed opacity-80">
                            Join Waitlist
                        </button>
                    </div>
                </div>
             </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-32 px-6 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, j) => <StarIcon key={j} className="w-4 h-4 text-yellow-400 fill-current" />)}
                            </div>
                            <p className="text-gray-700 mb-6 leading-relaxed">"{t.text}"</p>
                            <div>
                                <div className="font-bold text-gray-900">{t.author}</div>
                                <div className="text-sm text-gray-500">{t.role}</div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
             <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <LogoIcon className="w-8 h-8" />
                        <span className="text-xl font-bold">Kyndra AI</span>
                    </div>
                    <div className="flex space-x-8 text-sm text-gray-500">
                        <a href="#" className="hover:text-black">Twitter</a>
                        <a href="#" className="hover:text-black">GitHub</a>
                        <a href="#" className="hover:text-black">Discord</a>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 pt-8 border-t border-gray-100">
                    <p>&copy; {new Date().getFullYear()} Kyndra AI. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <button onClick={() => onOpenLegalPage('privacy')} className="hover:text-black">Privacy Policy</button>
                        <button onClick={() => onOpenLegalPage('terms')} className="hover:text-black">Terms of Service</button>
                    </div>
                </div>
             </div>
        </footer>
      </main>
    </div>
  );
};