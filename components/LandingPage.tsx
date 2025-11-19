import React, { useEffect, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { PlaneIcon } from './icons/PlaneIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { LockIcon } from './icons/LockIcon';
import { KeyIcon } from './icons/KeyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { StarIcon } from './icons/StarIcon';
import { OpenAIIcon } from './icons/OpenAIIcon';
import { AnthropicIcon } from './icons/AnthropicIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { BrowserIcon } from './icons/BrowserIcon';
import { CodeIcon } from './icons/CodeIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ZapIcon } from './icons/ZapIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
  <div className="group p-8 bg-white backdrop-blur-sm border border-gray-100 rounded-3xl hover:shadow-xl hover:border-purple-100 transition-all duration-300 scroll-animate">
    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-300">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </div>
);

const TestimonialCard: React.FC<{ text: string, author: string, role: string }> = ({ text, author, role }) => (
    <div className="flex-shrink-0 w-[350px] p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, j) => <StarIcon key={j} className="w-4 h-4 text-yellow-400 fill-current" />)}
        </div>
        <p className="text-gray-700 mb-6 leading-relaxed text-lg">"{text}"</p>
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center font-bold text-gray-600">
                {author.charAt(0)}
            </div>
            <div>
                <div className="font-bold text-gray-900">{author}</div>
                <div className="text-sm text-gray-500">{role}</div>
            </div>
        </div>
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
    },
    {
        text: "I love the Travel Planner. It saved me hours of planning for my trip to Japan.",
        author: "Michael Chang",
        role: "Avid Traveler"
    },
    {
        text: "As a student, the Study Mode is a lifesaver. Instant quizzes from my notes? Yes please.",
        author: "Priya Patel",
        role: "Medical Student"
    },
    {
        text: "The GitHub integration is seamless. I can query my own repos in natural language.",
        author: "James Wilson",
        role: "DevOps Engineer"
    }
];

const StepCard: React.FC<{ number: string, title: string, description: string }> = ({ number, title, description }) => (
    <div className="flex flex-col items-center text-center scroll-animate">
        <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-900 mb-6 shadow-sm">
            {number}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 max-w-xs leading-relaxed">{description}</p>
    </div>
);

