
import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { OpenAIIcon } from './icons/OpenAIIcon';
import { AnthropicIcon } from './icons/AnthropicIcon';
import { InfoIcon } from './icons/InfoIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CheckIcon } from './icons/CheckIcon';
import { WallpaperIcon } from './icons/WallpaperIcon';
import { KeyIcon } from './icons/KeyIcon';
import { Clock } from './Clock';
import { STICKERS } from './sticker-library';
import type { UserProfile, ClockSettings, CustomSticker, WidgetType, TemperatureUnit, SearchInputSettings, StickerInstance, WidgetInstance, SearchSettings, AccessibilitySettings, LanguageSettings, NotificationSettings, DeveloperSettings, AnalyticsSettings, FileRecord, GithubProfile } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LanguagesIcon } from './icons/LanguagesIcon';
import { ChipIcon } from './icons/ChipIcon';
import { UniversalAccessIcon } from './icons/UniversalAccessIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { AppIconIcon } from './icons/AppIconIcon';
import { GiftIcon } from './icons/GiftIcon';
import { LockIcon } from './icons/LockIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { LinkIcon } from './icons/LinkIcon';
import { MailIcon } from './icons/MailIcon';
import { NotionIcon } from './icons/NotionIcon';
import { SlackIcon } from './icons/SlackIcon';
import { GitHubIcon } from './icons/GitHubIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { LayersIcon } from './icons/LayersIcon';
import { useIsMobile } from '../hooks/useIsMobile';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { CodeIcon } from './icons/CodeIcon';
import { PlaneIcon } from './icons/PlaneIcon';
import { StoreIcon } from './icons/StoreIcon';
import { NewspaperIcon } from './icons/NewspaperIcon';
import { ImageIcon } from './icons/ImageIcon';
import { GoogleIcon } from './icons/GoogleIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { ApifyIcon } from './icons/ApifyIcon';
import { DesignToolIcon } from './icons/DesignToolIcon';
import { ElevenLabsIcon } from './icons/ElevenLabsIcon';
import { FileIcon } from './icons/FileIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LogoIcon } from './icons/LogoIcon';

interface SettingsPageProps {
  onClose: () => void;
  initialSection?: string;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
  apiKeys: { [key: string]: string }; onApiKeysChange: (keys: { [key: string]: string }) => void;
  currentTheme: string; onThemeChange: (theme: string) => void;
  customWallpaper: string | null; onCustomWallpaperChange: (imageData: string | null) => void;
  isClockVisible: boolean; onIsClockVisibleChange: (isVisible: boolean) => void;
  clockSettings: ClockSettings; onClockSettingsChange: (settings: ClockSettings) => void;
  temperatureUnit: TemperatureUnit; onTemperatureUnitChange: (unit: TemperatureUnit) => void;
  speechLanguage: 'en-US' | 'es-ES'; onSpeechLanguageChange: (lang: 'en-US' | 'es-ES') => void;
  stickers: StickerInstance[]; onAddSticker: (stickerId: string) => void; onClearStickers: () => void; onEnterStickerEditMode: () => void;
  customStickers: CustomSticker[]; onAddCustomSticker: (imageData: string, name: string) => void;
  widgets: WidgetInstance[]; onAddWidget: (widgetType: WidgetType) => void; onClearWidgets: () => void; onEnterWidgetEditMode: () => void;
  searchInputSettings: SearchInputSettings; onSearchInputSettingsChange: (settings: SearchInputSettings) => void;
  searchSettings: SearchSettings; onSearchSettingsChange: (settings: SearchSettings) => void;
  accessibilitySettings: AccessibilitySettings; onAccessibilitySettingsChange: (settings: AccessibilitySettings) => void;
  languageSettings: LanguageSettings; onLanguageSettingsChange: (settings: LanguageSettings) => void;
  notificationSettings: NotificationSettings; onNotificationSettingsChange: (settings: NotificationSettings) => void;
  developerSettings: DeveloperSettings; onDeveloperSettingsChange: (settings: DeveloperSettings) => void;
  analyticsSettings: AnalyticsSettings; onAnalyticsSettingsChange: (settings: AnalyticsSettings) => void;
  proCredits: number;
  unlockedProFeatures: string[];
  onUnlockFeature: (featureId: string, cost: number) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onDeleteAllData: () => void;
  onExportData: () => void;
  tokenUsage: { [key: string]: { tokens: number } };
  onTokenUsageChange: (usage: { [key: string]: { tokens: number } }) => void;
  files: FileRecord[];
  onFileUpload: (file: File) => void;
  onDeleteFile: (id: number) => void;
  githubProfile: GithubProfile | null;
  onDisconnectGithub: () => void;
  onOpenGithubTokenModal: () => void;
  dailyCredits: number;
}

