import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SearchPage } from './components/SearchPage';
import { ResultsPage } from './components/ResultsPage';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';
import { ChatModal } from './components/ChatModal';
import { Onboarding } from './components/Onboarding';
import { fetchSearchResults, processPexelsQuery, fetchCreatorIdeas, fetchDeepResearch } from './services/geminiService';
import { fetchYouTubeVideos } from './services/youtubeService';
import type { AiCreativeTool, SearchResult, ChatMessage, ClockSettings, StickerInstance, CustomSticker, WidgetInstance, UserProfile, WidgetType, TemperatureUnit, SearchInputSettings, SearchSettings, AccessibilitySettings, LanguageSettings, NotificationSettings, DeveloperSettings, AnalyticsSettings, YouTubeVideo, TravelPlan, PexelsResult, CreatorIdeasResult, TikTokVideo, DeepResearchResult, FileRecord, NoteRecord, SummarizationSource, HistoryRecord } from './types';
import { AiSparkleIcon } from './components/icons/AiSparkleIcon';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChromeBanner } from './components/ChromeBanner';
import { TermsPage } from './components/TermsPage';
import { PrivacyPage } from './components/PrivacyPage';
import { AboutPage } from './components/AboutPage';
import { AccessDeniedPage } from './components/AccessDeniedPage';
import { LandingPage } from './components/LandingPage';
import { CloseIcon } from './components/icons/CloseIcon';
import { supabase } from './utils/supabase';
import { LoginPage } from './components/LoginPage';
import { MapPage } from './components/MapPage';
import { useIsMobile } from './hooks/useIsMobile';
import { MobileApp } from './components/mobile/MobileApp';
import { TravelPlanPage } from './components/TravelPlanPage';
import { fetchTravelPlan } from './services/geminiService';
import { fetchPexelsMedia } from './services/pexelsService';
import { PexelsPage } from './components/PexelsPage';
import { WebAgentPage } from './components/WebAgentPage';
import { CreatorIdeasPage } from './components/CreatorIdeasPage';
import { DiscoverPage } from './components/DiscoverPage';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { DeepResearchPage } from './components/DeepResearchPage';
import { HistoryPage } from './components/HistoryPage';
import * as db from './utils/db';
import { FileSelectorModal } from './components/FileSelectorModal';

type SpeechLanguage = 'en-US' | 'es-ES';
type TermsAgreement = 'pending' | 'agreed' | 'disagreed';
type CreatorPlatform = 'youtube' | 'tiktok' | 'instagram';

declare global {
  interface Window {
    google?: any;
    showOpenFilePicker?: any;
  }
}

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="coming-soon-title">
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" onClick={onClose} aria-hidden="true"></div>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center transform transition-all">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
          <CloseIcon />
        </button>
        <h2 id="coming-soon-title" className="text-2xl font-bold text-gray-800">Coming Soon!</h2>
        <p className="mt-4 text-gray-600">
          This feature is under development. We're working hard to bring you more ways to supercharge your search. Stay tuned!
        </p>
        <div className="mt-8">
            <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">
                Got it
            </button>
        </div>
      </div>
    </div>
  );
};

