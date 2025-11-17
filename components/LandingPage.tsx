import React, { useEffect, useState, useRef } from 'react';
import { LogoIcon } from './icons/LogoIcon';
import { XIcon } from './icons/XIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LinkIcon } from './icons/LinkIcon';
import { BrushIcon } from './icons/BrushIcon';
import { AppPreviewAnimation } from './AppPreviewAnimation';
import { OpenAIIcon } from './icons/OpenAIIcon';
import { AnthropicIcon } from './icons/AnthropicIcon';
import { MessageSquareIcon } from './icons/MessageSquareIcon';
import { LockIcon } from './icons/LockIcon';
import { KeyIcon } from './icons/KeyIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { PrivacyIcon } from './icons/PrivacyIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { CheckIcon } from './icons/CheckIcon';
import { StarIcon } from './icons/StarIcon';
import { PlaneIcon } from './icons/PlaneIcon';
import { ShoppingCartIcon } from './icons/ShoppingCartIcon';
import { LayersIcon } from './icons/LayersIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { ChipIcon } from './icons/ChipIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { BrowserIcon } from './icons/BrowserIcon';


interface LandingPageProps {
  onNavigateToLogin: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

const testimonials = [
  {
    avatar: "https://i.pravatar.cc/40?u=a",
    name: "Sarah D.",
    role: "UX Designer",
    review: "Kyndra AI has completely changed how I research. The AI summaries are a huge time-saver and the interface is beautiful and intuitive.",
  },
  {
    avatar: "https://i.pravatar.cc/40?u=b",
    name: "Alex M.",
    role: "Student",
    review: "As a student, getting to the point quickly is crucial. Kyndra AI helps me understand complex topics fast. The study mode is a lifesaver for exam prep!",
  },
  {
    avatar: "https://i.pravatar.cc/40?u=c",
    name: "David L.",
    role: "Developer",
    review: "Love the BYOK model. I have full control over my API usage and costs. The app is clean, fast, and respects my privacy. Highly recommend.",
  },
  {
    avatar: "https://i.pravatar.cc/40?u=d",
    name: "Maria G.",
    role: "Marketing Manager",
    review: "The new Creator Mode is a game-changer for brainstorming content ideas. My workflow has never been faster.",
  },
];

const TestimonialCard: React.FC<{ testimonial: typeof testimonials[0] }> = ({ testimonial }) => (
  <li className="bg-white p-6 rounded-lg shadow-sm border h-full flex flex-col" style={{ width: '350px' }}>
    <div className="flex items-center">
      <img className="h-10 w-10 rounded-full" src={testimonial.avatar} alt="User avatar" />
      <div className="ml-4">
        <div className="text-sm font-semibold text-gray-900">{testimonial.name}</div>
        <div className="text-sm text-gray-500">{testimonial.role}</div>
      </div>
    </div>
    <div className="flex mt-4">
      {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 text-yellow-400" />)}
    </div>
    <p className="mt-4 text-gray-600 text-sm flex-grow">{testimonial.review}</p>
  </li>
);


const useAnimateOnScroll = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = document.querySelectorAll('.scroll-animate');
    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);
};