const AI_PROVIDERS = [
    { id: 'gemini', name: 'Google Gemini', Icon: GoogleIcon, description: 'The core model powering Kyndra AI. Get your key from Google AI Studio.', placeholder: 'Enter your Google Gemini API key', getLink: 'https://aistudio.google.com/app/apikey' },
    { id: 'elevenlabs', name: 'ElevenLabs', Icon: ElevenLabsIcon, description: 'High-quality text-to-speech voices for AI Labs. Get your key from your ElevenLabs profile.', placeholder: 'Enter your ElevenLabs API key', getLink: 'https://elevenlabs.io' },
    { id: 'youtube', name: 'YouTube Data API', Icon: YouTubeIcon, description: 'Required for the video search feature. Get your key from the Google Cloud Console.', placeholder: 'Enter your YouTube Data v3 API key', getLink: 'https://console.cloud.google.com/apis/library/youtube.googleapis.com' },
    { id: 'pexels', name: 'Pexels API', Icon: ImageIcon, description: 'Required for the media search feature. Get a free key from the Pexels website.', placeholder: 'Enter your Pexels API key', getLink: 'https://www.pexels.com/api/' },
    { id: 'apify', name: 'Apify', Icon: ApifyIcon, description: 'Required for TikTok video integration. Get your token from your Apify account settings.', placeholder: 'Enter your Apify API token', getLink: 'https://console.apify.com/account/integrations' },
    { id: 'streamline', name: 'StreamlineHQ', Icon: DesignToolIcon, description: 'Required for illustrations in the Design Engine. Get your key from the Streamline dashboard.', placeholder: 'Enter your Streamline API key', getLink: 'https://app.streamlinehq.com/account/api' },
    { id: 'openai', name: 'OpenAI', Icon: OpenAIIcon, description: 'You can find your OpenAI API key on your OpenAI account page.', placeholder: 'Enter your OpenAI API key (e.g., sk-...)', getLink: 'https://platform.openai.com/api-keys' },
    { id: 'anthropic', name: 'Anthropic', Icon: AnthropicIcon, description: 'Access your Anthropic API key from the Anthropic console settings.', placeholder: 'Enter your Anthropic API key', getLink: 'https://console.anthropic.com/settings/keys' },
];

const PRO_FEATURES_COSTS: { [key: string]: number } = {
  'upload-custom-wallpaper': 50, 'upload-custom-sticker': 50,
  'liquid-glass': 15, 'neon': 15, 'gold': 15, 'ruby': 15, 'sapphire': 15, 'emerald': 15,
  'press-start': 15, 'orbitron': 15, 'elite': 15,
};

const navItems = [
    { category: 'Personalization', items: [
        { id: 'appearance', name: 'Appearance', Icon: WallpaperIcon },
        { id: 'homepage-elements', name: 'Homepage', Icon: AppIconIcon },
    ]},
    { category: 'AI & Search', items: [
        { id: 'api-keys', name: 'API Keys', Icon: KeyIcon },
        { id: 'context', name: 'Context', Icon: DatabaseIcon },
        { id: 'api-usage', name: 'API Usage', Icon: BarChartIcon },
        { id: 'search-settings', name: 'Search Settings', Icon: ChipIcon },
        { id: 'connected-apps', name: 'Connected Apps', Icon: LinkIcon },
        { id: 'speech-language', name: 'Speech & Language', Icon: LanguagesIcon },
    ]},
    { category: 'Account & Data', items: [
        { id: 'rewards-store', name: 'Credits & Rewards', Icon: GiftIcon },
        { id: 'data-management', name: 'Manage Data', Icon: DatabaseIcon },
        { id: 'accessibility', name: 'Accessibility', Icon: UniversalAccessIcon },
    ]},
    { category: 'About', items: [
        { id: 'about-kyndra-ai', name: 'About Kyndra AI', Icon: InfoIcon },
        { id: 'legal', name: 'Terms & Privacy', Icon: FileIcon },
    ]}
];