const MAX_RECENT_SEARCHES = 20;

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [mapQuery, setMapQuery] = useState<string>('');
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [travelQuery, setTravelQuery] = useState<string>('');
  const [pexelsResult, setPexelsResult] = useState<PexelsResult | null>(null);
  const [pexelsQuery, setPexelsQuery] = useState<string>('');
  const [agentQuery, setAgentQuery] = useState<string>('');
  const [creatorIdeasResult, setCreatorIdeasResult] = useState<CreatorIdeasResult | null>(null);
  const [creatorQuery, setCreatorQuery] = useState('');
  const [deepResearchResult, setDeepResearchResult] = useState<DeepResearchResult | null>(null);
  const [researchQuery, setResearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState('');
  const [lastSearchOptions, setLastSearchOptions] = useState<any>({});
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [initialSettingsSection, setInitialSettingsSection] = useState<string | undefined>();
  const [isTemporaryMode, setTemporaryMode] = useState(false);
  const [isStickerEditMode, setStickerEditMode] = useState(false);
  const [isWidgetEditMode, setWidgetEditMode] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  
  const [isChatModeOpen, setChatModeOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setChatLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);

  const [isOnboarding, setIsOnboarding] = useState(() => {
    const onboardingComplete = !!window.localStorage.getItem('onboardingComplete_v2');
    const geminiKeyExists = !!(JSON.parse(window.localStorage.getItem('ai-api-keys') || '{}').gemini);
    return !(onboardingComplete && geminiKeyExists);
  });
  const [showChromeBanner, setShowChromeBanner] = useState(false);

  const [termsAgreement, setTermsAgreement] = useState<TermsAgreement>(() => {
    const stored = window.localStorage.getItem('termsAgreement_v1');
    return (stored === 'agreed' || stored === 'disagreed') ? stored : 'pending';
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const storedUser = window.localStorage.getItem('userProfile');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.provider === 'google') {
          return parsed;
        }
      }
    } catch(e) { /* ignore */ }
    return null;
  });

  const [tokenUsage, setTokenUsage] = useState<{ [key: string]: { tokens: number } }>(() => {
    try {
      const item = window.localStorage.getItem('tokenUsage');
      return item ? JSON.parse(item) : { gemini: { tokens: 0 } };
    } catch (error) {
      console.error("Could not parse tokenUsage from localStorage", error);
      return { gemini: { tokens: 0 } };
    }
  });

  const [videoPlayerState, setVideoPlayerState] = useState<{ isOpen: boolean; videoId: string | null; playlist: YouTubeVideo[]; }>({ isOpen: false, videoId: null, playlist: [] });

  const isMobile = useIsMobile();
  
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isFileSelectorOpen, setFileSelectorOpen] = useState(false);
  const [summarizationSource, setSummarizationSource] = useState<SummarizationSource | null>(null);

  useEffect(() => {
      const initData = async () => {
          await db.initDB();
          const [dbFiles, dbNotes, dbHistory] = await Promise.all([db.getFiles(), db.getNotes(), db.getHistoryRecords()]);
          setFiles(dbFiles);
          setNotes(dbNotes);
          setHistory(dbHistory);
      };
      initData();
  }, []);

  const handleFileUpload = async (file: File) => {
      await db.addFile(file);
      const dbFiles = await db.getFiles();
      setFiles(dbFiles);
  };

  const handleDeleteFile = async (id: number) => {
      await db.deleteFile(id);
      setFiles(files.filter(f => f.id !== id));
  };
  
  const handleSaveNote = async (note: Partial<NoteRecord>) => {
      await db.saveNote(note);
      const dbNotes = await db.getNotes();
      setNotes(dbNotes);
  };

  const handleDeleteNote = async (id: number) => {
      await db.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
  };

  const handleSelectSummarizationSource = (source: SummarizationSource | null) => {
      setSummarizationSource(source);
      setFileSelectorOpen(false);
      if (source) {
        setIsStudyMode(false);
      }
  };


  const navigate = useCallback((path: string, options?: { replace?: boolean, section?: string }) => {
    if (options?.replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path);
    if (path.startsWith('/settings') && options?.section) {
        setInitialSettingsSection(options.section);
    }
  }, []);
  
  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/results') {
        const storedResult = sessionStorage.getItem('searchResult');
        const storedQuery = sessionStorage.getItem('currentQuery');
        const storedStudyMode = sessionStorage.getItem('isStudyMode');
        const storedSource = sessionStorage.getItem('summarizationSource');
        if (storedResult && storedQuery) {
            setSearchResult(JSON.parse(storedResult));
            setCurrentQuery(storedQuery);
            setIsStudyMode(storedStudyMode ? JSON.parse(storedStudyMode) : false);
            setSummarizationSource(storedSource ? JSON.parse(storedSource) : null);
        } else {
            navigate('/search', { replace: true });
        }
    } else if (path === '/research') {
        const storedResult = sessionStorage.getItem('deepResearchResult');
        const storedQuery = sessionStorage.getItem('researchQuery');
        if (storedResult && storedQuery) {
            setDeepResearchResult(JSON.parse(storedResult));
            setResearchQuery(storedQuery);
        } else {
            navigate('/search', { replace: true });
        }
    } else if (path === '/creator-ideas') {
        const storedResult = sessionStorage.getItem('creatorIdeasResult');
        const storedQuery = sessionStorage.getItem('creatorQuery');
        if (storedResult && storedQuery) {
            setCreatorIdeasResult(JSON.parse(storedResult));
            setCreatorQuery(storedQuery);
        } else {
            navigate('/search', { replace: true });
        }
    } else if (path === '/map') {
        const storedMapQuery = sessionStorage.getItem('mapQuery');
        if (storedMapQuery) {
            setMapQuery(storedMapQuery);
        } else {
            navigate('/search', { replace: true });
        }
    } else if (path === '/travel-plan') {
        const storedPlan = sessionStorage.getItem('travelPlan');
        const storedQuery = sessionStorage.getItem('travelQuery');
        if (storedPlan && storedQuery) {
            setTravelPlan(JSON.parse(storedPlan));
            setTravelQuery(storedQuery);
        } else {
            navigate('/search', { replace: true });
        }
    } else if (path === '/pexels') {
        const storedResult = sessionStorage.getItem('pexelsResult');
        const storedQuery = sessionStorage.getItem('pexelsQuery');
        if (storedResult && storedQuery) {
            setPexelsResult(JSON.parse(storedResult));
            setPexelsQuery(storedQuery);
        } else {
            navigate('/search', { replace: true });
        }
    } else if (path === '/agent') {
        const storedAgentQuery = sessionStorage.getItem('agentQuery');
        if (storedAgentQuery) {
            setAgentQuery(storedAgentQuery);
        } else {
            navigate('/search', { replace: true });
        }
    }
  }, [navigate]);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            setUserProfile({
                name: session.user.user_metadata.full_name || session.user.user_metadata.name || 'User',
                email: session.user.user_metadata.email || session.user.email || 'No email',
                picture: session.user.user_metadata.avatar_url || session.user.user_metadata.picture || '',
                provider: session.user.app_metadata.provider,
            });
             if (['/', '/login'].includes(currentPath)) {
                navigate('/search', { replace: true });
            }
        } else {
            if (userProfile && userProfile.provider !== 'google') {
                setUserProfile(null);
                 navigate('/', { replace: true });
            }
        }
    });

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
             setUserProfile({
                name: session.user.user_metadata.full_name || session.user.user_metadata.name || 'User',
                email: session.user.user_metadata.email || session.user.email || 'No email',
                picture: session.user.user_metadata.avatar_url || session.user.user_metadata.picture || '',
                provider: session.user.app_metadata.provider,
            });
             if (['/', '/login'].includes(window.location.pathname)) {
                navigate('/search', { replace: true });
            }
        }
    };
    if (!userProfile) {
        checkSession();
    }


    return () => subscription.unsubscribe();
  }, [userProfile, navigate, currentPath]);

  const [stickers, setStickers] = useState<StickerInstance[]>(() => {
    try {
      const items = window.localStorage.getItem('stickers');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Could not parse stickers from localStorage", error);
      return [];
    }
  });

  const [widgets, setWidgets] = useState<WidgetInstance[]>(() => {
    try {
      const items = window.localStorage.getItem('widgets');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Could not parse widgets from localStorage", error);
      return [];
    }
  });

  const [customStickers, setCustomStickers] = useState<CustomSticker[]>(() => {
    try {
      const items = window.localStorage.getItem('customStickers');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Could not parse custom stickers from localStorage", error);
      return [];
    }
  });

  const [proCredits, setProCredits] = useState<number>(() => {
    try {
      const item = window.localStorage.getItem('proCredits');
      return item ? JSON.parse(item) : 50;
    } catch (error) {
      console.error("Could not parse proCredits from localStorage", error);
      return 50;
    }
  });
  
  const [unlockedProFeatures, setUnlockedProFeatures] = useState<string[]>(() => {
    try {
      const items = window.localStorage.getItem('unlockedProFeatures');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Could not parse unlockedProFeatures from localStorage", error);
      return [];
    }
  });
  
  const [lastDailyCredit, setLastDailyCredit] = useState<string | null>(() => {
    return window.localStorage.getItem('lastDailyCredit');
  });

  const [isComingSoonModalOpen, setComingSoonModalOpen] = useState(false);
  const handleOpenComingSoonModal = () => setComingSoonModalOpen(true);
  const handleCloseComingSoonModal = () => setComingSoonModalOpen(false);

  useEffect(() => {
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
    const hasHiddenBanner = localStorage.getItem('hideChromeBanner') === 'true';

    if (!isChrome && !hasHiddenBanner) {
        setShowChromeBanner(true);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastDailyCredit !== today && userProfile) {
      setProCredits(c => c + 5);
      setLastDailyCredit(today);
    }
  }, [userProfile, lastDailyCredit]);

  const handleCloseChromeBanner = () => {
    setShowChromeBanner(false);
    localStorage.setItem('hideChromeBanner', 'true');
  };
  
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
        const items = window.localStorage.getItem('recentSearches');
        return items ? JSON.parse(items) : [];
    } catch (error) {
        console.error("Could not parse recent searches from localStorage", error);
        return [];
    }
  });

  const [theme, setTheme] = useState<string>(() => {
    return window.localStorage.getItem('kyndra-ai-theme') || 'bg-white';
  });
  
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(() => {
    return window.localStorage.getItem('customWallpaper');
  });

  const [isClockVisible, setIsClockVisible] = useState<boolean>(() => {
    try {
        const item = window.localStorage.getItem('isClockVisible');
        return item ? JSON.parse(item) : true;
    } catch (error) {
        console.error("Could not parse isClockVisible from localStorage", error);
        return true;
    }
  });
  
  const [clockSettings, setClockSettings] = useState<ClockSettings>(() => {
    try {
        const item = window.localStorage.getItem('clockSettings');
        const parsed = item ? JSON.parse(item) : {};
        return { 
            style: parsed.style || 'horizontal', 
            theme: parsed.theme || 'classic',
            font: parsed.font || 'fredoka',
            size: parsed.size || 10,
            thickness: parsed.thickness || 3,
            animation: parsed.animation || 'none',
            format: parsed.format || '12h',
        };
    } catch (error) {
        console.error("Could not parse clockSettings from localStorage", error);
        return { style: 'horizontal', theme: 'classic', font: 'fredoka', size: 10, thickness: 3, animation: 'none', format: '12h' };
    }
  });

  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>(() => {
    try {
        const item = window.localStorage.getItem('temperatureUnit');
        return (item as TemperatureUnit) || 'fahrenheit';
    } catch (error) {
        console.error("Could not parse temperatureUnit from localStorage", error);
        return 'fahrenheit';
    }
  });
  
  const [speechLanguage, setSpeechLanguage] = useState<SpeechLanguage>(() => {
    try {
        const item = window.localStorage.getItem('speechLanguage');
        return item === 'es-ES' ? 'es-ES' : 'en-US';
    } catch (error) {
        console.error("Could not parse speechLanguage from localStorage", error);
        return 'en-US';
    }
  });

  const [apiKeys, setApiKeys] = useState<{ [key: string]: string }>(() => {
    try {
      const items = window.localStorage.getItem('ai-api-keys');
      const parsed = items ? JSON.parse(items) : {};
      return {
        youtube: 'AIzaSyBBf9TIeqt8izcMBTf0Emr_sbum4cPXjlU',
        pexels: '8Mh8jDK5VAgGnnmNYO2k0LqdaLL8lbIR4ou5Vnd8Zod0cETWahEx1MKf',
        apify: '',
        streamline: 'ScPULhBXlEmGJGXa.da9b9d9c4a3309b8dff9d29751949e46',
        ...parsed,
      };
    } catch (error) {
      console.error("Could not parse API keys from localStorage", error);
      return {
        youtube: 'AIzaSyBBf9TIeqt8izcMBTf0Emr_sbum4cPXjlU',
        pexels: '8Mh8jDK5VAgGnnmNYO2k0LqdaLL8lbIR4ou5Vnd8Zod0cETWahEx1MKf',
        apify: '',
        streamline: 'ScPULhBXlEmGJGXa.da9b9d9c4a3309b8dff9d29751949e46',
      };
    }
  });

  const [searchInputSettings, setSearchInputSettings] = useState<SearchInputSettings>(() => {
    try {
      const item = window.localStorage.getItem('searchInputSettings');
      if (item) {
        const parsed = JSON.parse(item);
        return {
          isLarge: typeof parsed.isLarge === 'boolean' ? parsed.isLarge : true,
          isGlossy: typeof parsed.isGlossy === 'boolean' ? parsed.isGlossy : false,
        };
      }
    } catch (error) {
      console.error("Could not parse searchInputSettings from localStorage", error);
    }
    return { isLarge: true, isGlossy: false };
  });

  const [searchSettings, setSearchSettings] = useState<SearchSettings>(() => {
    try {
      const item = window.localStorage.getItem('searchSettings');
      if (item) {
        const parsed = JSON.parse(item);
        return {
          useWebSearch: typeof parsed.useWebSearch === 'boolean' ? parsed.useWebSearch : true,
          model: (parsed.model === 'gemini-2.5-flash' || parsed.model === 'gemini-2.5-pro') ? parsed.model : 'gemini-2.5-flash',
        };
      }
    } catch (error) {
      console.error("Could not parse searchSettings from localStorage", error);
    }
    return { useWebSearch: true, model: 'gemini-2.5-flash' };
  });

  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(() => {
    try {
      const item = window.localStorage.getItem('accessibilitySettings');
      if (item) {
        const parsed = JSON.parse(item);
        return {
          uiFontSize: typeof parsed.uiFontSize === 'number' ? parsed.uiFontSize : 100,
          highContrast: typeof parsed.highContrast === 'boolean' ? parsed.highContrast : false,
        };
      }
    } catch (error) {
      console.error("Could not parse accessibilitySettings from localStorage", error);
    }
    return { uiFontSize: 100, highContrast: false };
  });

  const [languageSettings, setLanguageSettings] = useState<LanguageSettings>(() => {
    try {
      const item = window.localStorage.getItem('languageSettings');
      return item ? JSON.parse(item) : { uiLanguage: 'en', searchRegion: 'auto' };
    } catch (error) { return { uiLanguage: 'en', searchRegion: 'auto' }; }
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    try {
      const item = window.localStorage.getItem('notificationSettings');
      return item ? JSON.parse(item) : { featureUpdates: true, collaborationInvites: true };
    } catch (error) { return { featureUpdates: true, collaborationInvites: true }; }
  });

  const [developerSettings, setDeveloperSettings] = useState<DeveloperSettings>(() => {
    try {
      const item = window.localStorage.getItem('developerSettings');
      return item ? JSON.parse(item) : { showApiLogger: false };
    } catch (error) { return { showApiLogger: false }; }
  });

  const [analyticsSettings, setAnalyticsSettings] = useState<AnalyticsSettings>(() => {
    try {
      const item = window.localStorage.getItem('analyticsSettings');
      return item ? JSON.parse(item) : { enabled: true };
    } catch (error) { return { enabled: true }; }
  });

  useEffect(() => {
    if (termsAgreement !== 'pending') {
        window.localStorage.setItem('termsAgreement_v1', termsAgreement);
    }
  }, [termsAgreement]);

  useEffect(() => {
    try {
        window.localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    } catch (error) {
        console.error("Could not save recent searches to localStorage", error);
    }
  }, [recentSearches]);

  useEffect(() => {
    window.localStorage.setItem('kyndra-ai-theme', theme);
    document.body.className = '';
  }, [theme]);

  useEffect(() => {
    if (customWallpaper) {
      window.localStorage.setItem('customWallpaper', customWallpaper);
    } else {
      window.localStorage.removeItem('customWallpaper');
    }
  }, [customWallpaper]);
  
  useEffect(() => {
    try {
        window.localStorage.setItem('isClockVisible', JSON.stringify(isClockVisible));
    } catch (error) {
        console.error("Could not save isClockVisible to localStorage", error);
    }
  }, [isClockVisible]);
  
  useEffect(() => {
    try {
        window.localStorage.setItem('clockSettings', JSON.stringify(clockSettings));
    } catch (error) {
        console.error("Could not save clockSettings to localStorage", error);
    }
  }, [clockSettings]);

  useEffect(() => {
    try {
        window.localStorage.setItem('temperatureUnit', temperatureUnit);
    } catch (error) {
        console.error("Could not save temperatureUnit to localStorage", error);
    }
  }, [temperatureUnit]);
  
  useEffect(() => {
    try {
        window.localStorage.setItem('speechLanguage', speechLanguage);
    } catch (error) {
        console.error("Could not save speechLanguage to localStorage", error);
    }
  }, [speechLanguage]);

  useEffect(() => {
    try {
      window.localStorage.setItem('stickers', JSON.stringify(stickers));
    } catch (error) {
      console.error("Could not save stickers to localStorage", error);
    }
  }, [stickers]);

  useEffect(() => {
    try {
      window.localStorage.setItem('widgets', JSON.stringify(widgets));
    } catch (error) {
      console.error("Could not save widgets to localStorage", error);
    }
  }, [widgets]);

  useEffect(() => {
    try {
      window.localStorage.setItem('customStickers', JSON.stringify(customStickers));
    } catch (error) {
      console.error("Could not save custom stickers to localStorage", error);
    }
  }, [customStickers]);

  const onApiKeysChange = (keys: { [key: string]: string }) => {
    setApiKeys(keys);
  };

  useEffect(() => {
    try {
      window.localStorage.setItem('ai-api-keys', JSON.stringify(apiKeys));
    } catch (error) {
      console.error("Could not save API keys to localStorage", error);
    }
  }, [apiKeys]);
  
  useEffect(() => {
    try {
        window.localStorage.setItem('searchInputSettings', JSON.stringify(searchInputSettings));
    } catch (error) {
        console.error("Could not save searchInputSettings to localStorage", error);
    }
  }, [searchInputSettings]);

  useEffect(() => {
    try {
        window.localStorage.setItem('searchSettings', JSON.stringify(searchSettings));
    } catch (error) {
        console.error("Could not save searchSettings to localStorage", error);
    }
  }, [searchSettings]);

  useEffect(() => {
    try {
        window.localStorage.setItem('accessibilitySettings', JSON.stringify(accessibilitySettings));
    } catch (error) {
        console.error("Could not save accessibilitySettings to localStorage", error);
    }
  }, [accessibilitySettings]);

  useEffect(() => {
    try { window.localStorage.setItem('languageSettings', JSON.stringify(languageSettings)); }
    catch (e) { console.error(e); }
  }, [languageSettings]);

  useEffect(() => {
    try { window.localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings)); }
    catch (e) { console.error(e); }
  }, [notificationSettings]);

  useEffect(() => {
    try { window.localStorage.setItem('developerSettings', JSON.stringify(developerSettings)); }
    catch (e) { console.error(e); }
  }, [developerSettings]);

  useEffect(() => {
    try { window.localStorage.setItem('analyticsSettings', JSON.stringify(analyticsSettings)); }
    catch (e) { console.error(e); }
  }, [analyticsSettings]);
  
  useEffect(() => {
    try {
      if (userProfile) {
        window.localStorage.setItem('userProfile', JSON.stringify(userProfile));
      } else {
        window.localStorage.removeItem('userProfile');
      }
    } catch (error) {
      console.error("Could not save user profile to localStorage", error);
    }
  }, [userProfile]);

  useEffect(() => {
    try { window.localStorage.setItem('proCredits', JSON.stringify(proCredits)); }
    catch (e) { console.error(e); }
  }, [proCredits]);

  useEffect(() => {
    try { window.localStorage.setItem('unlockedProFeatures', JSON.stringify(unlockedProFeatures)); }
    catch (e) { console.error(e); }
  }, [unlockedProFeatures]);
  
  useEffect(() => {
    if (lastDailyCredit) {
      window.localStorage.setItem('lastDailyCredit', lastDailyCredit);
    } else {
      window.localStorage.removeItem('lastDailyCredit');
    }
  }, [lastDailyCredit]);
  
  useEffect(() => {
    try { window.localStorage.setItem('tokenUsage', JSON.stringify(tokenUsage)); }
    catch (e) { console.error(e); }
  }, [tokenUsage]);
  
  const handleGoogleSignIn = useCallback((response: any) => {
    try {
        const credential = response.credential;
        const payload = JSON.parse(atob(credential.split('.')[1]));
        const profile: UserProfile = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
            provider: 'google'
        };
        setUserProfile(profile);
        navigate('/search', { replace: true });
    } catch (error) {
        console.error("Google Sign-In error:", error);
    }
  }, [navigate]);
  
  const handleLogout = useCallback(async () => {
    const provider = userProfile?.provider;
    if (provider === 'google' && window.google) {
      window.google.accounts.id.disableAutoSelect();
    } else if (provider) {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Error logging out:', error);
    }
    setUserProfile(null);
    navigate('/', { replace: true });
  }, [userProfile, navigate]);

  const handleSearch = useCallback(async (query: string, options: { studyMode?: boolean; mapSearch?: boolean; travelSearch?: boolean; pexelsSearch?: boolean; agentSearch?: boolean; creatorSearch?: boolean; creatorPlatform?: CreatorPlatform; researchSearch?: boolean; designSearch?: boolean; docSearch?: boolean; codeSearch?: boolean; }) => {
    if (!query.trim()) return;
    if (!apiKeys.gemini) {
      alert('Please set your Gemini API key in settings or complete the onboarding process.');
      setIsOnboarding(true);
      return;
    }
    
    setLoadingQuery(query);
    setLastSearchOptions(options);
    setSidebarOpen(false);
    setError(null);

    if (summarizationSource) {
        if (!isTemporaryMode) {
          setRecentSearches(prevSearches => {
            const searchQuery = `file: ${query} in ${summarizationSource.name}`;
            const updatedSearches = [searchQuery, ...prevSearches.filter(s => s !== searchQuery)];
            return updatedSearches.slice(0, MAX_RECENT_SEARCHES);
          });
        }
    } else if (options.researchSearch) {
        setIsLoading(true);
        setResearchQuery(query);
        if (!isTemporaryMode) {
          setRecentSearches(prev => [`research: ${query}`, ...prev.filter(s => s !== `research: ${query}`)].slice(0, MAX_RECENT_SEARCHES));
        }
        try {
            const result = await fetchDeepResearch(query, apiKeys.gemini);
            setDeepResearchResult(result);
            sessionStorage.setItem('deepResearchResult', JSON.stringify(result));
            sessionStorage.setItem('researchQuery', query);
            navigate('/research');
        } catch (err) {
            console.error(err);
            setError('Sorry, something went wrong with the deep research. Please try again.');
        } finally {
            setIsLoading(false);
        }
        return;
    } else if (options.creatorSearch && options.creatorPlatform) {
        setIsLoading(true);
        setCreatorQuery(query);
        if (!isTemporaryMode) {
          setRecentSearches(prevSearches => {
            const updatedSearches = [`creator: ${query}`, ...prevSearches.filter(s => s !== `creator: ${query}`)];
            return updatedSearches.slice(0, MAX_RECENT_SEARCHES);
          });
        }
        try {
            const result = await fetchCreatorIdeas(query, options.creatorPlatform, apiKeys.gemini);
            setCreatorIdeasResult(result);
            sessionStorage.setItem('creatorIdeasResult', JSON.stringify(result));
            sessionStorage.setItem('creatorQuery', query);
            navigate('/creator-ideas');
        } catch (err) {
            console.error(err);
            setError('Sorry, something went wrong with the creator agent. Please try again.');
        } finally {
            setIsLoading(false);
        }
        return;
    } else if (options.agentSearch) {
        setAgentQuery(query);
        sessionStorage.setItem('agentQuery', query);
        navigate('/agent');
        if (!isTemporaryMode) {
          setRecentSearches(prevSearches => {
            const updatedSearches = [`agent: ${query}`, ...prevSearches.filter(s => s !== `agent: ${query}`)];
            return updatedSearches.slice(0, MAX_RECENT_SEARCHES);
          });
        }
        return;
    } else if (options.pexelsSearch) {
        setIsLoading(true);
        setPexelsQuery(query);
        if (!isTemporaryMode) {
            setRecentSearches(prev => [`media: ${query}`, ...prev.filter(s => s !== `media: ${query}`)].slice(0, MAX_RECENT_SEARCHES));
        }
        try {
            if (!apiKeys.pexels) {
                throw new Error("Pexels API key is missing. Please add it in settings.");
            }
            const ai = new GoogleGenAI({ apiKey: apiKeys.gemini });
            const pexelsParams = await processPexelsQuery(query, apiKeys.gemini);
            const { media, mediaType } = await fetchPexelsMedia(pexelsParams.searchTerm, apiKeys.pexels, pexelsParams.mediaType);
            
            const summaryResponse = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `Provide a short, one-sentence creative caption for a collection of ${pexelsParams.mediaType}s about "${pexelsParams.searchTerm}".`,
            });
            const summary = summaryResponse.text;
    
            const result: PexelsResult = { media, summary, mediaType };
    
            setPexelsResult(result);
            sessionStorage.setItem('pexelsResult', JSON.stringify(result));
            sessionStorage.setItem('pexelsQuery', query);
            navigate('/pexels');
    
        } catch (err) {
            console.error(err);
            setError('Sorry, something went wrong with the media search. Please check your API keys and try again.');
        } finally {
            setIsLoading(false);
        }
        return;
    } else if (options.travelSearch) {
        setIsLoading(true);
        setTravelQuery(query);
        if (!isTemporaryMode) {
          setRecentSearches(prevSearches => {
            const updatedSearches = [`travel: ${query}`, ...prevSearches.filter(s => s !== `travel: ${query}`)];
            return updatedSearches.slice(0, MAX_RECENT_SEARCHES);
          });
        }
        try {
            const result = await fetchTravelPlan(query, apiKeys.gemini);
            setTravelPlan(result);
            sessionStorage.setItem('travelPlan', JSON.stringify(result));
            sessionStorage.setItem('travelQuery', query);
            navigate('/travel-plan');
        } catch (err) {
            console.error(err);
            setError('Sorry, something went wrong planning your trip. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
        return;
    } else if (options.mapSearch) {
        setMapQuery(query);
        sessionStorage.setItem('mapQuery', query);
        navigate('/map');
        if (!isTemporaryMode) {
          setRecentSearches(prevSearches => {
            const updatedSearches = [`map: ${query}`, ...prevSearches.filter(s => s !== `map: ${query}`)];
            return updatedSearches.slice(0, MAX_RECENT_SEARCHES);
          });
        }
        return;
    } else {
        if (!isTemporaryMode) {
          setRecentSearches(prevSearches => {
            const updatedSearches = [query, ...prevSearches.filter(s => s !== query)];
            return updatedSearches.slice(0, MAX_RECENT_SEARCHES);
          });
        }
    }

    const studyMode = summarizationSource ? false : (options.studyMode ?? isStudyMode);

    setIsLoading(true);
    setCurrentQuery(query);
    setIsStudyMode(studyMode);
    
    let fileContent: string | undefined;
    if (summarizationSource) {
      if (summarizationSource.type === 'file') {
        const file = await db.getFile(summarizationSource.id);
        if (file && file.content.type.startsWith('text/')) {
          fileContent = await file.content.text();
        } else if (file) {
          alert(`Cannot summarize this file type: ${file.content.type}. Only text-based files are supported.`);
          setIsLoading(false);
          return;
        }
      } else if (summarizationSource.type === 'note') {
        const note = await db.getNote(summarizationSource.id);
        if (note) {
          fileContent = note.content;
        }
      }
    }


    try {
      const geminiPromise = fetchSearchResults(query, apiKeys.gemini, searchSettings, studyMode, fileContent);
      const youtubePromise = (summarizationSource || !apiKeys.youtube)
        ? Promise.resolve<YouTubeVideo[] | undefined>(undefined)
        : fetchYouTubeVideos(query, apiKeys.youtube);

      const [geminiSettledResult, youtubeSettledResult] = await Promise.allSettled([geminiPromise, youtubePromise]);
      
      if (geminiSettledResult.status === 'rejected') {
        throw geminiSettledResult.reason;
      }
      
      const { estimatedTokens, ...geminiValue } = geminiSettledResult.value;
      const youtubeValue = youtubeSettledResult.status === 'fulfilled' ? youtubeSettledResult.value : undefined;

      const combinedResult: SearchResult = {
        ...geminiValue,
        videos: youtubeValue,
      };

      setSearchResult(combinedResult);
      sessionStorage.setItem('searchResult', JSON.stringify(combinedResult));
      sessionStorage.setItem('currentQuery', query);
      sessionStorage.setItem('isStudyMode', JSON.stringify(studyMode));
      if (summarizationSource) {
        sessionStorage.setItem('summarizationSource', JSON.stringify(summarizationSource));
      } else {
        sessionStorage.removeItem('summarizationSource');
      }

      navigate('/results');

      if (!isTemporaryMode) {
        setProCredits(c => c + 1);
        if (estimatedTokens) {
            setTokenUsage(prev => ({
                ...prev,
                gemini: { tokens: (prev.gemini?.tokens || 0) + estimatedTokens }
            }));
        }
        const newHistoryRecord: HistoryRecord = {
          ...combinedResult,
          query: query,
          timestamp: new Date(),
        };
        await db.addHistoryRecord(newHistoryRecord);
        const updatedHistory = await db.getHistoryRecords();
        setHistory(updatedHistory);
      }
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong. Please check your API key(s) and try again.');
      setCurrentQuery(query); // Keep query for retry
    } finally {
        setIsLoading(false);
    }
  }, [isTemporaryMode, apiKeys, searchSettings, isStudyMode, navigate, summarizationSource, setTokenUsage]);

  const handleGoHome = () => navigate('/search');
  const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
  const handleToggleTemporaryMode = () => setTemporaryMode(prev => !prev);
  const handleClearRecents = () => setRecentSearches([]);
  const handleDeleteRecentSearch = (searchToDelete: string) => {
    setRecentSearches(prevSearches => prevSearches.filter(s => s !== searchToDelete));
  };

  const handleOpenSettingsPage = (section?: string) => {
    setSidebarOpen(false);
    navigate('/settings', { section });
  };
  
  const handleEnterChatMode = (query: string, summary: string) => {
    if (!apiKeys.gemini) {
      setIsOnboarding(true);
      return;
    }
    const ai = new GoogleGenAI({ apiKey: apiKeys.gemini });
    chatRef.current = ai.chats.create({ 
      model: searchSettings.model === 'gemini-2.5-pro' ? 'gemini-2.5-pro' : 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful AI assistant. The user has just performed a search and received a summary. Continue the conversation by answering follow-up questions about the search topic. Be concise, clear, and organize your answers in short sentences.'
      }
    });
    setChatHistory([
      { role: 'user', text: query },
      { role: 'model', text: summary },
    ]);
    setChatModeOpen(true);
  };

  const handleCloseChatMode = () => {
    setChatModeOpen(false);
    setChatHistory([]);
    chatRef.current = null;
  };

  const handleSendChatMessage = async (message: string) => {
    if (isChatLoading || !chatRef.current) return;

    setChatLoading(true);
    const updatedHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: message }];
    setChatHistory(updatedHistory);

    try {
      const response = await chatRef.current.sendMessage({ message });
      const modelResponse = response.text;
      setChatHistory(prev => [...prev, { role: 'model', text: modelResponse }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };
  
  const handleEnterStickerEditMode = () => {
    navigate('/search');
    setStickerEditMode(true);
  }

  const handleAddSticker = (stickerId: string) => {
    const newSticker: StickerInstance = {
      id: `sticker-${Date.now()}`,
      stickerId,
      x: 50 + (Math.random() - 0.5) * 10,
      y: 40 + (Math.random() - 0.5) * 10,
      size: 8 + Math.random() * 2,
    };
    setStickers(prev => [...prev, newSticker]);
  };

  const handleAddCustomSticker = (imageData: string, name: string) => {
    const newCustomSticker: CustomSticker = {
      id: `custom-${Date.now()}`,
      name,
      imageData,
    };
    setCustomStickers(prev => [...prev, newCustomSticker]);
    handleAddSticker(newCustomSticker.id);
    handleEnterStickerEditMode();
  };

  const handleUpdateSticker = (updatedSticker: StickerInstance) => {
    setStickers(prev => prev.map(s => s.id === updatedSticker.id ? updatedSticker : s));
  };

  const handleClearStickers = () => setStickers([]);
  const handleEnterWidgetEditMode = () => { navigate('/search'); setWidgetEditMode(true); };

  const handleAddWidget = (widgetType: WidgetType) => {
    const newWidget: WidgetInstance = {
      id: `${widgetType}-${Date.now()}`,
      widgetType,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50 + (Math.random() - 0.5) * 20,
      data: widgetType === 'note' ? { text: 'Type here...' } : {},
    };
    setWidgets(prev => [...prev, newWidget]);
    handleEnterWidgetEditMode();
  };

  const handleUpdateWidget = (updatedWidget: WidgetInstance) => {
    setWidgets(prev => prev.map(w => w.id === updatedWidget.id ? updatedWidget : w));
  };

  const handleClearWidgets = () => setWidgets([]);
  const handleAgreeToTerms = () => setTermsAgreement('agreed');
  const handleDisagreeToTerms = () => { setTermsAgreement('disagreed'); navigate('/access-denied', { replace: true }); };

  const handleDeleteAllData = () => {
    if (window.confirm('Are you sure you want to delete all app data? This action is irreversible and will reset the application to its default state.')) {
        window.localStorage.clear();
        db.deleteDB().then(() => {
            window.location.reload();
        });
    }
  };

  const handleExportData = () => {
    const exportableData = {
        'ai-api-keys': apiKeys, 'kyndra-ai-theme': theme, 'customWallpaper': customWallpaper, 'isClockVisible': isClockVisible,
        'clockSettings': clockSettings, 'temperatureUnit': temperatureUnit, 'speechLanguage': speechLanguage,
        'searchInputSettings': searchInputSettings, 'searchSettings': searchSettings, 'accessibilitySettings': accessibilitySettings,
        'stickers': stickers, 'widgets': widgets, 'customStickers': customStickers, 'languageSettings': languageSettings,
        'notificationSettings': notificationSettings, 'developerSettings': developerSettings, 'analyticsSettings': analyticsSettings,
        'proCredits': proCredits, 'unlockedProFeatures': unlockedProFeatures, 'tokenUsage': tokenUsage
    };
    const blob = new Blob([JSON.stringify(exportableData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyndra-ai-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUnlockFeature = (featureId: string, cost: number) => {
    if (proCredits >= cost) {
      setProCredits(c => c - cost);
      setUnlockedProFeatures(prev => [...prev, featureId]);
    } else {
      alert("You don't have enough credits to unlock this. Check the Rewards section to see how to earn more!");
    }
  };

  const handleOnboardingComplete = (geminiApiKey: string) => {
    const newApiKeys = { ...apiKeys, gemini: geminiApiKey };
    onApiKeysChange(newApiKeys);
    window.localStorage.setItem('onboardingComplete_v2', 'true');
    setIsOnboarding(false);
  };

  const handleOpenVideoPlayer = (videoId: string, playlist: YouTubeVideo[]) => {
    setVideoPlayerState({ isOpen: true, videoId, playlist });
  };
  const handleCloseVideoPlayer = () => {
    setVideoPlayerState({ isOpen: false, videoId: null, playlist: [] });
  };

  const renderAppContent = () => {
    if (error) {
      const handleRetry = () => {
        setError(null);
        let queryToRetry: string;
        
        if (lastSearchOptions.travelSearch) {
          queryToRetry = travelQuery;
        } else if (lastSearchOptions.mapSearch) {
          queryToRetry = mapQuery;
        } else if (lastSearchOptions.pexelsSearch) {
          queryToRetry = pexelsQuery;
        } else if (lastSearchOptions.creatorSearch) {
            queryToRetry = creatorQuery;
        } else if (lastSearchOptions.researchSearch) {
            queryToRetry = researchQuery;
        } else {
          queryToRetry = currentQuery;
        }
        
        if (!queryToRetry) {
            console.error("No query to retry.");
            handleGoHome();
            return;
        }
        handleSearch(queryToRetry, lastSearchOptions);
      };

      const handleReturnHome = () => {
        setError(null);
        handleGoHome();
      };
      
      return <ErrorState message={error} onRetry={handleRetry} onHome={handleReturnHome} />;
    }

    if (isLoading) return <LoadingState query={loadingQuery} />;
    
    const path = currentPath.split('?')[0];

    const commonProps = {
      isTemporaryMode,
      onToggleSidebar: handleToggleSidebar,
      onToggleTemporaryMode: handleToggleTemporaryMode,
      onOpenSettings: handleOpenSettingsPage,
      userProfile: userProfile,
      onLogout: handleLogout,
    };
    
    if (isMobile) {
        switch(path) {
            case '/results': return searchResult ? <ResultsPage result={searchResult} originalQuery={currentQuery} onSearch={handleSearch} onHome={handleGoHome} onEnterChatMode={handleEnterChatMode} searchInputSettings={searchInputSettings} speechLanguage={speechLanguage} onOpenComingSoonModal={handleOpenComingSoonModal} onOpenLegalPage={(p) => navigate(`/${p}`)} summarizationSource={summarizationSource} onOpenSummarizeSourceSelector={() => setFileSelectorOpen(true)} onClearSummarizationSource={() => setSummarizationSource(null)} onOpenVideoPlayer={handleOpenVideoPlayer} {...commonProps} /> : <LoadingState query={currentQuery}/>;
            case '/research': return deepResearchResult ? <DeepResearchPage result={deepResearchResult} onSearch={handleSearch} onHome={handleGoHome} onOpenLegalPage={(p) => navigate(`/${p}`)} {...commonProps} /> : <LoadingState query={researchQuery} />;
            case '/map': return <MapPage initialQuery={mapQuery} onSearch={(query) => handleSearch(query, { mapSearch: true })} onHome={handleGoHome} geminiApiKey={apiKeys.gemini} onOpenLegalPage={(p) => navigate(`/${p}`)} {...commonProps} />;
            case '/travel-plan': return travelPlan ? <TravelPlanPage plan={travelPlan} originalQuery={travelQuery} onSearch={handleSearch} onHome={handleGoHome} onOpenLegalPage={(p) => navigate(`/${p}`)} {...commonProps} /> : <LoadingState query={travelQuery} />;
            case '/pexels': return pexelsResult ? <PexelsPage initialResult={pexelsResult} originalQuery={pexelsQuery} onSearch={handleSearch} onHome={handleGoHome} {...commonProps} /> : <LoadingState query={pexelsQuery} />;
            case '/agent': return <WebAgentPage initialQuery={agentQuery} geminiApiKey={apiKeys.gemini} onHome={handleGoHome} {...commonProps} onOpenLegalPage={(p) => navigate(`/${p}`)} />;
            case '/creator-ideas': return creatorIdeasResult ? <CreatorIdeasPage result={creatorIdeasResult} onSearch={handleSearch} onHome={handleGoHome} onOpenLegalPage={(p) => navigate(`/${p}`)} geminiApiKey={apiKeys.gemini} {...commonProps} /> : <LoadingState query={creatorQuery} />;
            case '/search':
            case '/history':
            default: return <MobileApp currentPath={path} navigate={navigate} onSearch={handleSearch} history={history} onClearRecents={handleClearRecents} speechLanguage={speechLanguage} onOpenComingSoonModal={handleOpenComingSoonModal} isStudyMode={isStudyMode} setIsStudyMode={setIsStudyMode} summarizationSource={summarizationSource} onOpenSummarizeSourceSelector={() => setFileSelectorOpen(true)} onClearSummarizationSource={() => setSummarizationSource(null)} />;
        }
    }

    // Desktop view
    switch(path) {
      case '/results': return searchResult ? <ResultsPage result={searchResult} originalQuery={currentQuery} onSearch={handleSearch} onHome={handleGoHome} onEnterChatMode={handleEnterChatMode} searchInputSettings={searchInputSettings} speechLanguage={speechLanguage} onOpenComingSoonModal={handleOpenComingSoonModal} onOpenLegalPage={(p) => navigate(`/${p}`)} summarizationSource={summarizationSource} onOpenSummarizeSourceSelector={() => setFileSelectorOpen(true)} onClearSummarizationSource={() => setSummarizationSource(null)} onOpenVideoPlayer={handleOpenVideoPlayer} {...commonProps} /> : <LoadingState query={currentQuery} />;
      case '/research': return deepResearchResult ? <DeepResearchPage result={deepResearchResult} onSearch={handleSearch} onHome={handleGoHome} onOpenLegalPage={(p) => navigate(`/${p}`)} {...commonProps} /> : <LoadingState query={researchQuery} />;
      case '/map': return <MapPage initialQuery={mapQuery} onSearch={(query) => handleSearch(query, { mapSearch: true })} onHome={handleGoHome} geminiApiKey={apiKeys.gemini} onOpenLegalPage={(p) => navigate(`/${p}`)} {...commonProps} />;
      case '/travel-plan': return travelPlan ? <TravelPlanPage plan={travelPlan} originalQuery={travelQuery} onSearch={handleSearch} onHome={handleGoHome} onOpenLegalPage={(p) => navigate(`/${p}`)} {...commonProps} /> : <LoadingState query={travelQuery} />;
      case '/pexels': return pexelsResult ? <PexelsPage initialResult={pexelsResult} originalQuery={pexelsQuery} onSearch={handleSearch} onHome={handleGoHome} {...commonProps} /> : <LoadingState query={pexelsQuery} />;
      case '/agent': return <WebAgentPage initialQuery={agentQuery} geminiApiKey={apiKeys.gemini} onHome={handleGoHome} {...commonProps} onOpenLegalPage={(p) => navigate(`/${p}`)} />;
      case '/creator-ideas': return creatorIdeasResult ? <CreatorIdeasPage result={creatorIdeasResult} onSearch={handleSearch} onHome={handleGoHome} onOpenLegalPage={(p) => navigate(`/${p}`)} geminiApiKey={apiKeys.gemini} {...commonProps} /> : <LoadingState query={creatorQuery} />;
      case '/discover': return <DiscoverPage navigate={navigate} onOpenLegalPage={(p) => navigate(`/${p}`)} apiKeys={apiKeys} onOpenVideoPlayer={handleOpenVideoPlayer} {...commonProps} />;
      case '/history': return <HistoryPage history={history} onSearch={(q) => handleSearch(q, {})} onOpenVideoPlayer={handleOpenVideoPlayer} navigate={navigate} onOpenLegalPage={(p) => navigate(`/${p}`)} {...commonProps} />;
      default:
        const desktopSearchPageProps = {
          onSearch: handleSearch, isClockVisible, clockSettings, stickers, onUpdateSticker: handleUpdateSticker, isStickerEditMode, onExitStickerEditMode: () => setStickerEditMode(false), customStickers, temperatureUnit, widgets, onUpdateWidget: handleUpdateWidget, isWidgetEditMode, onExitWidgetEditMode: () => setWidgetEditMode(false), searchInputSettings, speechLanguage, onOpenLegalPage: (p:any) => navigate(`/${p}`), onOpenComingSoonModal: handleOpenComingSoonModal, isStudyMode, setIsStudyMode, summarizationSource, onOpenSummarizeSourceSelector: () => setFileSelectorOpen(true), onClearSummarizationSource: () => setSummarizationSource(null), navigate, ...commonProps
        };
        return <SearchPage {...desktopSearchPageProps} />;
    }
  };

  const appStyle = { fontSize: `${accessibilitySettings.uiFontSize}%` };
  const appClasses = ['min-h-screen font-sans', isMobile ? 'bg-gray-50 text-gray-900' : 'text-gray-900', !isMobile && !customWallpaper ? theme : '', !isMobile && customWallpaper ? 'bg-gray-100' : '', accessibilitySettings.highContrast ? 'high-contrast' : ''].join(' ');

  const renderRouter = () => {
    const path = currentPath.split('?')[0];
    
    if (isOnboarding && userProfile) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    if (termsAgreement === 'pending') {
      return <TermsPage isInitialPrompt={true} onAgree={handleAgreeToTerms} onDisagree={handleDisagreeToTerms} />;
    }
    if (termsAgreement === 'disagreed') {
      return <AccessDeniedPage onDownloadData={handleExportData} onRemoveData={handleDeleteAllData} />;
    }
    
    if (!userProfile) {
        switch (path) {
            case '/login': return <LoginPage onGoogleSignIn={handleGoogleSignIn} onOpenLegalPage={(p) => navigate(`/${p}`)} onBackToLanding={() => navigate('/')} />;
            case '/':
            default: return <LandingPage onNavigateToLogin={() => navigate('/login')} onOpenLegalPage={(p) => navigate(`/${p}`)} />;
        }
    }
    
    // Logged-in user routes
    switch (path) {
        case '/privacy': return <PrivacyPage onClose={() => window.history.back()} />;
        case '/terms': return <TermsPage isInitialPrompt={false} onClose={() => window.history.back()} />;
        case '/about': return <AboutPage onClose={() => window.history.back()} />;
        case '/settings': return (
            <div className={appClasses} style={appStyle}>
                 <SettingsModal onClose={() => navigate('/search')} initialSection={initialSettingsSection} onOpenLegalPage={(p) => navigate(`/${p}`)} apiKeys={apiKeys} onApiKeysChange={setApiKeys} currentTheme={theme} onThemeChange={setTheme} customWallpaper={customWallpaper} onCustomWallpaperChange={setCustomWallpaper} isClockVisible={isClockVisible} onIsClockVisibleChange={setIsClockVisible} clockSettings={clockSettings} onClockSettingsChange={setClockSettings} temperatureUnit={temperatureUnit} onTemperatureUnitChange={setTemperatureUnit} speechLanguage={speechLanguage} onSpeechLanguageChange={setSpeechLanguage} stickers={stickers} onAddSticker={handleAddSticker} onClearStickers={handleClearStickers} onEnterStickerEditMode={handleEnterStickerEditMode} customStickers={customStickers} onAddCustomSticker={handleAddCustomSticker} widgets={widgets} onAddWidget={handleAddWidget} onClearWidgets={handleClearWidgets} onEnterWidgetEditMode={handleEnterWidgetEditMode} searchInputSettings={searchInputSettings} onSearchInputSettingsChange={setSearchInputSettings} searchSettings={searchSettings} onSearchSettingsChange={setSearchSettings} accessibilitySettings={accessibilitySettings} onAccessibilitySettingsChange={setAccessibilitySettings} languageSettings={languageSettings} onLanguageSettingsChange={setLanguageSettings} notificationSettings={notificationSettings} onNotificationSettingsChange={setNotificationSettings} developerSettings={developerSettings} onDeveloperSettingsChange={setDeveloperSettings} analyticsSettings={analyticsSettings} onAnalyticsSettingsChange={setAnalyticsSettings} proCredits={proCredits} unlockedProFeatures={unlockedProFeatures} onUnlockFeature={handleUnlockFeature} userProfile={userProfile} onLogout={handleLogout} onDeleteAllData={handleDeleteAllData} onExportData={handleExportData} tokenUsage={tokenUsage} onTokenUsageChange={setTokenUsage} />
            </div>
        );
        default:
            return (
                <div className={appClasses} style={{ ...appStyle, ...(customWallpaper && !isMobile ? { backgroundImage: `url(${customWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {}) }}>
                    {showChromeBanner && <ChromeBanner onClose={handleCloseChromeBanner} />}
                    {!isMobile && <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} recentSearches={recentSearches} onSearch={(query) => handleSearch(query, {})} onClear={handleClearRecents} onOpenSettings={handleOpenSettingsPage} userProfile={userProfile} onLogout={handleLogout} proCredits={proCredits} onDeleteRecentSearch={handleDeleteRecentSearch} />}
                    <ChatModal isOpen={isChatModeOpen} onClose={handleCloseChatMode} history={chatHistory} onSendMessage={handleSendChatMessage} isLoading={isChatLoading} />
                    <ComingSoonModal isOpen={isComingSoonModalOpen} onClose={handleCloseComingSoonModal} />
                    <FileSelectorModal isOpen={isFileSelectorOpen} onClose={() => setFileSelectorOpen(false)} files={files} notes={notes} onSelect={handleSelectSummarizationSource} />
                    {videoPlayerState.isOpen && videoPlayerState.videoId && (
                      <VideoPlayerModal
                        initialVideoId={videoPlayerState.videoId}
                        playlist={videoPlayerState.playlist}
                        onClose={handleCloseVideoPlayer}
                        apiKey={apiKeys.youtube}
                      />
                    )}
                    <div className={`${isSidebarOpen || isChatModeOpen || isComingSoonModalOpen || videoPlayerState.isOpen ? 'blur-sm' : ''} transition-filter duration-300 min-h-screen flex flex-col`}>
                    {renderAppContent()}
                    </div>
                </div>
            );
    }
  };

  return renderRouter();
};

const SkeletonLoader: React.FC = () => (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-4">
        <div className="flex space-x-4">
            <div className="w-24 h-16 rounded-lg shimmer"></div>
            <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded shimmer"></div>
                <div className="h-4 w-full rounded shimmer"></div>
                <div className="h-4 w-1/2 rounded shimmer"></div>
            </div>
        </div>
        <div className="h-4 w-full rounded shimmer"></div>
        <div className="h-4 w-5/6 rounded shimmer"></div>
    </div>
);


const LoadingState: React.FC<{query: string}> = ({ query }) => (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center p-4 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full loading-blob" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full loading-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 -left-4 w-72 h-72 bg-violet-300 rounded-full loading-blob" style={{ animationDelay: '4s' }}></div>
        <div className="relative z-10">
            <p className="text-lg text-gray-600">Searching for...</p>
            <p className="mt-1 text-xl font-medium text-black">{query}</p>
            <SkeletonLoader />
        </div>
    </div>
);

const ErrorState: React.FC<{message: string | null; onRetry: () => void; onHome: () => void}> = ({ message, onRetry, onHome }) => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2>
        <p className="mt-2 text-gray-600 max-w-md">{message || 'An unknown error occurred.'}</p>
        <div className="flex gap-4 mt-8">
            <button onClick={onHome} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300">
                Go Home
            </button>
            <button onClick={onRetry} className="px-4 py-2 text-white bg-black rounded-full hover:bg-gray-800">
                Try Again
            </button>
        </div>
      </div>
    </div>
);

export default App;