export function ArcadeEmbed() {
  return (
    <div style={{ position: 'relative', paddingBottom: 'calc(47.46527777777778% + 41px)', height: '0', width: '100%' }}>
      <iframe
        src="https://demo.arcade.software/pElU8tKfBDlhG3torSXp?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Use Study Mode to Prepare for a Division Quiz"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
      />
    </div>
  )
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onOpenLegalPage }) => {
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const scrollerRef = useRef<HTMLDivElement>(null);
  
  useAnimateOnScroll();

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        scroller.setAttribute("data-animated", "true");
        
        const scrollerInner = scroller.querySelector('.scroller__inner');
        if (scrollerInner) {
            const scrollerContent = Array.from(scrollerInner.children);

            scrollerContent.forEach(item => {
                const duplicatedItem = (item as Element).cloneNode(true) as HTMLElement;
                duplicatedItem.setAttribute('aria-hidden', 'true');
                scrollerInner.appendChild(duplicatedItem);
            });
        }
    }
  }, []);

  useEffect(() => {
    const questions = [
      "how does photosynthesis work?",
      "best places to visit in Italy",
      "explain quantum computing simply",
      "plan a 1-week trip to Tokyo",
    ];
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typingSpeed = 120;
    let typingTimeout: ReturnType<typeof setTimeout>;

    const type = () => {
        const fullText = questions[currentIndex];
        if (isDeleting) {
            currentText = fullText.substring(0, currentText.length - 1);
        } else {
            currentText = fullText.substring(0, currentText.length + 1);
        }

        setPlaceholder(currentText + '|');

        let timeoutSpeed = typingSpeed;
        if (isDeleting) {
            timeoutSpeed /= 2;
        }

        if (!isDeleting && currentText === fullText) {
            isDeleting = true;
            timeoutSpeed = 2000;
            setPlaceholder(currentText); // Remove cursor at pause
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % questions.length;
            timeoutSpeed = 500;
        }

        typingTimeout = setTimeout(type, timeoutSpeed);
    };

    typingTimeout = setTimeout(type, 500);

    return () => clearTimeout(typingTimeout);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToLogin();
  };

  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      <header className={`fixed top-0 left-0 right-0 p-4 transition-all duration-300 z-50 ${headerScrolled ? 'bg-white/80 backdrop-blur-sm shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <LogoIcon className="w-8 h-8" />
                <span className="text-xl font-bold">Kyndra AI</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
                <a href="#features" className="hover:text-purple-600">Features</a>
                <a href="#pricing" className="hover:text-purple-600">Pricing</a>
                <a href="#testimonials" className="hover:text-purple-600">Reviews</a>
                <button onClick={onNavigateToLogin} className="hover:text-purple-600">Sign In</button>
            </nav>
            <button onClick={onNavigateToLogin} className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition">
                Get Started Free
            </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
            <div className="hero-background" aria-hidden="true">
                <div className="shape shape1"></div>
                <div className="shape shape2"></div>
                <div className="shape shape3"></div>
                <div className="shape shape4"></div>
            </div>
            <div className="relative text-center pt-32 pb-16 lg:pt-40 lg:pb-20 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <a href="#pricing" className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 font-semibold px-4 py-1.5 rounded-full text-sm mb-6 hover:bg-purple-200 transition-colors">
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>No credit card required to start</span>
                    </a>
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl xl:text-6xl">
                        <span className="block">Search, Summarized.</span>
                        <span className="block text-purple-600">Instantly.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                        Get instant AI-powered answers and quick links, cutting through the clutter of traditional search.
                    </p>
                    <div className="mt-8 max-w-xl mx-auto">
                        <form onSubmit={handleSearchSubmit} className="hero-search-box-container relative">
                            <input 
                              type="search" 
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder={placeholder} 
                              className="w-full p-4 pr-20 text-lg rounded-full border border-gray-300 shadow-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none" />
                            <button type="submit" className="absolute right-2 top-2 bottom-2 w-14 flex items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition" aria-label="Search">
                                <ArrowRightIcon />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        {/* Logo Cloud Section */}
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Powered by the world's leading AI models
                </p>
                <div className="mt-8 flex justify-center items-center flex-wrap gap-x-12 gap-y-8">
                    <LogoIcon className="h-10 text-gray-500 transition-opacity hover:opacity-100 opacity-60" title="Google Gemini" />
                    <span title="OpenAI">
                        <OpenAIIcon className="h-10 text-gray-500 transition-opacity hover:opacity-100 opacity-60" />
                    </span>
                    <span title="Anthropic">
                        <AnthropicIcon className="h-10 text-gray-500 transition-opacity hover:opacity-100 opacity-60" />
                    </span>
                </div>
            </div>
        </section>


        {/* App Preview Section */}
        <section className="py-16 md:py-24 bg-gray-50 border-y">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 scroll-animate">
                    <h2 className="text-3xl font-extrabold text-gray-900">See How It Works</h2>
                    <p className="mt-4 text-lg text-gray-500">A new, intuitive way to explore information.</p>
                </div>
                <div className="max-w-5xl mx-auto scroll-animate" style={{ transitionDelay: '200ms' }}>
                    <AppPreviewAnimation />
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center scroll-animate">
                    <h2 className="text-3xl font-extrabold text-gray-900">A smarter way to find information</h2>
                    <p className="mt-4 text-lg text-gray-500">Kyndra AI reimagines the search experience from the ground up.</p>
                </div>
                <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="feature-card p-8 bg-gray-50 rounded-2xl text-center scroll-animate">
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                            <SparklesIcon className="w-7 h-7" />
                        </div>
                        <h3 className="mt-6 font-semibold text-lg">AI-Powered Summaries</h3>
                        <p className="mt-2 text-gray-600 text-sm">No more endless scrolling. Get a concise, easy-to-read summary for any query.</p>
                    </div>
                     <div className="feature-card p-8 bg-gray-50 rounded-2xl text-center scroll-animate" style={{ transitionDelay: '100ms' }}>
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                            <LinkIcon className="w-7 h-7" />
                        </div>
                        <h3 className="mt-6 font-semibold text-lg">Relevant Quick Links</h3>
                        <p className="mt-2 text-gray-600 text-sm">Dive deeper with a curated list of the most relevant sources used to generate your summary.</p>
                    </div>
                     <div className="feature-card p-8 bg-gray-50 rounded-2xl text-center scroll-animate" style={{ transitionDelay: '200ms' }}>
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                            <MessageSquareIcon className="w-7 h-7" />
                        </div>
                        <h3 className="mt-6 font-semibold text-lg">Deep Dive with Chat</h3>
                        <p className="mt-2 text-gray-600 text-sm">Ask follow-up questions and have a natural conversation to explore topics further.</p>
                    </div>
                    <div className="feature-card p-8 bg-gray-50 rounded-2xl text-center scroll-animate" style={{ transitionDelay: '300ms' }}>
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                            <PlaneIcon className="w-7 h-7" />
                        </div>
                        <h3 className="mt-6 font-semibold text-lg">Travel Planner</h3>
                        <p className="mt-2 text-gray-600 text-sm">Plan your next trip with AI. Get detailed itineraries, accommodation suggestions, and local tips in seconds.</p>
                    </div>
                    <div className="feature-card p-8 bg-gray-50 rounded-2xl text-center scroll-animate" style={{ transitionDelay: '400ms' }}>
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                            <ShoppingCartIcon className="w-7 h-7" />
                        </div>
                        <h3 className="mt-6 font-semibold text-lg">Shopping Agent</h3>
                        <p className="mt-2 text-gray-600 text-sm">Find the best products for your needs. Get top 3 recommendations with summaries, prices, and buy links.</p>
                    </div>
                     <div className="feature-card p-8 bg-gray-50 rounded-2xl text-center scroll-animate" style={{ transitionDelay: '500ms' }}>
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                            <BrushIcon className="w-7 h-7" />
                        </div>
                        <h3 className="mt-6 font-semibold text-lg">Your Personal Dashboard</h3>
                        <p className="mt-2 text-gray-600 text-sm">Make it your own. Personalize your search page with wallpapers, widgets, and custom themes.</p>
                    </div>
                     <div className="feature-card p-8 bg-gray-50 rounded-2xl text-center scroll-animate" style={{ transitionDelay: '600ms' }}>
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                            <LockIcon className="w-7 h-7" />
                        </div>
                        <h3 className="mt-6 font-semibold text-lg">Private by Design</h3>
                        <p className="mt-2 text-gray-600 text-sm">Your API keys and settings are stored locally on your device, never on our servers.</p>
                    </div>
                     <div className="feature-card p-8 bg-gray-50 rounded-2xl text-center scroll-animate" style={{ transitionDelay: '700ms' }}>
                        <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto">
                            <KeyIcon className="w-7 h-7" />
                        </div>
                        <h3 className="mt-6 font-semibold text-lg">Bring Your Own Key</h3>
                        <p className="mt-2 text-gray-600 text-sm">Connect your own API keys from leading AI providers for complete control over your usage.</p>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Kyndra 2.5 Section */}
        <section className="py-16 md:py-24 bg-gray-50 border-y">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
                    <div className="scroll-animate">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            <span className="block text-purple-600 mb-2">Introducing Kyndra AI 2.5</span>
                            Our biggest leap ever.
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            This major update brings significant UI and AI enhancements, a refreshed design, and a foundation for future model integrations.
                        </p>
                        <dl className="mt-8 space-y-6">
                            <div className="flex">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <ChipIcon className="w-6 h-6" aria-hidden="true" />
                                </div>
                                <dd className="ml-4 text-sm text-gray-500"><span className="font-medium text-gray-900 block">Upgraded AI Models</span> Switch between the speed of Gemini 2.5 Flash and the advanced reasoning of Gemini 2.5 Pro for tailored responses.</dd>
                            </div>
                            <div className="flex">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <HistoryIcon className="w-6 h-6" aria-hidden="true" />
                                </div>
                                <dd className="ml-4 text-sm text-gray-500"><span className="font-medium text-gray-900 block">Smart History</span> A beautifully redesigned page that visually organizes past searches with summaries and related videos.</dd>
                            </div>
                            <div className="flex">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <BrowserIcon className="w-6 h-6" aria-hidden="true" />
                                </div>
                                <dd className="ml-4 text-sm text-gray-500"><span className="font-medium text-gray-900 block">Enhanced Web Agent</span> Powered by Gemini's computer use model, our web agent is more capable than ever at browsing and summarizing websites for you.</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="mt-10 lg:mt-0 scroll-animate" style={{ transitionDelay: '200ms' }}>
                        <ArcadeEmbed />
                    </div>
                </div>
            </div>
        </section>

        {/* How it works Section */}
        <section className="py-16 md:py-24 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center scroll-animate">
                    <h2 className="text-3xl font-extrabold text-gray-900">Get started in minutes</h2>
                    <p className="mt-4 text-lg text-gray-500">Three simple steps to a better search experience.</p>
                </div>
                <div className="mt-12 space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
                    <div className="flex flex-col items-center text-center scroll-animate">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md ring-1 ring-gray-200"><span className="text-2xl font-bold text-purple-600">1</span></div>
                        <h3 className="mt-4 font-semibold text-lg">Create an Account</h3>
                        <p className="mt-1 text-gray-600 text-sm">Sign in quickly and securely using Google or your favorite social provider.</p>
                    </div>
                    <div className="flex flex-col items-center text-center scroll-animate" style={{ transitionDelay: '200ms' }}>
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md ring-1 ring-gray-200"><span className="text-2xl font-bold text-purple-600">2</span></div>
                        <h3 className="mt-4 font-semibold text-lg">Personalize Your Dashboard</h3>
                        <p className="mt-1 text-gray-600 text-sm">Head to settings to customize your wallpaper, clock, and add widgets to make it your own.</p>
                    </div>
                    <div className="flex flex-col items-center text-center scroll-animate" style={{ transitionDelay: '400ms' }}>
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md ring-1 ring-gray-200"><span className="text-2xl font-bold text-purple-600">3</span></div>
                        <h3 className="mt-4 font-semibold text-lg">Start Searching</h3>
                        <p className="mt-1 text-gray-600 text-sm">Ask anything and get instant, intelligent summaries and related links.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Privacy Section */}
        <section className="bg-gray-50 py-16 md:py-24 border-y">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center scroll-animate">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">Your Search, Your Data. Period.</h2>
                        <p className="mt-4 text-lg text-gray-500">We believe your information belongs to you. That's why Kyndra AI is built with privacy at its core.</p>
                        <dl className="mt-8 space-y-6">
                            <div className="flex">
                                <CheckCircleIcon className="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Local-First Storage.</span> All your data, including API keys and history, stays on your device.</dd>
                            </div>
                            <div className="flex">
                                <CheckCircleIcon className="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">No Tracking Servers.</span> We don't have servers that store your personal information or search queries.</dd>
                            </div>
                            <div className="flex">
                                <CheckCircleIcon className="flex-shrink-0 w-6 h-6 text-green-500" aria-hidden="true" />
                                <dd className="ml-3 text-sm text-gray-500"><span className="font-medium text-gray-900">Full Data Control.</span> Export or delete all your app data at any time from the settings.</dd>
                            </div>
                        </dl>
                    </div>
                    <div className="mt-10 lg:mt-0 flex items-center justify-center">
                        <PrivacyIcon className="w-48 h-48 text-purple-200" />
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center scroll-animate">
              <h2 className="text-3xl font-extrabold text-gray-900">Simple, transparent pricing</h2>
              <p className="mt-4 text-lg text-gray-500">
                Start for free. As we add more powerful features, a Pro plan will be introduced.
              </p>
            </div>
            <div className="mt-16 max-w-lg mx-auto grid gap-8 lg:max-w-7xl lg:grid-cols-3">
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-8 scroll-animate">
                <h3 className="text-2xl font-semibold text-gray-900">Free</h3>
                <p className="mt-2 text-gray-500">For individuals getting started with smarter search.</p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-gray-900">$0</span>
                  <span className="text-base font-medium text-gray-500">/ month</span>
                </div>
                <button onClick={onNavigateToLogin} className="mt-6 block w-full text-center rounded-lg bg-purple-600 px-6 py-3 text-base font-medium text-white hover:bg-purple-700">
                  Get Started for Free
                </button>
                <ul className="mt-8 space-y-4 text-sm text-gray-600">
                  <li className="flex space-x-3"><CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /><span>AI-Powered Summaries</span></li>
                  <li className="flex space-x-3"><CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /><span>Relevant Quick Links</span></li>
                  <li className="flex space-x-3"><CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /><span>Follow-up Chat Mode</span></li>
                  <li className="flex space-x-3"><CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /><span>Homepage Personalization</span></li>
                  <li className="flex space-x-3"><CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /><span>Local-First Privacy</span></li>
                </ul>
              </div>
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm p-8 relative overflow-hidden scroll-animate" style={{ transitionDelay: '200ms' }}>
                <div className="absolute top-0 right-0 -mr-12 -mt-12">
                   <div className="bg-purple-100 text-purple-700 text-xs font-semibold tracking-wider uppercase py-4 px-12 transform rotate-45">Coming Soon</div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Pro</h3>
                <p className="mt-2 text-gray-500">For power users who need to search across all their apps.</p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-gray-400">TBA</span>
                </div>
                <button disabled className="mt-6 block w-full text-center rounded-lg bg-gray-300 px-6 py-3 text-base font-medium text-gray-500 cursor-not-allowed">
                  Notify Me
                </button>
                 <ul className="mt-8 space-y-4 text-sm text-gray-600">
                  <li className="flex space-x-3 font-semibold text-gray-700"><span>Everything in Free, plus:</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Connect Apps (Gmail, Notion, Slack)</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Cloud Sync & Backup</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Access to Advanced AI Models</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Collaboration Features</span></li>
                </ul>
              </div>
               <div className="flex flex-col rounded-2xl border-2 border-purple-600 bg-white shadow-lg p-8 relative scroll-animate" style={{ transitionDelay: '400ms' }}>
                <div className="absolute top-0 right-0 -mr-12 -mt-12">
                   <div className="bg-purple-600 text-white text-xs font-semibold tracking-wider uppercase py-4 px-12 transform rotate-45">Coming Soon</div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Kyndra Max</h3>
                <p className="mt-2 text-gray-500">For teams and enterprises needing advanced AI, collaboration tools, and priority support.</p>
                <div className="mt-6">
                  <span className="text-5xl font-extrabold text-gray-400">TBA</span>
                </div>
                <button disabled className="mt-6 block w-full text-center rounded-lg bg-gray-300 px-6 py-3 text-base font-medium text-gray-500 cursor-not-allowed">
                  Notify Me
                </button>
                 <ul className="mt-8 space-y-4 text-sm text-gray-600">
                  <li className="flex space-x-3 font-semibold text-gray-700"><span>Everything in Pro, plus:</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Advanced AI Agents & Workflows</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Unlimited Connected Apps</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Team Analytics & Usage Reports</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Dedicated Onboarding & Support</span></li>
                  <li className="flex space-x-3"><SparklesIcon className="flex-shrink-0 h-5 w-5 text-purple-500" /><span>Early Access to New Features</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-gray-50 border-y">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center scroll-animate">
                    <h2 className="text-3xl font-extrabold text-gray-900">Loved by users worldwide</h2>
                    <p className="mt-4 text-lg text-gray-500">Don't just take our word for it. Here's what people are saying.</p>
                </div>
            </div>
            <div className="mt-16 scroller" ref={scrollerRef} data-speed="slow">
                <ul className="scroller__inner">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </ul>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
                <a 
                    href="https://testimonial.to/siloseearchai" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                    Leave a review
                </a>
            </div>
        </section>

        {/* Final CTA */}
        <section className="bg-white">
            <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8 scroll-animate">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    <span className="block">Ready to transform your search?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-gray-500">Create an account today and experience the future of information.</p>
                <button onClick={onNavigateToLogin} className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 sm:w-auto">
                    Get Started Now
                </button>
            </div>
        </section>
      </main>

      <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="col-span-2 md:col-span-1">
                      <div className="flex items-center space-x-2">
                          <LogoIcon className="w-8 h-8" />
                          <span className="text-xl font-bold">Kyndra AI</span>
                      </div>
                      <p className="mt-4 text-gray-500 text-sm">Search, Summarized. Instantly.</p>
                      <div className="mt-6 flex space-x-6">
                        <a href="#" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-gray-500"><span className="sr-only">GitHub</span><GitHubIcon className="w-6 h-6" /></a>
                        <a href="#" onClick={(e) => { e.preventDefault(); }} className="text-gray-400 hover:text-gray-500"><span className="sr-only">X</span><XIcon className="w-6 h-6" /></a>
                      </div>
                  </div>
                  <div>
                      <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Product</h3>
                      <ul className="mt-4 space-y-2">
                          <li><a href="#features" className="text-base text-gray-500 hover:text-gray-900">Features</a></li>
                           <li><a href="#pricing" className="text-base text-gray-500 hover:text-gray-900">Pricing</a></li>
                          <li><button onClick={() => onOpenLegalPage('about')} className="text-base text-gray-500 hover:text-gray-900">About Us</button></li>
                      </ul>
                  </div>
                  <div>
                      <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
                      <ul className="mt-4 space-y-2">
                          <li><a href="https://www.freeprivacypolicy.com/live/b441984d-6ae7-468f-b21d-0e7b93a9ed4e" target="_blank" rel="noopener noreferrer" className="text-base text-gray-500 hover:text-gray-900">Privacy Policy</a></li>
                          <li><button onClick={() => onOpenLegalPage('terms')} className="text-base text-gray-500 hover:text-gray-900">Terms of Service</button></li>
                      </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="mailto:wolfsisupport@gmail.com" className="text-base text-gray-500 hover:text-gray-900">Support</a></li>
                    </ul>
                  </div>
              </div>
              <div className="mt-8 border-t border-gray-200 pt-8">
                  <p className="text-base text-gray-400 text-center">&copy; {new Date().getFullYear()} Kyndra AI. All rights reserved.</p>
              </div>
          </div>
      </footer>
    </div>
  );
};