const wallpapers = {
  Default: [
    { name: 'Studio', class: 'bg-studio' },
    { name: 'White', class: 'bg-white' },
  ]
};
const clockThemes = [{ id: 'classic', name: 'Classic', darkClass: 'bg-[#006A4E]', lightClass: 'bg-[#7FFFD4]' },{ id: 'mint', name: 'Mint', darkClass: 'bg-emerald-700', lightClass: 'bg-green-300' },{ id: 'peach', name: 'Peach', darkClass: 'bg-orange-600', lightClass: 'bg-amber-300' },{ id: 'mono', name: 'Mono', darkClass: 'bg-black', lightClass: 'bg-gray-400' },{ id: 'ocean', name: 'Ocean', darkClass: 'bg-blue-800', lightClass: 'bg-sky-400' },{ id: 'sunset', name: 'Sunset', darkClass: 'bg-purple-800', lightClass: 'bg-orange-400' },{ id: 'forest', name: 'Forest', darkClass: 'bg-green-900', lightClass: 'bg-lime-500' },{ id: 'neon', name: 'Neon', darkClass: 'bg-pink-500', lightClass: 'bg-cyan-300' },{ id: 'candy', name: 'Candy', darkClass: 'bg-red-500', lightClass: 'bg-yellow-300' },{ id: 'liquid-glass', name: 'Liquid Glass', darkClass: 'bg-gray-400/30 border border-white/20', lightClass: 'bg-gray-100/30 border border-white/20' },{ id: 'espresso', name: 'Espresso', darkClass: 'bg-[#4a2c2a]', lightClass: 'bg-[#f5e8d7]' },{ id: 'cherry', name: 'Cherry', darkClass: 'bg-[#b24a69]', lightClass: 'bg-[#ffd1e2]' },{ id: 'lavender', name: 'Lavender', darkClass: 'bg-[#6a5acd]', lightClass: 'bg-[#e6e6fa]' },{ id: 'gold', name: 'Gold', darkClass: 'bg-[#b1740f]', lightClass: 'bg-[#fde488]' },{ id: 'ruby', name: 'Ruby', darkClass: 'bg-[#8b0000]', lightClass: 'bg-[#ffc0cb]' },{ id: 'sapphire', name: 'Sapphire', darkClass: 'bg-[#0f52ba]', lightClass: 'bg-[#add8e6]' },{ id: 'emerald', name: 'Emerald', darkClass: 'bg-[#006400]', lightClass: 'bg-[#98ff98]' },{ id: 'graphite', name: 'Graphite', darkClass: 'bg-[#36454f]', lightClass: 'bg-[#d3d3d3]' },{ id: 'coral', name: 'Coral', darkClass: 'bg-[#ff4500]', lightClass: 'bg-[#ffdab9]' },{ id: 'sky', name: 'Sky', darkClass: 'bg-[#55a0d3]', lightClass: 'bg-[#c6f1ff]' },];
const WallpaperSwatch: React.FC<{ themeClass: string; isSelected: boolean; onClick: () => void; name: string }> = ({ themeClass, isSelected, onClick, name }) => ( <button onClick={onClick} className={`w-full h-24 rounded-lg border-2 transition-all relative overflow-hidden ${isSelected ? 'border-black scale-105' : 'border-transparent hover:border-gray-300'}`} aria-label={`Select theme: ${name}`}> <div className={`w-full h-full rounded-md flex items-center justify-center ${themeClass} bg-cover bg-center`}> {isSelected && ( <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white z-10"> <CheckIcon /> </div> )} <span className={`absolute bottom-2 left-2 text-xs font-bold px-2 py-1 rounded ${themeClass === 'bg-white' ? 'bg-gray-100 text-black' : 'bg-black/50 text-white'}`}>{name}</span></div> </button> );
const ClockThemeSwatch: React.FC<{ theme: { id: string, name: string, darkClass: string, lightClass: string }, isSelected: boolean, onClick: () => void }> = ({ theme, isSelected, onClick }) => ( <button onClick={onClick} className={`p-2 rounded-xl border-2 w-full text-left ${isSelected ? 'border-black' : 'border-gray-200 hover:border-gray-300'}`}> <div className="flex items-center space-x-2"> <div className={`w-6 h-6 rounded-full ${theme.darkClass}`}></div> <div className={`w-6 h-6 rounded-full ${theme.lightClass}`}></div> <span className="text-sm font-medium text-gray-800">{theme.name}</span> </div> </button> );

const SettingsCard: React.FC<{title: string, description: string, children: React.ReactNode}> = ({title, description, children}) => (
    <div className="bg-white border border-gray-200 rounded-2xl">
        <div className="p-6 border-b">
            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};


export const SettingsModal: React.FC<SettingsPageProps> = ({ onClose, initialSection, onOpenLegalPage, apiKeys, onApiKeysChange, currentTheme, onThemeChange, customWallpaper, onCustomWallpaperChange, isClockVisible, onIsClockVisibleChange, clockSettings, onClockSettingsChange, temperatureUnit, onTemperatureUnitChange, speechLanguage, onSpeechLanguageChange, stickers, onAddSticker, onClearStickers, onEnterStickerEditMode, customStickers, onAddCustomSticker, widgets, onAddWidget, onClearWidgets, onEnterWidgetEditMode, searchInputSettings, onSearchInputSettingsChange, searchSettings, onSearchSettingsChange, accessibilitySettings, onAccessibilitySettingsChange, analyticsSettings, onAnalyticsSettingsChange, proCredits, unlockedProFeatures, onUnlockFeature, userProfile, onLogout, onDeleteAllData, onExportData, tokenUsage, onTokenUsageChange, files, onFileUpload, onDeleteFile, githubProfile, onDisconnectGithub, onOpenGithubTokenModal, dailyCredits }) => {
  const [activeSection, setActiveSection] = useState(initialSection || 'appearance');
  const [stickerSearch, setStickerSearch] = useState('');
  const stickerFileInputRef = useRef<HTMLInputElement>(null);
  const wallpaperFileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'nav' | 'content'>('nav');

  useEffect(() => {
    if (initialSection) {
        setActiveSection(initialSection);
        if (isMobile) {
            setMobileView('content');
        }
    }
  }, [initialSection, isMobile]);

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isMobile) {
        setMobileView('content');
    }
  };

  const handleAddStickerAndEdit = (stickerId: string) => { onAddSticker(stickerId); onEnterStickerEditMode(); };
  const handleUploadStickerClick = () => { stickerFileInputRef.current?.click(); };
  const handleUploadWallpaperClick = () => { wallpaperFileInputRef.current?.click(); };

  const handleStickerFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file (PNG, JPG, GIF, etc.).'); return; }
    if (file.size > 2 * 1024 * 1024) { alert('File size should not exceed 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      onAddCustomSticker(reader.result as string, file.name.split('.').slice(0, -1).join('.') || 'My Sticker');
    };
    reader.onerror = () => alert('Sorry, there was an error uploading your sticker.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleWallpaperFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File size should not exceed 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
        onCustomWallpaperChange(reader.result as string);
        onThemeChange('bg-white');
    };
    reader.onerror = () => alert('Sorry, there was an error uploading your wallpaper.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };
  
  const handleImportClick = () => { importFileInputRef.current?.click(); };

  const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target?.result as string);
            if (data['ai-api-keys']) onApiKeysChange(data['ai-api-keys']);
            if (data['kyndra-ai-theme']) onThemeChange(data['kyndra-ai-theme']);
            onCustomWallpaperChange(data['customWallpaper'] || null);
            if (typeof data['isClockVisible'] === 'boolean') onIsClockVisibleChange(data['isClockVisible']);
            if (data['clockSettings']) onClockSettingsChange(data['clockSettings']);
            if (data['temperatureUnit']) onTemperatureUnitChange(data['temperatureUnit']);
            if (data['speechLanguage']) onSpeechLanguageChange(data['speechLanguage']);
            if (data['searchInputSettings']) onSearchInputSettingsChange(data['searchInputSettings']);
            if (data['searchSettings']) onSearchSettingsChange(data['searchSettings']);
            if (data['accessibilitySettings']) onAccessibilitySettingsChange(data['accessibilitySettings']);
            if (data['analyticsSettings']) onAnalyticsSettingsChange(data['analyticsSettings']);
            alert('Settings imported successfully!');
        } catch (error) {
            alert('Failed to import settings. The file may be invalid or corrupted.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        Array.from(event.target.files).forEach(onFileUpload);
    }
  };
  
  const ProFeatureWrapper: React.FC<{featureId: string, children: React.ReactNode}> = ({ featureId, children }) => {
    const cost = PRO_FEATURES_COSTS[featureId];
    if (cost === undefined || unlockedProFeatures.includes(featureId)) return <>{children}</>;
  
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none">{children}</div>
        <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center rounded-lg">
          <button onClick={() => onUnlockFeature(featureId, cost)} className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-transform hover:scale-105 disabled:bg-gray-400" disabled={proCredits < cost}>
            <LockIcon className="w-4 h-4" /> <span>Unlock for {cost}</span> <GiftIcon className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    );
  };
  
  const activeSectionDetails = navItems.flatMap(c => c.items).find(i => i.id === activeSection);

  const renderContent = () => {
    switch(activeSection) {
        case 'rewards-store': return (
             <div className="space-y-8">
                <div className="relative w-full max-w-md mx-auto aspect-[1.6/1] rounded-2xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
                    {userProfile?.isPro ? (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white flex flex-col justify-between">
                             <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
                                        <LogoIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-bold tracking-tight text-lg">Kyndra AI</span>
                                </div>
                                <span className="px-3 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full">PRO</span>
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-8 h-5 bg-yellow-500/20 rounded flex items-center justify-center border border-yellow-500/50">
                                        <div className="w-5 h-3 border-2 border-yellow-500 rounded-sm"></div>
                                    </div>
                                    <span className="font-mono text-lg tracking-widest opacity-80">•••• ••••</span>
                                </div>
                                <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">UNLIMITED</p>
                                <p className="text-xs text-gray-400 mt-1">Credits Remaining</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Card Holder</p>
                                    <p className="font-medium tracking-wide">{userProfile?.name || 'User'}</p>
                                </div>
                                <SparklesIcon className="w-6 h-6 text-purple-400" />
                            </div>
                             {/* Shine effect */}
                            <div className="absolute top-0 -inset-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 p-6 text-white flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/20">
                                        <LogoIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-bold tracking-tight text-lg">Kyndra AI</span>
                                </div>
                                <span className="px-3 py-1 bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/30">Free</span>
                            </div>
                             <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center border border-white/30">
                                        <div className="w-5 h-3 border-2 border-white/50 rounded-sm"></div>
                                    </div>
                                    <span className="font-mono text-lg tracking-widest opacity-80">•••• ••••</span>
                                </div>
                                <p className="text-4xl font-bold">{dailyCredits}</p>
                                <p className="text-xs text-blue-100 mt-1">Daily Credits Remaining (Resets daily)</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-blue-200 uppercase tracking-widest mb-0.5">Card Holder</p>
                                    <p className="font-medium tracking-wide">{userProfile?.name || 'User'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {!userProfile?.isPro && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Pro</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">Unlock unlimited searches, GitHub integration, and all search modes without daily limits.</p>
                        <a href="https://buy.polar.sh/polar_cl_PgUSah1HN8TPbImrWmo79oksFVegpUlMayl0y1Eqb7" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-black rounded-full hover:bg-gray-800 hover:scale-105 transition-all shadow-lg">
                            Get Pro for $10/mo
                        </a>
                        <p className="text-xs text-gray-400 mt-4">Secure payment via Polar.sh</p>
                    </div>
                )}
             </div>
        );
        case 'appearance': return (
            <div className="space-y-6">
                <SettingsCard title="Custom Wallpaper" description="Upload your own image to use as a background.">
                    <div className="grid grid-cols-2 gap-4">
                        <ProFeatureWrapper featureId="upload-custom-wallpaper">
                            <button onClick={handleUploadWallpaperClick} className="w-full h-24 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 flex flex-col items-center justify-center transition-colors">
                                <UploadCloudIcon className="w-6 h-6 mb-1" /> <span className="text-xs font-semibold">Upload Your Own</span>
                            </button>
                        </ProFeatureWrapper>
                        {customWallpaper && (
                            <div className="relative">
                                <button className="w-full h-24 rounded-xl border-2 border-black">
                                    <div className="w-full h-full rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${customWallpaper})` }}>
                                        <div className="w-full h-full rounded-lg flex items-center justify-center bg-black/20"> <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"> <CheckIcon /> </div> </div>
                                    </div>
                                </button>
                                <button onClick={() => onCustomWallpaperChange(null)} className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600" aria-label="Remove custom wallpaper"><TrashIcon /></button>
                            </div>
                        )}
                    </div>
                </SettingsCard>
                <SettingsCard title="Background" description="Choose a background for the application.">
                    {Object.entries(wallpapers).map(([category, themeList]) => (
                        <div key={category} className="mb-4 last:mb-0">
                            <div className="grid grid-cols-2 gap-4">
                                {themeList.map(theme => (
                                    <WallpaperSwatch key={theme.class} themeClass={theme.class} name={theme.name} isSelected={currentTheme === theme.class && !customWallpaper} onClick={() => { onThemeChange(theme.class) ; onCustomWallpaperChange(null) }} />
                                ))}
                            </div>
                        </div>
                    ))}
                </SettingsCard>
            </div>
        );
        case 'homepage-elements': return (
            <div className="space-y-6">
                <SettingsCard title="Clock" description="Personalize the clock displayed on the home screen.">
                    <div className="flex items-center justify-between mb-4">
                        <label htmlFor="clock-toggle" className="font-medium text-gray-700">Show home screen clock</label>
                        <button id="clock-toggle" role="switch" aria-checked={isClockVisible} onClick={() => onIsClockVisibleChange(!isClockVisible)} className={`${isClockVisible ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}><span className={`${isClockVisible ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /></button>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-8 my-6 flex items-center justify-center min-h-[200px] overflow-hidden"><Clock settings={clockSettings} temperatureUnit={temperatureUnit} /></div>
                    <h4 className="font-medium text-gray-800 mb-3">Style</h4> <div className="grid grid-cols-3 gap-4"> <button onClick={() => onClockSettingsChange({ ...clockSettings, style: 'horizontal' })} className={`p-4 border rounded-full text-center transition-colors ${clockSettings.style === 'horizontal' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}> Horizontal </button> <button onClick={() => onClockSettingsChange({ ...clockSettings, style: 'stacked' })} className={`p-4 border rounded-full text-center transition-colors ${clockSettings.style === 'stacked' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}> Stacked </button> <button onClick={() => onClockSettingsChange({ ...clockSettings, style: 'diagonal' })} className={`p-4 border rounded-full text-center transition-colors ${clockSettings.style === 'diagonal' ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}> Diagonal </button> </div>
                    <h4 className="font-medium text-gray-800 mb-3 mt-4">Theme</h4> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {clockThemes.map(theme => { const isPro = PRO_FEATURES_COSTS[theme.id] !== undefined; const swatch = <ClockThemeSwatch key={theme.id} theme={theme} isSelected={clockSettings.theme === theme.id} onClick={() => onClockSettingsChange({ ...clockSettings, theme: theme.id as ClockSettings['theme'] })} />; return isPro ? <ProFeatureWrapper key={theme.id} featureId={theme.id}>{swatch}</ProFeatureWrapper> : swatch; })} </div>
                </SettingsCard>
                <SettingsCard title="Stickers" description="Add some flair to your home screen! Click a sticker to add it, or upload your own.">
                    <div className="flex space-x-2 mb-4">
                        <button onClick={onEnterStickerEditMode} className="w-full px-4 py-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full hover:bg-gray-200"> Arrange Stickers </button>
                        <ProFeatureWrapper featureId="upload-custom-sticker"><button onClick={handleUploadStickerClick} className="w-full px-4 py-3 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800"> Upload Your Own </button></ProFeatureWrapper>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">{STICKERS.map(sticker => ( <button key={sticker.id} onClick={() => handleAddStickerAndEdit(sticker.id)} className="p-2 bg-gray-100 rounded-lg flex flex-col items-center justify-center space-y-1 hover:bg-gray-200 transition-colors aspect-square" title={`Add ${sticker.name} sticker`}> <span className="text-4xl">{sticker.id}</span> <span className="text-xs text-gray-600 truncate">{sticker.name}</span> </button> ))}</div>
                    <button onClick={onClearStickers} className="mt-4 w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100"> Clear All Stickers </button>
                </SettingsCard>
            </div>
        );
        case 'api-keys': return (
            <div className="space-y-6">
                <p className="text-sm text-gray-600 text-center bg-gray-100 p-4 rounded-xl">Your keys are stored securely in your browser's local storage and are never sent to our servers.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {AI_PROVIDERS.map(provider => (
                        <div key={provider.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-3">
                                    <provider.Icon className="w-6 h-6" />
                                    <h4 className="font-bold text-gray-800">{provider.name}</h4>
                                </div>
                                <a href={provider.getLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Get key &rarr;</a>
                            </div>
                            <p className="text-xs text-gray-500 mb-4 flex-grow">{provider.description}</p>
                            <input type="password" value={apiKeys[provider.id] || ''} onChange={(e) => onApiKeysChange({ ...apiKeys, [provider.id]: e.target.value })} placeholder={provider.placeholder} className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm" />
                        </div>
                    ))}
                </div>
            </div>
        );
        case 'context': return (
            <div className="space-y-6">
                <SettingsCard title="Manage Context" description="Upload files for the AI to use as a knowledge base. You can select these files using the 'Search Pilot' button on the home page.">
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*, .pdf, .txt, .md, .csv, .json, .html, .xml, .doc, .docx, .xls, .xlsx, .ppt, .pptx" />
                    <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-black text-white rounded-full font-medium text-sm hover:bg-gray-800"><UploadCloudIcon className="w-5 h-5" /><span>Upload Files</span></button>
                    <div className="mt-6 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-600">Uploaded Files</h4>
                        {files.length > 0 ? files.map(file => (
                            <div key={file.id} className="group flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                                <div className="flex items-center space-x-3 min-w-0">
                                    <FileIcon className="w-6 h-6 text-gray-500 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                                    </div>
                                </div>
                                <button onClick={() => onDeleteFile(file.id)} className="p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"><TrashIcon /></button>
                            </div>
                        )) : <p className="text-center text-gray-500 py-8">No files uploaded yet.</p>}
                    </div>
                </SettingsCard>
            </div>
        );
        case 'api-usage':
            const geminiTokens = tokenUsage.gemini?.tokens || 0;
            const geminiCost = (geminiTokens / 1_000_000) * 0.30;
            const tokensTowardMillion = geminiTokens % 1_000_000;
            const progressPercent = (tokensTowardMillion / 1_000_000) * 100;

            return (
                <SettingsCard title="API Usage" description="Track your estimated token usage for connected AI providers. This is a local estimate and may differ from your actual bill.">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <GoogleIcon className="w-6 h-6" />
                                <h4 className="font-bold text-gray-800">Google Gemini</h4>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-xl space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm font-medium text-gray-600">
                                        <span>Tokens Used</span>
                                        <span>{geminiTokens.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-gray-600">
                                        <span>Estimated Cost</span>
                                        <span>${geminiCost.toFixed(4)}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Progress to next 1M tokens</span>
                                        <span>{progressPercent.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">Based on a rate of $0.30 per 1 million tokens.</p>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to reset your local usage stats? This cannot be undone.')) {
                                        onTokenUsageChange({ ...tokenUsage, gemini: { tokens: 0 } });
                                    }
                                }}
                                className="mt-4 text-xs text-red-600 hover:underline"
                            >
                                Reset Usage Stats
                            </button>
                        </div>
                    </div>
                </SettingsCard>
            );
        case 'search-settings': return (
            <div className="space-y-6">
                <SettingsCard title="Primary AI Model" description="Choose the model that powers your searches.">
                    <select value={searchSettings.model} onChange={(e) => onSearchSettingsChange({ ...searchSettings, model: e.target.value as 'gemini-2.5-flash' | 'gemini-3.0' })} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-sm">
                        <option value="gemini-3.0">Gemini 3.0 (New & Powerful)</option>
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast & Efficient)</option>
                    </select>
                </SettingsCard>
                 <SettingsCard title="Web Search" description="Allows the AI to access up-to-date information from Google Search.">
                    <div className="flex items-center justify-between">
                        <label htmlFor="web-search-toggle" className="font-medium text-gray-700">Enable Web Search</label>
                        <button id="web-search-toggle" role="switch" aria-checked={searchSettings.useWebSearch} onClick={() => onSearchSettingsChange({ ...searchSettings, useWebSearch: !searchSettings.useWebSearch })} className={`${searchSettings.useWebSearch ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}><span className={`${searchSettings.useWebSearch ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /></button>
                    </div>
                 </SettingsCard>
                 <SettingsCard title="Search Modes" description="Activate different modes from the search bar to tailor your experience.">
                    <ul className="space-y-4">
                        <li className="flex items-start space-x-3">
                            <SearchIcon className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
                            <div>
                                <h5 className="font-semibold text-gray-800">Standard Mode</h5>
                                <p className="text-sm text-gray-600">Your default, fast search experience for quick summaries and links.</p>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <BookOpenIcon className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
                            <div>
                                <h5 className="font-semibold text-gray-800">Study Mode</h5>
                                <p className="text-sm text-gray-600">Generates flashcards and quizzes to help you learn and retain information.</p>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <MapPinIcon className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
                            <div>
                                <h5 className="font-semibold text-gray-800">Map Mode</h5>
                                <p className="text-sm text-gray-600">Find and explore places with AI-powered location summaries.</p>
                            </div>
                        </li>
                         <li className="flex items-start space-x-3">
                            <PlaneIcon className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
                            <div>
                                <h5 className="font-semibold text-gray-800">Travel Planner</h5>
                                <p className="text-sm text-gray-600">Generates a complete travel itinerary with suggestions for flights, hotels, and activities.</p>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <ImageIcon className="w-5 h-5 mt-0.5 text-gray-500 flex-shrink-0" />
                            <div>
                                <h5 className="font-semibold text-gray-800">Media Search</h5>
                                <p className="text-sm text-gray-600">Finds royalty-free images and videos for your projects from Pexels.</p>
                            </div>
                        </li>
                    </ul>
                 </SettingsCard>
            </div>
        );
        case 'connected-apps': return (
            <div className="space-y-6">
                <SettingsCard title="Connected Apps" description="Search across your favorite apps and services.">
                    <div className="space-y-4">
                        {githubProfile ? (
                            <div className="p-4 bg-gray-100 rounded-xl flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <GitHubIcon className="w-8 h-8 text-gray-800" />
                                    <div className="flex items-center space-x-3">
                                        <img src={githubProfile.avatar_url} alt={githubProfile.login} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h5 className="font-semibold text-gray-800">{githubProfile.name}</h5>
                                            <p className="text-xs text-gray-500">{githubProfile.login}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={onDisconnectGithub} className="px-4 py-1.5 text-sm font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200">
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center space-x-4">
                                    <GitHubIcon className="w-8 h-8 text-gray-500" />
                                    <div>
                                        <h5 className="font-semibold text-gray-800">GitHub</h5>
                                        <p className="text-xs text-gray-500">Search code, issues, and PRs with AI.</p>
                                    </div>
                                </div>
                                <button onClick={onOpenGithubTokenModal} className="px-4 py-1.5 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800">
                                    Connect
                                </button>
                            </div>
                        )}
                       
                        {[
                            { Icon: MailIcon, name: 'Gmail', description: 'Summarize emails and find attachments without leaving the search bar.' },
                            { Icon: NotionIcon, name: 'Notion', description: 'Instantly find notes, documents, and database entries.' },
                            { Icon: SlackIcon, name: 'Slack', description: 'Search through conversations and shared files.' },
                        ].map(app => (
                            <div key={app.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl opacity-60">
                                <div className="flex items-center space-x-4">
                                    <app.Icon className="w-8 h-8 text-gray-500" />
                                    <div>
                                        <h5 className="font-semibold text-gray-800">{app.name}</h5>
                                        <p className="text-xs text-gray-500">{app.description}</p>
                                    </div>
                                </div>
                                <button disabled className="px-4 py-1.5 text-sm font-medium text-gray-500 bg-gray-200 rounded-full cursor-not-allowed">
                                    Connect
                                </button>
                            </div>
                        ))}
                    </div>
                </SettingsCard>
            </div>
        );
        case 'accessibility': return (
             <div className="space-y-6">
                <SettingsCard title="UI Font Size" description="Adjust the font size for better readability.">
                    <div className="flex items-center space-x-4 mt-2">
                        <input id="font-size-slider" type="range" min="80" max="120" step="5" value={accessibilitySettings.uiFontSize} onChange={(e) => onAccessibilitySettingsChange({ ...accessibilitySettings, uiFontSize: parseInt(e.target.value) })} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <span className="font-mono text-sm text-gray-600 w-20 text-right">{accessibilitySettings.uiFontSize}%</span>
                    </div>
                </SettingsCard>
                <SettingsCard title="High Contrast Mode" description="Increases color contrast throughout the app for better visibility.">
                    <div className="flex items-center justify-between">
                        <label htmlFor="high-contrast-toggle" className="font-medium text-gray-700">Enable High Contrast</label>
                        <button id="high-contrast-toggle" role="switch" aria-checked={accessibilitySettings.highContrast} onClick={() => onAccessibilitySettingsChange({ ...accessibilitySettings, highContrast: !accessibilitySettings.highContrast })} className={`${accessibilitySettings.highContrast ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}><span className={`${accessibilitySettings.highContrast ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /></button>
                    </div>
                </SettingsCard>
            </div>
        );
        case 'data-management': return (
             <div className="space-y-6">
                <input type="file" ref={importFileInputRef} onChange={handleImportFileChange} accept=".json" className="hidden" aria-hidden="true" />
                <SettingsCard title="Import / Export Data" description="Export your settings for backup or import them to a new device.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={onExportData} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800">Export Data</button>
                        <button onClick={handleImportClick} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300">Import Data</button>
                    </div>
                </SettingsCard>
                <SettingsCard title="Usage Analytics" description="Help us improve Kyndra AI by sharing anonymous usage data.">
                    <div className="flex items-center justify-between">
                        <label htmlFor="analytics-toggle" className="font-medium text-gray-700">Enable Anonymous Analytics</label>
                        <button id="analytics-toggle" role="switch" aria-checked={analyticsSettings.enabled} onClick={() => onAnalyticsSettingsChange({ ...analyticsSettings, enabled: !analyticsSettings.enabled })} className={`${analyticsSettings.enabled ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}><span className={`${analyticsSettings.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /></button>
                    </div>
                </SettingsCard>
                 <div className="p-6 border border-red-300 bg-red-50 rounded-2xl">
                    <h4 className="font-bold text-red-800">Danger Zone</h4>
                    <p className="mt-1 text-sm text-red-700"> This will permanently delete all your settings, API keys, recent searches, stickers, and widgets from your browser's storage. </p>
                    <button onClick={onDeleteAllData} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700"> Delete All Data </button>
                </div>
            </div>
        )
        case 'legal': return (
            <div className="space-y-4">
                <button onClick={() => onOpenLegalPage('terms')} className="w-full text-left p-4 bg-white border rounded-full hover:bg-gray-50">Terms of Service</button>
                <button onClick={() => onOpenLegalPage('privacy')} className="w-full text-left p-4 bg-white border rounded-full hover:bg-gray-50">Privacy Policy</button>
            </div>
        );
        case 'about-kyndra-ai': return (
            <div className="text-center p-6">
                <h3 className="text-2xl font-bold text-gray-800">About Kyndra AI</h3>
                <p className="mt-2 text-gray-600">Your intelligent gateway to the web.</p>
                <div className="mt-6 text-left prose prose-sm max-w-none text-gray-700">
                    <p>Kyndra AI is designed to give you quick, summarized answers to your questions, backed by reliable sources from the web. Our mission is to streamline your access to information, cutting through the noise to deliver what you need, when you need it.</p>
                    <p>For questions or support, please contact us at <a href="mailto:wolfsisupport@gmail.com">wolfsisupport@gmail.com</a>.</p>
                </div>
            </div>
        )
        default: return null;
    }
  }

  const headerTitle = isMobile && mobileView === 'nav' ? 'Settings' : activeSectionDetails?.name || 'Settings';
  const showBackButton = isMobile && mobileView === 'content';

  return (
    <div className="flex h-screen w-full bg-gray-50 font-sans flex-col md:flex-row">
        <input type="file" ref={stickerFileInputRef} onChange={handleStickerFileChange} accept="image/*" className="hidden" />
        <input type="file" ref={wallpaperFileInputRef} onChange={handleWallpaperFileChange} accept="image/*" className="hidden" />
        <input type="file" ref={importFileInputRef} onChange={handleImportFileChange} accept=".json" className="hidden" />

        <nav className={`flex-col md:w-80 md:flex-shrink-0 bg-white border-r ${isMobile && mobileView === 'content' ? 'hidden' : 'flex'} ${isMobile ? 'w-full' : ''}`}>
            <div className="p-6 border-b hidden md:block">
                <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                {navItems.map(({ category, items }) => (
                    <div key={category}>
                        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{category}</p>
                        <div className="mt-2 space-y-1">
                            {items.map(item => (
                                <button key={item.id} onClick={() => handleNavClick(item.id)} className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left text-sm font-medium transition-colors ${ activeSection === item.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100/50' }`}>
                                    <item.Icon className="w-5 h-5 flex-shrink-0" />
                                    <span>{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {userProfile && (
                <div className="p-4 border-t">
                    <div className="flex items-center space-x-3">
                        <img src={userProfile.picture} alt={userProfile.name} className="w-10 h-10 rounded-full" />
                        <div className="flex-grow min-w-0">
                            <p className="font-semibold text-sm truncate">{userProfile.name}</p>
                            <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                        </div>
                        <button onClick={onLogout} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Sign Out">
                            <LogoutIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </nav>

        <div className={`flex-1 flex-col ${isMobile && mobileView === 'nav' ? 'hidden' : 'flex'}`}>
            <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b p-4 flex justify-between items-center">
                <div className="flex items-center">
                    {showBackButton && (
                        <button onClick={() => setMobileView('nav')} className="mr-2 p-2 rounded-full hover:bg-gray-100">
                            <ArrowLeftIcon />
                        </button>
                    )}
                    <h2 className="text-xl font-semibold">{headerTitle}</h2>
                </div>
                <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800">Done</button>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    </div>
  );
};