const UseCaseCard: React.FC<{ icon: React.ElementType, title: string, items: string[] }> = ({ icon: Icon, title, items }) => (
    <div className="bg-gray-50 rounded-3xl p-8 scroll-animate hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-transparent hover:border-gray-100">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white rounded-xl shadow-sm text-black">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        <ul className="space-y-3">
            {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-600">
                    <CheckIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onOpenLegalPage }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!scrollerRef.current) return;
    
    const scroller = scrollerRef.current;
    scroller.setAttribute("data-animated", "true");
    
    const scrollerInner = scroller.querySelector(".scroller__inner");
    if (scrollerInner) {
        const scrollerContent = Array.from(scrollerInner.children);
        scrollerContent.forEach((item) => {
            const duplicatedItem = (item as HTMLElement).cloneNode(true);
            (duplicatedItem as HTMLElement).setAttribute("aria-hidden", "true");
            scrollerInner.appendChild(duplicatedItem);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">
      {/* Floating Navbar */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-full px-2 py-2 pl-6 flex items-center justify-between gap-8 transition-all hover:shadow-md hover:bg-white/90 max-w-fit">
            <div className="flex items-center space-x-2">
                <LogoIcon className="w-6 h-6" />
                <span className="text-lg font-bold tracking-tight">Kyndra AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                <a href="#features" className="hover:text-black transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-black transition-colors">How it Works</a>
                <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={onNavigateToLogin} className="bg-black text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-gray-800 transition-all hover:scale-105">
                    Get Started
                </button>
            </div>
        </nav>
      </header>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="px-6 lg:px-8 pb-24 pt-16 text-center max-w-5xl mx-auto scroll-animate is-visible">
            <div className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-8 shadow-sm">
                <SparklesIcon className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Powered by Gemini 3.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                Your intelligent gateway<br />
                to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">entire web.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
                Kyndra AI synthesizes search results, analyzes documents, and connects your favorite apps into one private, powerful workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={onNavigateToLogin} className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-purple-200 hover:-translate-y-1 flex items-center justify-center gap-2">
                    Start Searching <ArrowRightIcon />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
                    See Examples
                </button>
            </div>
        </section>

        {/* Partners */}
        <section className="py-12 border-y border-gray-100 bg-white scroll-animate">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Bring your own keys from</p>
                <div className="flex justify-center items-center flex-wrap gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="flex items-center gap-2 font-bold text-xl"><LogoIcon className="w-8 h-8"/> Google Gemini</span>
                    <span className="flex items-center gap-2 font-bold text-xl"><OpenAIIcon className="w-8 h-8"/> OpenAI</span>
                    <span className="flex items-center gap-2 font-bold text-xl"><AnthropicIcon className="w-8 h-8"/> Anthropic</span>
                </div>
            </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-32 px-6 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 scroll-animate">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">From chaos to clarity.</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Stop opening 20 tabs. Let AI do the heavy lifting.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent z-0"></div>
                    
                    <div className="relative z-10 bg-[#FAFAFA]">
                        <StepCard number="1" title="Ask Anything" description="Enter a query, upload a document, or connect a repo. We handle complex natural language requests." />
                    </div>
                    <div className="relative z-10 bg-[#FAFAFA]">
                        <StepCard number="2" title="AI Analysis" description="Our engine scans the web, reads your files, and cross-references multiple sources instantly." />
                    </div>
                    <div className="relative z-10 bg-[#FAFAFA]">
                        <StepCard number="3" title="Synthesized Answer" description="Get a clean, cited summary with follow-up questions, shopping links, or code snippets." />
                    </div>
                </div>
            </div>
        </section>

        {/* Core Features Grid */}
        <section id="features" className="py-32 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 scroll-animate">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything you need,<br/>all in one place.</h2>
                    <p className="text-gray-500">Designed for clarity, privacy, and speed.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard icon={SparklesIcon} title="Smart Summaries" description="Concise, accurate answers synthesized from multiple trusted sources instantly." />
                    <FeatureCard icon={GitHubIcon} title="GitHub Agent" description="Search repositories, explain code, and review PRs directly from the interface." />
                    <FeatureCard icon={PlaneIcon} title="Travel Planner" description="Generate complete itineraries with flights, hotels, and local tips in seconds." />
                    <FeatureCard icon={BrowserIcon} title="Web Agent" description="An intelligent agent that can browse websites to find deep information." />
                    <FeatureCard icon={ShoppingCartIcon} title="Shopping Agent" description="Find the best products with AI-driven recommendations and price checks." />
                    <FeatureCard icon={LockIcon} title="Private by Design" description="Your data and API keys live on your device. We never store your search history." />
                </div>
            </div>
        </section>

        {/* Use Cases */}
        <section className="py-32 px-6 bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto">
                 <div className="text-center mb-20 scroll-animate">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for your workflow.</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <UseCaseCard 
                        icon={CodeIcon} 
                        title="For Developers" 
                        items={[
                            "Semantic code search across repos",
                            "Automated PR reviews & bug detection",
                            "Generate snippets & documentation",
                            "Debug errors with context"
                        ]} 
                    />
                    <UseCaseCard 
                        icon={BookOpenIcon} 
                        title="For Students" 
                        items={[
                            "Turn notes into quizzes & flashcards",
                            "Summarize long PDFs & papers",
                            "Deep research mode for essays",
                            "Citation generation"
                        ]} 
                    />
                    <UseCaseCard 
                        icon={ZapIcon} 
                        title="For Creatives" 
                        items={[
                            "Generate images with Imagen 3",
                            "Create moodboards from text",
                            "Find royalty-free media (Pexels)",
                            "Brainstorm content ideas"
                        ]} 
                    />
                    <UseCaseCard 
                        icon={MessageSquareIcon} 
                        title="For Everyone" 
                        items={[
                            "Private, ad-free search",
                            "Plan trips & events",
                            "Shop smarter with comparisons",
                            "Local weather & news dashboards"
                        ]} 
                    />
                </div>
            </div>
        </section>

        {/* Infinite Scroll Testimonials */}
        <section id="testimonials" className="py-24 bg-white overflow-hidden">
            <div className="text-center mb-16 px-6 scroll-animate">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Loved by thousands.</h2>
                <p className="text-gray-500">See what the community is saying about Kyndra AI.</p>
            </div>
            
            <div ref={scrollerRef} className="scroller">
                <div className="scroller__inner">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} {...t} />
                    ))}
                </div>
            </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-32 px-6 bg-[#FAFAFA]">
             <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 scroll-animate">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple, transparent pricing.</h2>
                    <p className="text-gray-500">Start for free. Upgrade for power.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="p-8 rounded-[2rem] border border-gray-200 bg-white flex flex-col scroll-animate">
                        <h3 className="text-2xl font-bold mb-2">Free</h3>
                        <p className="text-gray-500 mb-6">Essential AI search for everyone.</p>
                        <div className="text-4xl font-bold mb-8">$0 <span className="text-lg font-normal text-gray-500">/mo</span></div>
                        
                        <ul className="space-y-4 mb-8 flex-grow">
                            <li className="flex items-center gap-3 text-sm text-gray-700"><CheckIcon className="w-5 h-5 text-black" /> Unlimited standard searches</li>
                            <li className="flex items-center gap-3 text-sm text-gray-700"><CheckIcon className="w-5 h-5 text-black" /> Gemini 2.5 Flash access</li>
                            <li className="flex items-center gap-3 text-sm text-gray-700"><CheckIcon className="w-5 h-5 text-black" /> Travel & Shopping modes</li>
                            <li className="flex items-center gap-3 text-sm text-gray-700"><CheckIcon className="w-5 h-5 text-black" /> Local history storage</li>
                        </ul>
                        
                        <button onClick={onNavigateToLogin} className="w-full py-4 rounded-full border-2 border-gray-100 font-bold hover:border-black transition-colors">
                            Get Started
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-[2rem] bg-black text-white flex flex-col relative overflow-hidden scroll-animate shadow-2xl">
                        <div className="absolute top-0 right-0 bg-gradient-to-bl from-purple-600 to-transparent w-48 h-48 opacity-30 rounded-bl-full blur-2xl"></div>
                        <h3 className="text-2xl font-bold mb-2">Pro</h3>
                        <p className="text-gray-400 mb-6">Power features for power users.</p>
                        <div className="text-4xl font-bold mb-8">Coming Soon</div>
                        
                        <ul className="space-y-4 mb-8 flex-grow relative z-10">
                             <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon className="w-5 h-5 text-purple-400" /> <strong>Gemini 3.0</strong> priority access</li>
                             <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon className="w-5 h-5 text-purple-400" /> Advanced Cloud Sync</li>
                             <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon className="w-5 h-5 text-purple-400" /> Custom AI Agents</li>
                             <li className="flex items-center gap-3 text-sm text-gray-300"><CheckIcon className="w-5 h-5 text-purple-400" /> Early access to new labs</li>
                        </ul>
                        
                        <button disabled className="w-full py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors cursor-not-allowed opacity-90 relative z-10">
                            Join Waitlist
                        </button>
                    </div>
                </div>
             </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 px-6 bg-white">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center scroll-animate">Frequently Asked Questions</h2>
                <div className="space-y-8 scroll-animate">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Is Kyndra AI free to use?</h3>
                        <p className="text-gray-600">Yes! We offer a generous free tier. Because we use a "Bring Your Own Key" model for advanced features, you only pay the AI providers directly if you exceed their free tiers.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Is my data safe?</h3>
                        <p className="text-gray-600">Absolutely. Kyndra AI is built with a privacy-first architecture. Your API keys, search history, and notes are stored locally on your device. We do not have servers that read or store your personal data.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Which AI models can I use?</h3>
                        <p className="text-gray-600">We primarily support Google's Gemini models (including the new 3.0). We are actively working on integrations for OpenAI (GPT-4) and Anthropic (Claude 3).</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#FAFAFA] border-t border-gray-200 pt-16 pb-8">
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
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 pt-8 border-t border-gray-200">
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