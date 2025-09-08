import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { LogoIcon } from './icons/LogoIcon';
import { OpenAIIcon } from './icons/OpenAIIcon';
import { AnthropicIcon } from './icons/AnthropicIcon';
import { InfoIcon } from './icons/InfoIcon';
import { PrivacyIcon } from './icons/PrivacyIcon';
import { ReleaseNotesIcon } from './icons/ReleaseNotesIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CheckIcon } from './icons/CheckIcon';
import { WallpaperIcon } from './icons/WallpaperIcon';
import { StickerIcon } from './icons/StickerIcon';
import { WidgetIcon } from './icons/WidgetIcon';
import { TagIcon } from './icons/TagIcon';
import { KeyIcon } from './icons/KeyIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { Clock } from './Clock';
import { STICKERS } from './sticker-library';
import type { ClockSettings, CustomSticker, WidgetType, TemperatureUnit, SearchInputSettings, StickerInstance, WidgetInstance, SearchSettings, AccessibilitySettings, LanguageSettings, NotificationSettings, DeveloperSettings, AnalyticsSettings } from '../types';
import { SearchIcon } from './icons/SearchIcon';
import { CohereIcon } from './icons/CohereIcon';
import { MistralIcon } from './icons/MistralIcon';
import { AI21LabsIcon } from './icons/AI21LabsIcon';
import { HuggingFaceIcon } from './icons/HuggingFaceIcon';
import { GroqIcon } from './icons/GroqIcon';
import { PerplexityIcon } from './icons/PerplexityIcon';
import { TogetherAIIcon } from './icons/TogetherAIIcon';
import { NvidiaIcon } from './icons/NvidiaIcon';
import { DatabricksIcon } from './icons/DatabricksIcon';
import { SnowflakeIcon } from './icons/SnowflakeIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { HelpCircleIcon } from './icons/HelpCircleIcon';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LanguagesIcon } from './icons/LanguagesIcon';
import { ChipIcon } from './icons/ChipIcon';
import { UniversalAccessIcon } from './icons/UniversalAccessIcon';
import { DatabaseIcon } from './icons/DatabaseIcon';
import { StoreIcon } from './icons/StoreIcon';
import { AppIconIcon } from './icons/AppIconIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { KeyboardIcon } from './icons/KeyboardIcon';
import { CloudSyncIcon } from './icons/CloudSyncIcon';
import { UsersIcon } from './icons/UsersIcon';
import { LinkIcon } from './icons/LinkIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { BellIcon } from './icons/BellIcon';
import { CodeIcon } from './icons/CodeIcon';
import { GiftIcon } from './icons/GiftIcon';
import { LockIcon } from './icons/LockIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { YouTubeIcon } from './icons/YouTubeIcon';
import { MapPinIcon } from './icons/MapPinIcon';


interface SettingsModalProps {
  isOpen: boolean;
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
}

const AI_PROVIDERS = [
    { id: 'gemini', name: 'Google Gemini', Icon: (props: any) => <LogoIcon {...props} />, description: 'The Silo Search core functionality is powered by Gemini. You can get your API key from Google AI Studio.', placeholder: 'Enter your Google Gemini API key', getLink: 'https://aistudio.google.com/app/apikey' },
    { id: 'youtube', name: 'YouTube Data API', Icon: YouTubeIcon, description: 'Required for the video search feature. Get your key from the Google Cloud Console.', placeholder: 'Enter your YouTube Data v3 API key', getLink: 'https://console.cloud.google.com/apis/library/youtube.googleapis.com' },
    { id: 'googleMaps', name: 'Google Maps Platform', Icon: MapPinIcon, description: 'Required for the map search feature. Get your key from the Google Cloud Console.', placeholder: 'Enter your Google Maps API key', getLink: 'https://console.cloud.google.com/google/maps-apis/credentials' },
    { id: 'openai', name: 'OpenAI', Icon: OpenAIIcon, description: 'You can find your OpenAI API key on your OpenAI account page.', placeholder: 'Enter your OpenAI API key (e.g., sk-...)', getLink: 'https://platform.openai.com/api-keys' },
    { id: 'anthropic', name: 'Anthropic', Icon: AnthropicIcon, description: 'Access your Anthropic API key from the Anthropic console settings.', placeholder: 'Enter your Anthropic API key', getLink: 'https://console.anthropic.com/settings/keys' },
    { id: 'cohere', name: 'Cohere', Icon: CohereIcon, description: 'Get your API key from the Cohere dashboard.', placeholder: 'Enter your Cohere API key', getLink: 'https://dashboard.cohere.com/api-keys' },
    { id: 'mistral', name: 'Mistral AI', Icon: MistralIcon, description: 'Get your API key from the Mistral platform.', placeholder: 'Enter your Mistral API key', getLink: 'https://console.mistral.ai/api-keys/' },
    { id: 'ai21', name: 'AI21 Labs', Icon: AI21LabsIcon, description: 'Get your API key from the AI21 Studio.', placeholder: 'Enter your AI21 Labs API key', getLink: 'https://studio.ai21.com/account/api-key' },
    { id: 'huggingface', name: 'Hugging Face', Icon: HuggingFaceIcon, description: 'Create an access token in your Hugging Face account settings.', placeholder: 'Enter your Hugging Face token', getLink: 'https://huggingface.co/settings/tokens' },
    { id: 'groq', name: 'Groq', Icon: GroqIcon, description: 'Generate an API key from your GroqCloud account.', placeholder: 'Enter your Groq API key', getLink: 'https://console.groq.com/keys' },
    { id: 'perplexity', name: 'Perplexity', Icon: PerplexityIcon, description: 'Find your API key in your Perplexity account settings.', placeholder: 'Enter your Perplexity API key', getLink: 'https://www.perplexity.ai/settings/api' },
    { id: 'together', name: 'Together AI', Icon: TogetherAIIcon, description: 'Get your API key from the Together AI dashboard.', placeholder: 'Enter your Together AI API key', getLink: 'https://api.together.ai/settings/api-keys' },
    { id: 'nvidia', name: 'NVIDIA', Icon: NvidiaIcon, description: 'Get an API key from the NVIDIA NGC catalog.', placeholder: 'Enter your NVIDIA API key', getLink: 'https://build.nvidia.com/explore/discover' },
    { id: 'databricks', name: 'Databricks', Icon: DatabricksIcon, description: 'Generate a personal access token for Databricks Foundation Models.', placeholder: 'Enter your Databricks token', getLink: 'https://docs.databricks.com/en/machine-learning/foundation-models/index.html' },
    { id: 'snowflake', name: 'Snowflake', Icon: SnowflakeIcon, description: 'Access Cortex models through Snowflake.', placeholder: 'See documentation for setup', getLink: 'https://www.snowflake.com/en/data-cloud/cortex/' },
];

const PRO_FEATURES_COSTS: { [key: string]: number } = {
  'upload-custom-wallpaper': 50,
  'upload-custom-sticker': 50,
  'theme-animated-1': 25, 'theme-animated-2': 25, 'theme-animated-3': 25, 'theme-animated-4': 25,
  'theme-animated-5': 25, 'theme-animated-6': 25, 'theme-animated-7': 25, 'theme-animated-8': 25,
  'theme-animated-9': 25, 'theme-animated-10': 25, 'theme-animated-11': 25, 'theme-animated-12': 25,
  'liquid-glass': 15, 'neon': 15, 'gold': 15, 'ruby': 15, 'sapphire': 15, 'emerald': 15,
  'press-start': 15, 'orbitron': 15, 'elite': 15,
};

const navItems = [
    {
        category: 'Core Settings',
        items: [
            { id: 'api-keys', name: 'API Keys', Icon: KeyIcon, keywords: 'gemini, openai, anthropic, key' },
            { id: 'search-ai', name: 'Search & AI', Icon: ChipIcon, keywords: 'model, web search' },
            { id: 'speech-language', name: 'Speech & Language', Icon: LanguagesIcon, keywords: 'voice, region, recognition' },
        ]
    },
    {
        category: 'Personalization',
        items: [
            { id: 'wallpaper', name: 'Wallpaper', Icon: WallpaperIcon, keywords: 'background, theme, custom' },
            { id: 'clock', name: 'Clock', Icon: ClockIcon, keywords: 'time, font, color, theme, style' },
            { id: 'search-box', name: 'Search Box', Icon: SearchIcon, keywords: 'input, style, glossy, size' },
            { id: 'stickers', name: 'Stickers', Icon: StickerIcon, keywords: 'emoji, decorate, customize' },
            { id: 'widgets', name: 'Widgets', Icon: WidgetIcon, keywords: 'note, weather, home screen' },
        ]
    },
    {
        category: 'Store & Rewards',
        items: [
            { id: 'rewards-store', name: 'Rewards', Icon: GiftIcon, keywords: 'credits, points, earn' },
            { id: 'theme-store', name: 'Theme Store', Icon: StoreIcon, keywords: 'presets, styles, neon, forest' },
            { id: 'app-icon', name: 'App Icon', Icon: AppIconIcon, keywords: 'homescreen, pwa, logo' },
        ]
    },
    {
        category: 'Account & Data',
        items: [
            { id: 'data-management', name: 'Import / Export', Icon: DatabaseIcon, keywords: 'backup, restore, json, settings' },
            { id: 'usage-analytics', name: 'Usage Analytics', Icon: BarChartIcon, keywords: 'privacy, data, tracking' },
            { id: 'delete-data', name: 'Delete Data', Icon: AlertTriangleIcon, keywords: 'danger, remove, reset, clear' },
        ]
    },
    {
        category: 'General',
        items: [
            { id: 'accessibility', name: 'Accessibility', Icon: UniversalAccessIcon, keywords: 'font size, contrast, vision' },
            { id: 'notifications', name: 'Notifications', Icon: BellIcon, keywords: 'alerts, updates, messages' },
            { id: 'keyboard-shortcuts', name: 'Shortcuts', Icon: KeyboardIcon, keywords: 'hotkeys, commands' },
        ]
    },
    {
        category: 'Information',
        items: [
            { id: 'about', name: 'About Silo Search', Icon: InfoIcon, keywords: 'help, guide, contact' },
            { id: 'how-it-works', name: 'How It Works', Icon: HelpCircleIcon, keywords: 'help, guide, tutorial' },
            { id: 'privacy', name: 'Privacy Policy', Icon: PrivacyIcon, keywords: 'legal, data, gdpr' },
            { id: 'terms', name: 'Terms of Service', Icon: FileTextIcon, keywords: 'legal, rules, agreement' },
            { id: 'releaseNotes', name: 'Release Notes', Icon: ReleaseNotesIcon, keywords: 'updates, changelog, version' },
            { id: 'developer-options', name: 'Developer', Icon: CodeIcon, keywords: 'advanced, debug, api, logger' },
        ]
    }
];

const wallpapers = {
  Default: [{ name: 'White', class: 'bg-white' },{ name: 'Light Gray', class: 'bg-gray-100' },],
  Gradients: [{ name: 'Peachy', class: 'theme-gradient-2' },{ name: 'Lavender', class: 'theme-gradient-1' },{ name: 'Minty', class: 'theme-gradient-3' },{ name: 'Ocean', class: 'theme-gradient-4' },{ name: 'Sunset', class: 'theme-gradient-5' },{ name: 'Azure', class: 'theme-gradient-6' },{ name: 'Sundance', class: 'theme-gradient-7' },{ name: 'Spearmint', class: 'theme-gradient-8' },{ name: 'Sorbet', class: 'theme-gradient-9' },{ name: 'Meadow', class: 'theme-gradient-10' },{ name: 'Graphite', class: 'theme-gradient-11' },{ name: 'Sky', class: 'theme-gradient-12' },{ name: 'Citrus', class: 'theme-gradient-13' },{ name: 'Amethyst', class: 'theme-gradient-14' },{ name: 'Lullaby', class: 'theme-gradient-15' },],
  Animated: [{ name: 'Aurora', class: 'theme-animated-1' },{ name: 'Nebula', class: 'theme-animated-2' },{ name: 'Vaporwave', class: 'theme-animated-3' },{ name: 'Lemonade', class: 'theme-animated-4' },{ name: 'Instagram', class: 'theme-animated-5' },{ name: 'Night Sky', class: 'theme-animated-6' },{ name: 'Blush', class: 'theme-animated-7' },{ name: 'Flare', class: 'theme-animated-8' },{ name: 'Rose', class: 'theme-animated-9' },{ name: 'Cloudy Sky', class: 'theme-animated-10' },{ name: 'Morning', class: 'theme-animated-11' },{ name: 'Jungle', class: 'theme-animated-12' },]
};
const clockThemes = [{ id: 'classic', name: 'Classic', darkClass: 'bg-[#006A4E]', lightClass: 'bg-[#7FFFD4]' },{ id: 'mint', name: 'Mint', darkClass: 'bg-emerald-700', lightClass: 'bg-green-300' },{ id: 'peach', name: 'Peach', darkClass: 'bg-orange-600', lightClass: 'bg-amber-300' },{ id: 'mono', name: 'Mono', darkClass: 'bg-black', lightClass: 'bg-gray-400' },{ id: 'ocean', name: 'Ocean', darkClass: 'bg-blue-800', lightClass: 'bg-sky-400' },{ id: 'sunset', name: 'Sunset', darkClass: 'bg-purple-800', lightClass: 'bg-orange-400' },{ id: 'forest', name: 'Forest', darkClass: 'bg-green-900', lightClass: 'bg-lime-500' },{ id: 'neon', name: 'Neon', darkClass: 'bg-pink-500', lightClass: 'bg-cyan-300' },{ id: 'candy', name: 'Candy', darkClass: 'bg-red-500', lightClass: 'bg-yellow-300' },{ id: 'liquid-glass', name: 'Liquid Glass', darkClass: 'bg-gray-400/30 border border-white/20', lightClass: 'bg-gray-100/30 border border-white/20' },{ id: 'espresso', name: 'Espresso', darkClass: 'bg-[#4a2c2a]', lightClass: 'bg-[#f5e8d7]' },{ id: 'cherry', name: 'Cherry', darkClass: 'bg-[#b24a69]', lightClass: 'bg-[#ffd1e2]' },{ id: 'lavender', name: 'Lavender', darkClass: 'bg-[#6a5acd]', lightClass: 'bg-[#e6e6fa]' },{ id: 'gold', name: 'Gold', darkClass: 'bg-[#b1740f]', lightClass: 'bg-[#fde488]' },{ id: 'ruby', name: 'Ruby', darkClass: 'bg-[#8b0000]', lightClass: 'bg-[#ffc0cb]' },{ id: 'sapphire', name: 'Sapphire', darkClass: 'bg-[#0f52ba]', lightClass: 'bg-[#add8e6]' },{ id: 'emerald', name: 'Emerald', darkClass: 'bg-[#006400]', lightClass: 'bg-[#98ff98]' },{ id: 'graphite', name: 'Graphite', darkClass: 'bg-[#36454f]', lightClass: 'bg-[#d3d3d3]' },{ id: 'coral', name: 'Coral', darkClass: 'bg-[#ff4500]', lightClass: 'bg-[#ffdab9]' },{ id: 'sky', name: 'Sky', darkClass: 'bg-[#55a0d3]', lightClass: 'bg-[#c6f1ff]' },];
const clockFonts = [{ id: 'fredoka', name: 'Bubbly', className: "font-['Fredoka_One']" },{ id: 'serif', name: 'Serif', className: "font-['Roboto_Slab']" },{ id: 'mono', name: 'Mono', className: "font-['Roboto_Mono']" },{ id: 'pacifico', name: 'Script', className: "font-['Pacifico']" },{ id: 'bungee', name: 'Blocky', className: "font-['Bungee']" },{ id: 'press-start', name: 'Pixel', className: "font-['Press_Start_2P'] text-xs" },{ id: 'caveat', name: 'Handwriting', className: "font-['Caveat'] text-2xl" },{ id: 'lobster', name: 'Lobster', className: "font-['Lobster']" },{ id: 'anton', name: 'Anton', className: "font-['Anton']" },{ id: 'oswald', name: 'Oswald', className: "font-['Oswald']" },{ id: 'playfair', name: 'Playfair', className: "font-['Playfair_Display']" },{ id: 'orbitron', name: 'Orbitron', className: "font-['Orbitron']" },{ id: 'vt323', name: 'VT323', className: "font-['VT323'] text-2xl" },{ id: 'bebas', name: 'Bebas', className: "font-['Bebas_Neue']" },{ id: 'dancing', name: 'Dancing', className: "font-['Dancing_Script'] text-2xl" },{ id: 'satisfy', name: 'Satisfy', className: "font-['Satisfy'] text-xl" },{ id: 'elite', name: 'Typewriter', className: "font-['Special_Elite'] text-lg" },];
const WallpaperSwatch: React.FC<{ themeClass: string; isSelected: boolean; onClick: () => void; }> = ({ themeClass, isSelected, onClick }) => ( <button onClick={onClick} className={`w-full h-16 rounded-lg border-2 transition-all ${isSelected ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-300'}`} aria-label={`Select theme: ${themeClass}`}> <div className={`w-full h-full rounded-md flex items-center justify-center ${themeClass}`}> {isSelected && ( <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-blue-600"> <CheckIcon /> </div> )} </div> </button> );
const ClockThemeSwatch: React.FC<{ theme: { id: string, name: string, darkClass: string, lightClass: string }, isSelected: boolean, onClick: () => void }> = ({ theme, isSelected, onClick }) => ( <button onClick={onClick} className={`p-2 rounded-lg border-2 w-full text-left ${isSelected ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}`}> <div className="flex items-center space-x-2"> <div className={`w-6 h-6 rounded-full ${theme.darkClass}`}></div> <div className={`w-6 h-6 rounded-full ${theme.lightClass}`}></div> <span className="text-sm font-medium text-gray-800">{theme.name}</span> </div> </button> );

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialSection, onOpenLegalPage, apiKeys, onApiKeysChange, currentTheme, onThemeChange, customWallpaper, onCustomWallpaperChange, isClockVisible, onIsClockVisibleChange, clockSettings, onClockSettingsChange, temperatureUnit, onTemperatureUnitChange, speechLanguage, onSpeechLanguageChange, stickers, onAddSticker, onClearStickers, onEnterStickerEditMode, customStickers, onAddCustomSticker, widgets, onAddWidget, onClearWidgets, onEnterWidgetEditMode, searchInputSettings, onSearchInputSettingsChange, searchSettings, onSearchSettingsChange, accessibilitySettings, onAccessibilitySettingsChange, languageSettings, onLanguageSettingsChange, notificationSettings, onNotificationSettingsChange, developerSettings, onDeveloperSettingsChange, analyticsSettings, onAnalyticsSettingsChange, proCredits, unlockedProFeatures, onUnlockFeature }) => {
  const [activeSection, setActiveSection] = useState('api-keys');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [localApiKeys, setLocalApiKeys] = useState(apiKeys);
  const [localTheme, setLocalTheme] = useState(currentTheme);
  const [localCustomWallpaper, setLocalCustomWallpaper] = useState(customWallpaper);
  const [localIsClockVisible, setLocalIsClockVisible] = useState(isClockVisible);
  const [localClockSettings, setLocalClockSettings] = useState(clockSettings);
  const [localTemperatureUnit, setLocalTemperatureUnit] = useState(temperatureUnit);
  const [localSpeechLanguage, setLocalSpeechLanguage] = useState(speechLanguage);
  const [localSearchInputSettings, setLocalSearchInputSettings] = useState(searchInputSettings);
  const [localSearchSettings, setLocalSearchSettings] = useState(searchSettings);
  const [localAccessibilitySettings, setLocalAccessibilitySettings] = useState(accessibilitySettings);
  const [localLanguageSettings, setLocalLanguageSettings] = useState(languageSettings);
  const [localNotificationSettings, setLocalNotificationSettings] = useState(notificationSettings);
  const [localDeveloperSettings, setLocalDeveloperSettings] = useState(developerSettings);
  const [localAnalyticsSettings, setLocalAnalyticsSettings] = useState(analyticsSettings);
  
  const [stickerSearch, setStickerSearch] = useState('');
  const stickerFileInputRef = useRef<HTMLInputElement>(null);
  const wallpaperFileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isOpen) {
        const currentActiveSection = initialSection || 'api-keys';
        setActiveSection(currentActiveSection);
        
        const initialCategory = navItems.find(c => c.items.some(i => i.id === currentActiveSection))?.category;
        if (initialCategory) {
            setExpandedCategories([initialCategory]);
        } else if (navItems.length > 0) {
            setExpandedCategories([navItems[0].category]);
        }

        setLocalApiKeys(apiKeys);
        setLocalTheme(currentTheme);
        setLocalCustomWallpaper(customWallpaper);
        setLocalIsClockVisible(isClockVisible);
        setLocalClockSettings(clockSettings);
        setLocalTemperatureUnit(temperatureUnit);
        setLocalSpeechLanguage(speechLanguage);
        setLocalSearchInputSettings(searchInputSettings);
        setLocalSearchSettings(searchSettings);
        setLocalAccessibilitySettings(accessibilitySettings);
        setLocalLanguageSettings(languageSettings);
        setLocalNotificationSettings(notificationSettings);
        setLocalDeveloperSettings(developerSettings);
        setLocalAnalyticsSettings(analyticsSettings);
        setStickerSearch('');
    }
  }, [isOpen, initialSection, apiKeys, currentTheme, customWallpaper, isClockVisible, clockSettings, temperatureUnit, speechLanguage, searchInputSettings, searchSettings, accessibilitySettings, languageSettings, notificationSettings, developerSettings, analyticsSettings]);
  
  const handleSave = () => {
    onApiKeysChange(localApiKeys);
    onThemeChange(localTheme);
    onCustomWallpaperChange(localCustomWallpaper);
    onIsClockVisibleChange(localIsClockVisible);
    onClockSettingsChange(localClockSettings);
    onTemperatureUnitChange(localTemperatureUnit);
    onSpeechLanguageChange(localSpeechLanguage);
    onSearchInputSettingsChange(localSearchInputSettings);
    onSearchSettingsChange(localSearchSettings);
    onAccessibilitySettingsChange(localAccessibilitySettings);
    onLanguageSettingsChange(localLanguageSettings);
    onNotificationSettingsChange(localNotificationSettings);
    onDeveloperSettingsChange(localDeveloperSettings);
    onAnalyticsSettingsChange(localAnalyticsSettings);
    onClose();
  };

  const handleInputChange = (provider: string, value: string) => { setLocalApiKeys(prev => ({ ...prev, [provider]: value })); };
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
      const imageData = reader.result as string;
      const name = file.name.split('.').slice(0, -1).join('.') || 'My Sticker';
      onAddCustomSticker(imageData, name);
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
        const imageData = reader.result as string;
        setLocalCustomWallpaper(imageData);
        setLocalTheme('bg-white'); // Set a neutral base theme
    };
    reader.onerror = () => alert('Sorry, there was an error uploading your wallpaper.');
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleDeleteAllData = () => {
    if (window.confirm('Are you sure you want to delete all app data? This action is irreversible and will reset the application to its default state.')) {
        window.localStorage.clear();
        window.location.reload();
    }
  };

  const handleExportData = () => {
    const exportableData = {
        'ai-api-keys': apiKeys, 'silo-theme': currentTheme, 'customWallpaper': customWallpaper, 'isClockVisible': isClockVisible,
        'clockSettings': clockSettings, 'temperatureUnit': temperatureUnit, 'speechLanguage': speechLanguage,
        'searchInputSettings': searchInputSettings, 'searchSettings': searchSettings, 'accessibilitySettings': accessibilitySettings,
        'stickers': stickers, 'widgets': widgets, 'customStickers': customStickers, 'languageSettings': languageSettings,
        'notificationSettings': notificationSettings, 'developerSettings': developerSettings, 'analyticsSettings': analyticsSettings,
        'proCredits': proCredits, 'unlockedProFeatures': unlockedProFeatures,
    };
    const blob = new Blob([JSON.stringify(exportableData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `silo-search-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    importFileInputRef.current?.click();
  };

  const handleImportFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("Invalid file content");
            const data = JSON.parse(text);
            
            if (data['ai-api-keys']) setLocalApiKeys(data['ai-api-keys']);
            if (data['silo-theme']) setLocalTheme(data['silo-theme']);
            setLocalCustomWallpaper(data['customWallpaper'] || null);
            if (typeof data['isClockVisible'] === 'boolean') setLocalIsClockVisible(data['isClockVisible']);
            if (data['clockSettings']) setLocalClockSettings(data['clockSettings']);
            if (data['temperatureUnit']) setLocalTemperatureUnit(data['temperatureUnit']);
            if (data['speechLanguage']) setLocalSpeechLanguage(data['speechLanguage']);
            if (data['searchInputSettings']) setLocalSearchInputSettings(data['searchInputSettings']);
            if (data['searchSettings']) setLocalSearchSettings(data['searchSettings']);
            if (data['accessibilitySettings']) setLocalAccessibilitySettings(data['accessibilitySettings']);
            if (data['languageSettings']) setLocalLanguageSettings(data['languageSettings']);
            if (data['notificationSettings']) setLocalNotificationSettings(data['notificationSettings']);
            if (data['developerSettings']) setLocalDeveloperSettings(data['developerSettings']);
            if (data['analyticsSettings']) setLocalAnalyticsSettings(data['analyticsSettings']);
            alert('Settings imported successfully! Click "Save Changes" to apply.');
        } catch (error) {
            console.error("Failed to import settings:", error);
            alert('Failed to import settings. The file may be invalid or corrupted.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const applyThemePreset = (preset: 'neon' | 'forest' | 'mono') => {
    if (preset === 'neon') {
      setLocalTheme('theme-animated-3');
      setLocalCustomWallpaper(null);
      setLocalClockSettings(s => ({ ...s, theme: 'neon', font: 'orbitron', style: 'stacked', animation: 'pulse' }));
    } else if (preset === 'forest') {
      setLocalTheme('theme-gradient-8');
      setLocalCustomWallpaper(null);
      setLocalClockSettings(s => ({ ...s, theme: 'forest', font: 'serif', style: 'horizontal', animation: 'float' }));
    } else if (preset === 'mono') {
      setLocalTheme('bg-gray-100');
      setLocalCustomWallpaper(null);
      setLocalClockSettings(s => ({ ...s, theme: 'mono', font: 'mono', style: 'horizontal', animation: 'none' }));
    }
  };

  const handleNavClick = (id: string) => {
    if (['privacy', 'terms', 'about'].includes(id)) {
        onOpenLegalPage(id as 'privacy' | 'terms' | 'about');
    } else {
        setActiveSection(id);
    }
  };

  const ProFeatureWrapper: React.FC<{featureId: string, children: React.ReactNode}> = ({ featureId, children }) => {
    const cost = PRO_FEATURES_COSTS[featureId];
    if (cost === undefined) return <>{children}</>;
  
    const isUnlocked = unlockedProFeatures.includes(featureId);
  
    if (isUnlocked) {
      return <>{children}</>;
    }
  
    return (
      <div className="relative">
        <div className="opacity-50 pointer-events-none">{children}</div>
        <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center rounded-lg">
          <button
            onClick={() => onUnlockFeature(featureId, cost)}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-transform hover:scale-105 disabled:bg-gray-400"
            disabled={proCredits < cost}
          >
            <LockIcon className="w-4 h-4" />
            <span>Unlock for {cost}</span>
            <GiftIcon className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    );
  };
  
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
        prev.includes(category) 
            ? prev.filter(c => c !== category) 
            : [...prev, category]
    );
  };

  const filteredNavItems = useMemo(() => {
    if (!searchQuery) {
        return navItems;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = navItems.map(category => {
        const filteredItems = category.items.filter(item => 
            item.name.toLowerCase().includes(lowercasedQuery) ||
            item.keywords.toLowerCase().includes(lowercasedQuery)
        );
        return { ...category, items: filteredItems };
    }).filter(category => category.items.length > 0);

    return filtered;
  }, [searchQuery]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="settings-modal-title">
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" onClick={onClose} aria-hidden="true"></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] max-h-[800px] flex flex-col transform transition-all">
        <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 id="settings-modal-title" className="text-xl font-bold text-gray-800"> Settings & Information </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close settings"> <CloseIcon /> </button>
        </header>

        <div className="flex-grow flex min-h-0">
            <nav className="w-1/3 md:w-1/4 border-r bg-gray-50/50 flex flex-col">
              <div className="p-3">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border-0 bg-white py-1.5 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm"
                  />
                </div>
              </div>
               <div className="flex-grow overflow-y-auto px-3 pb-3">
                 {filteredNavItems.map(({ category, items }) => (
                  <div key={category} className="mb-2 last:mb-0">
                      <button 
                        onClick={() => toggleCategory(category)}
                        className="w-full flex justify-between items-center p-2 text-left"
                      >
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{category}</p>
                        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${expandedCategories.includes(category) || searchQuery ? 'rotate-180' : ''}`} />
                      </button>
                      {(expandedCategories.includes(category) || searchQuery) && (
                        <div className="mt-1 space-y-1">
                          {items.map(item => (
                              <button key={item.id} onClick={() => handleNavClick(item.id)} className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left text-sm font-medium transition-colors ${ activeSection === item.id ? 'bg-black/10 text-gray-900' : 'text-gray-600 hover:bg-black/5' }`}>
                                  <item.Icon className="w-5 h-5 flex-shrink-0" />
                                  <span>{item.name}</span>
                              </button>
                          ))}
                        </div>
                      )}
                  </div>
                ))}
               </div>
            </nav>
            <main className="w-2/3 md:w-3/4 p-6 md:p-8 overflow-y-auto">
                {activeSection === 'api-keys' ? (
                   <section>
                        <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">API Keys</h3> <p className="mt-2 text-gray-600"> Connect your accounts from various AI providers. Your keys are stored securely in your browser's local storage. </p> </div>
                        <div className="space-y-6">
                            {AI_PROVIDERS.map(provider => (
                                <div key={provider.id} className="p-4 border rounded-lg bg-gray-50/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3"> <provider.Icon className="w-6 h-6" /> <h4 className="font-bold text-gray-800">{provider.name}</h4> </div>
                                        <a href={provider.getLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline"> Get key </a>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">{provider.description}</p>
                                    <input type="password" value={localApiKeys[provider.id] || ''} onChange={(e) => handleInputChange(provider.id, e.target.value)} placeholder={provider.placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                </div>
                            ))}
                        </div>
                    </section>
                ) : activeSection === 'rewards-store' ? (
                    <section>
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center space-x-3 bg-amber-100 text-amber-800 rounded-full px-6 py-3">
                                <GiftIcon className="w-8 h-8"/>
                                <span className="text-4xl font-bold">{proCredits}</span>
                                <span className="text-lg font-medium">Credits</span>
                            </div>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">How to Earn Credits</h3>
                            <p className="mt-2 text-gray-600">Use Silo Search and get rewarded! Credits let you unlock exclusive customization features.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                                <p className="font-medium text-gray-700">Daily Login</p>
                                <p className="font-semibold text-gray-800">+5 Credits</p>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                                <p className="font-medium text-gray-700">Each Search</p>
                                <p className="font-semibold text-gray-800">+1 Credit</p>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                                <p className="font-medium text-gray-700">Welcome Bonus</p>
                                <p className="font-semibold text-gray-800">50 Credits</p>
                            </div>
                        </div>
                    </section>
                ) : activeSection === 'search-ai' ? (
                    <section>
                      <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Search & AI Settings</h3> <p className="mt-2 text-gray-600"> Configure the core behavior of the AI search and chat. </p> </div>
                      <div className="space-y-6">
                           <div className="p-4 border rounded-lg bg-gray-50/50">
                              <label htmlFor="ai-model-select" className="block font-medium text-gray-700">Primary AI Model</label>
                              <select id="ai-model-select" value={localSearchSettings.model} onChange={(e) => setLocalSearchSettings(s => ({ ...s, model: e.target.value as 'gemini-2.5-flash' | 's1-mini' }))} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                                  <option value="s1-mini">S1 Mini</option>
                              </select>
                              {localSearchSettings.model === 's1-mini' ? (
                                <p className="text-xs text-gray-500 mt-2">The S1 Mini model is optimized for fast, web-grounded summaries. It always uses Google Search to provide concise answers based on current information. <br/><em>Note: This model still utilizes the Gemini API and requires a valid key.</em></p>
                              ) : (
                                <p className="text-xs text-gray-500 mt-2">Select the model used for search summaries and chat.</p>
                              )}
                          </div>
                          <div className={`flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 transition-opacity ${localSearchSettings.model === 's1-mini' ? 'opacity-50' : ''}`}>
                              <div><label htmlFor="web-search-toggle" className="font-medium text-gray-700">Enable Web Search</label><p className="text-xs text-gray-500 mt-1">Allows the AI to access up-to-date information from Google Search.</p></div>
                              <button 
                                  id="web-search-toggle" 
                                  role="switch" 
                                  aria-checked={localSearchSettings.useWebSearch || localSearchSettings.model === 's1-mini'} 
                                  onClick={() => setLocalSearchSettings(s => ({ ...s, useWebSearch: !s.useWebSearch }))} 
                                  disabled={localSearchSettings.model === 's1-mini'}
                                  className={`${(localSearchSettings.useWebSearch || localSearchSettings.model === 's1-mini') ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:cursor-not-allowed`}
                              >
                                  <span className={`${(localSearchSettings.useWebSearch || localSearchSettings.model === 's1-mini') ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                              </button>
                          </div>
                      </div>
                    </section>
                ) : activeSection === 'accessibility' ? (
                    <section>
                        <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Accessibility</h3> <p className="mt-2 text-gray-600"> Adjust settings for better visibility and ease of use. </p> </div>
                        <div className="space-y-6">
                            <div className="p-4 border rounded-lg bg-gray-50/50">
                                <label htmlFor="font-size-slider" className="font-medium text-gray-700">UI Font Size</label>
                                <div className="flex items-center space-x-4 mt-2">
                                    <input id="font-size-slider" type="range" min="80" max="120" step="5" value={localAccessibilitySettings.uiFontSize} onChange={(e) => setLocalAccessibilitySettings(s => ({ ...s, uiFontSize: parseInt(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                    <span className="font-mono text-sm text-gray-600 w-20 text-right">{localAccessibilitySettings.uiFontSize}%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                                <div><label htmlFor="high-contrast-toggle" className="font-medium text-gray-700">High Contrast Mode</label><p className="text-xs text-gray-500 mt-1">Increases color contrast for better readability.</p></div>
                                <button id="high-contrast-toggle" role="switch" aria-checked={localAccessibilitySettings.highContrast} onClick={() => setLocalAccessibilitySettings(s => ({ ...s, highContrast: !s.highContrast }))} className={`${localAccessibilitySettings.highContrast ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}> <span className={`${localAccessibilitySettings.highContrast ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /> </button>
                            </div>
                        </div>
                    </section>
                ) : activeSection === 'data-management' ? (
                    <section>
                      <input type="file" ref={importFileInputRef} onChange={handleImportFileChange} accept=".json" className="hidden" aria-hidden="true" />
                      <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Import / Export Data</h3> <p className="mt-2 text-gray-600"> Export your settings for backup or import them to a new device. </p> </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg bg-gray-50/50">
                              <h4 className="font-bold text-gray-800">Export Settings</h4>
                              <p className="mt-1 text-sm text-gray-600"> Save a JSON file of your current settings, including API keys, appearance, stickers, and widgets. </p>
                              <button onClick={handleExportData} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"> Export Data </button>
                          </div>
                          <div className="p-4 border rounded-lg bg-gray-50/50">
                              <h4 className="font-bold text-gray-800">Import Settings</h4>
                              <p className="mt-1 text-sm text-gray-600"> Load settings from a previously exported JSON file. This will overwrite your current settings upon saving. </p>
                              <button onClick={handleImportClick} className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"> Import Data </button>
                          </div>
                      </div>
                    </section>
                ) : activeSection === 'speech-language' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Speech & Language</h3> <p className="mt-2 text-gray-600"> Customize language preferences for speech and search results. </p> </div> <div className="space-y-6"> <div className="p-4 border rounded-lg bg-gray-50/50"> <label htmlFor="speech-language" className="block font-medium text-gray-700 mb-2">Speech Input Language</label> <div className="grid grid-cols-2 gap-4"> <button onClick={() => setLocalSpeechLanguage('en-US')} className={`p-4 border rounded-lg text-center transition-colors ${localSpeechLanguage === 'en-US' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}> English (US) </button> <button onClick={() => setLocalSpeechLanguage('es-ES')} className={`p-4 border rounded-lg text-center transition-colors ${localSpeechLanguage === 'es-ES' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}> Español (España) </button> </div> </div> <div className="p-4 border rounded-lg bg-gray-50/50"> <label htmlFor="ui-language" className="block font-medium text-gray-700">UI Language</label> <p className="text-xs text-gray-500 mt-1 mb-2">Change the display language of the app.</p> <select id="ui-language" value={localLanguageSettings.uiLanguage} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"> <option value="en">English</option> </select> </div> <div className="p-4 border rounded-lg bg-gray-50/50"> <label htmlFor="search-region" className="block font-medium text-gray-700">Search Region</label> <p className="text-xs text-gray-500 mt-1 mb-2">Prioritize search results from a specific region.</p> <select id="search-region" value={localLanguageSettings.searchRegion} onChange={e => setLocalLanguageSettings(s => ({ ...s, searchRegion: e.target.value as 'auto' | 'US' | 'WW' }))} className="w-full px-3 py-2 border border-gray-300 rounded-md"> <option value="auto">Auto-detect</option> <option value="US">United States</option> <option value="WW">Worldwide</option> </select> </div> </div> </section>
                ) : activeSection === 'delete-data' ? (
                     <section className="space-y-6"> <div> <h3 className="text-2xl font-bold text-gray-800">Danger Zone</h3> <p className="mt-2 text-gray-600"> These actions are permanent and cannot be undone. </p> </div> <div className="p-4 border border-red-300 bg-red-50 rounded-lg"> <h4 className="font-bold text-red-800">Delete All Application Data</h4> <p className="mt-1 text-sm text-red-700"> This will permanently delete all your settings, API keys, recent searches, stickers, and widgets from your browser's storage. The application will be reset to its initial state. </p> <button onClick={handleDeleteAllData} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"> Delete All Data </button> </div> </section>
                ) : activeSection === 'how-it-works' ? (
                    <section className="space-y-6"> <div> <h3 className="text-2xl font-bold text-gray-800">How Silo Search Works</h3> <p className="mt-2 text-gray-600">Your intelligent gateway to the web.</p> </div> <div className="prose prose-sm max-w-none text-gray-700"> <p>Silo Search is designed to give you quick, summarized answers to your questions, backed by reliable sources from the web. Here's a breakdown of how it works and what you can do:</p> <h4>Core Functionality</h4> <ol> <li><strong>Enter a Query:</strong> Simply type your question into the search bar.</li> <li><strong>Get an AI Summary:</strong> We use Google's Gemini model combined with Google Search to analyze the latest information online and generate a concise, easy-to-read summary.</li> <li><strong>Explore Sources:</strong> Below the summary, you'll find "Quick Links" which are the web pages the AI used to create its answer, allowing you to dive deeper.</li> </ol> <h4>Key Features</h4> <ul> <li><strong>Chat Mode:</strong> After a search, you can enter Chat Mode to ask follow-up questions and have a conversation with the AI about the topic.</li> <li><strong>Customizable Homepage:</strong> Make Silo Search your own! You can change the wallpaper, customize the clock, and even add fun stickers or useful widgets like notes and weather. Find these options in the "Appearance" settings.</li> <li><strong>Bring Your Own API Key:</strong> Silo Search is free to use, but requires you to connect your own API key from an AI provider like Google. Your key is stored securely in your browser and is never sent to us.</li> <li><strong>Temporary Mode:</strong> Activate Temporary Mode (the incognito icon) to search without your queries being saved to your "Recent Searches" list.</li> </ul> <h4>Contact Us</h4> <p>Have questions, feedback, or need support? We'd love to hear from you! Please reach out to us at:</p> <p><a href="mailto:wolfsidevstudios@gmail.com">wolfsidevstudios@gmail.com</a></p> </div> </section>
                ) : activeSection === 'releaseNotes' ? (
                     <section className="space-y-6"> <div> <h3 className="text-2xl font-bold text-gray-800">Release Notes</h3> </div> <div className="prose prose-sm max-w-none text-gray-700 space-y-8"> <div> <h4>Version 1.3.0 <span className="text-xs text-gray-500 font-normal ml-2">August 5, 2024</span></h4> <ul> <li><strong>Mega Settings Update:</strong> Added 10 new settings sections including Theme Store, App Icon selection, Language & Region, Developer Options, and more!</li> <li>Reorganized settings navigation for better clarity.</li> </ul> </div> <div> <h4>Version 1.2.0 <span className="text-xs text-gray-500 font-normal ml-2">August 2, 2024</span></h4> <ul> <li>Added Privacy Policy, Terms of Conditions, and Release Notes to the settings menu.</li> </ul> </div> </div> </section>
                ) : activeSection === 'pricing' ? (
                  <section className="space-y-6 text-center flex flex-col items-center justify-center h-full"> <div className="bg-green-100 text-green-800 rounded-full px-6 py-2 text-lg font-bold"> 100% Free </div> <h3 className="text-2xl font-bold text-gray-800 mt-4">No separate plans—it's all free.</h3> <p className="mt-2 text-gray-600 max-w-md"> Silo Search is a free application. We don't have any subscription plans or hidden fees. </p> <p className="mt-1 text-gray-600 max-w-md"> You just need to connect your own API key from your preferred AI provider (like Google Gemini) to get started. </p> </section>
                ) : activeSection === 'clock' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Clock Customization</h3> <p className="mt-2 text-gray-600"> Personalize the clock displayed on the home screen. Changes are previewed below. </p> </div> <div className="bg-gray-800 rounded-xl p-8 mb-8 flex items-center justify-center min-h-[200px] overflow-hidden"> <Clock settings={localClockSettings} temperatureUnit={localTemperatureUnit} /> </div> <div className="space-y-6"> <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50"> <label htmlFor="clock-toggle" className="font-medium text-gray-700">Show home screen clock</label> <button id="clock-toggle" role="switch" aria-checked={localIsClockVisible} onClick={() => setLocalIsClockVisible(v => !v)} className={`${localIsClockVisible ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}> <span className={`${localIsClockVisible ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /> </button> </div> <div> <h4 className="font-medium text-gray-800 mb-3">Time Format</h4> <div className="grid grid-cols-2 gap-4"> <button onClick={() => setLocalClockSettings(s => ({ ...s, format: '12h' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.format === '12h' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}> 12-Hour </button> <button onClick={() => setLocalClockSettings(s => ({ ...s, format: '24h' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.format === '24h' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}> 24-Hour </button> </div> </div> <div> <h4 className="font-medium text-gray-800 mb-3">Weather Unit</h4> <div className="grid grid-cols-2 gap-4"> <button onClick={() => setLocalTemperatureUnit('celsius')} className={`p-4 border rounded-lg text-center transition-colors ${localTemperatureUnit === 'celsius' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}> Celsius (°C) </button> <button onClick={() => setLocalTemperatureUnit('fahrenheit')} className={`p-4 border rounded-lg text-center transition-colors ${localTemperatureUnit === 'fahrenheit' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}> Fahrenheit (°F) </button> </div> </div> <div> <h4 className="font-medium text-gray-800 mb-3">Animation</h4> <div className="grid grid-cols-3 gap-4"> <button onClick={() => setLocalClockSettings(s => ({ ...s, animation: 'none' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.animation === 'none' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>None</button> <button onClick={() => setLocalClockSettings(s => ({ ...s, animation: 'pulse' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.animation === 'pulse' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Pulse</button> <button onClick={() => setLocalClockSettings(s => ({ ...s, animation: 'float' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.animation === 'float' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Float</button> </div> </div> <div> <h4 className="font-medium text-gray-800 mb-3">Style</h4> <div className="grid grid-cols-3 gap-4"> <button onClick={() => setLocalClockSettings(s => ({ ...s, style: 'horizontal' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.style === 'horizontal' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}> Horizontal </button> <button onClick={() => setLocalClockSettings(s => ({ ...s, style: 'stacked' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.style === 'stacked' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}> Stacked </button> <button onClick={() => setLocalClockSettings(s => ({ ...s, style: 'diagonal' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.style === 'diagonal' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}> Diagonal </button> </div> </div> <div> <h4 className="font-medium text-gray-800 mb-3">Theme</h4> <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {clockThemes.map(theme => { const isPro = PRO_FEATURES_COSTS[theme.id] !== undefined; const swatch = <ClockThemeSwatch key={theme.id} theme={theme} isSelected={localClockSettings.theme === theme.id} onClick={() => setLocalClockSettings(s => ({ ...s, theme: theme.id as ClockSettings['theme'] }))} />; return isPro ? <ProFeatureWrapper key={theme.id} featureId={theme.id}>{swatch}</ProFeatureWrapper> : swatch; })} </div> </div> <div> <h4 className="font-medium text-gray-800 mb-3">Font</h4> <div className="flex flex-wrap gap-4"> {clockFonts.map(font => { const isPro = PRO_FEATURES_COSTS[font.id] !== undefined; const button = <button key={font.id} onClick={() => setLocalClockSettings(s => ({ ...s, font: font.id as ClockSettings['font'] }))} className={`p-4 border rounded-lg text-center transition-colors grow basis-24 ${font.className} ${localClockSettings.font === font.id ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}> {font.name} </button>; return isPro ? <ProFeatureWrapper key={font.id} featureId={font.id}>{button}</ProFeatureWrapper> : button; })} </div> </div> <div> <h4 className="font-medium text-gray-800 mb-3">Size</h4> <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50/50"> <input type="range" min="8" max="14" step="0.5" value={localClockSettings.size} onChange={(e) => setLocalClockSettings(s => ({ ...s, size: parseFloat(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /> <span className="font-mono text-sm text-gray-600 w-20 text-right">{localClockSettings.size.toFixed(1)}rem</span> </div> </div> <div> <h4 className="font-medium text-gray-800 mb-3">Outline Thickness</h4> <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50/50"> <input type="range" min="0" max="8" step="1" value={localClockSettings.thickness} onChange={(e) => setLocalClockSettings(s => ({ ...s, thickness: parseInt(e.target.value) }))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" /> <span className="font-mono text-sm text-gray-600 w-20 text-right">{localClockSettings.thickness}px</span> </div> </div> </div> </section>
                ) : activeSection === 'wallpaper' ? (
                    <section> <input type="file" ref={wallpaperFileInputRef} onChange={handleWallpaperFileChange} accept="image/*" className="hidden" aria-hidden="true" /> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Wallpaper</h3> <p className="mt-2 text-gray-600"> Choose a background for the application or upload your own. </p> </div> <div className="space-y-6"> <div> <h3 className="text-sm font-medium text-gray-500 mb-3">Custom Wallpaper</h3> <div className="grid grid-cols-2 gap-3"> <ProFeatureWrapper featureId="upload-custom-wallpaper"> <button onClick={handleUploadWallpaperClick} className="w-full h-16 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 flex flex-col items-center justify-center transition-colors"> <UploadCloudIcon className="w-6 h-6 mb-1" /> <span className="text-xs font-semibold">Upload Your Own</span> </button> </ProFeatureWrapper> {localCustomWallpaper && ( <div className="relative"> <button className="w-full h-16 rounded-lg border-2 border-blue-500 scale-105" aria-label="Current custom wallpaper"> <div className="w-full h-full rounded-md bg-cover bg-center" style={{ backgroundImage: `url(${localCustomWallpaper})` }}> <div className="w-full h-full rounded-md flex items-center justify-center bg-black/20"> <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-blue-600"> <CheckIcon /> </div> </div> </div> </button> <button onClick={() => setLocalCustomWallpaper(null)} className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors" aria-label="Remove custom wallpaper"> <TrashIcon /> </button> </div> )} </div> </div> {Object.entries(wallpapers).map(([category, themeList]) => ( <div key={category}> <h3 className="text-sm font-medium text-gray-500 mb-3">{category}</h3> <div className="grid grid-cols-2 gap-3"> {themeList.map(theme => { const isAnimated = category === 'Animated'; const swatch = <WallpaperSwatch key={theme.class} themeClass={theme.class} isSelected={localTheme === theme.class && !localCustomWallpaper} onClick={() => { setLocalTheme(theme.class) ; setLocalCustomWallpaper(null) }} />; return isAnimated ? <ProFeatureWrapper key={theme.class} featureId={theme.class}>{swatch}</ProFeatureWrapper> : swatch; })} </div> </div> ))} </div> </section>
                ) : activeSection === 'search-box' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Search Box Customization</h3> <p className="mt-2 text-gray-600"> Adjust the appearance of the main search input. </p> </div> <div className="space-y-6"> <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50"> <label htmlFor="large-search-toggle" className="font-medium text-gray-700">Large Size</label> <button id="large-search-toggle" role="switch" aria-checked={localSearchInputSettings.isLarge} onClick={() => setLocalSearchInputSettings(s => ({ ...s, isLarge: !s.isLarge }))} className={`${localSearchInputSettings.isLarge ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}> <span className={`${localSearchInputSettings.isLarge ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /> </button> </div> <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50"> <label htmlFor="glossy-search-toggle" className="font-medium text-gray-700">Transparent Glossy Style</label> <button id="glossy-search-toggle" role="switch" aria-checked={localSearchInputSettings.isGlossy} onClick={() => setLocalSearchInputSettings(s => ({ ...s, isGlossy: !s.isGlossy }))} className={`${localSearchInputSettings.isGlossy ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}> <span className={`${localSearchInputSettings.isGlossy ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /> </button> </div> </div> </section>
                ) : activeSection === 'stickers' ? (
                    <section> <input type="file" ref={stickerFileInputRef} onChange={handleStickerFileChange} accept="image/*" className="hidden" aria-hidden="true" /> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Stickers</h3> <p className="mt-2 text-gray-600"> Add some flair to your home screen! Click a sticker to add it, or upload your own. </p> </div> <div className="relative mb-4"> <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> <SearchIcon className="text-gray-400"/> </div> <input type="text" value={stickerSearch} onChange={(e) => setStickerSearch(e.target.value)} placeholder="Search stickers..." className="block w-full rounded-full border-0 bg-gray-100 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6" /> </div> <div className="mb-4 flex space-x-2"> <button onClick={onEnterStickerEditMode} className="w-full px-4 py-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200"> Arrange Stickers </button> <ProFeatureWrapper featureId="upload-custom-sticker"><button onClick={handleUploadStickerClick} className="w-full px-4 py-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"> Upload Your Own </button></ProFeatureWrapper> </div> {(() => { const lowercasedQuery = stickerSearch.toLowerCase(); const filteredLibraryStickers = STICKERS.filter(sticker => sticker.name.toLowerCase().includes(lowercasedQuery) || sticker.id.includes(lowercasedQuery)); const filteredCustomStickers = customStickers.filter(sticker => sticker.name.toLowerCase().includes(lowercasedQuery)); const hasResults = filteredLibraryStickers.length > 0 || filteredCustomStickers.length > 0; if (!hasResults) { return <p className="text-center text-gray-500 py-8">No stickers found for "{stickerSearch}"</p>; } return ( <div className="grid grid-cols-4 md:grid-cols-5 gap-2"> {filteredCustomStickers.map(sticker => ( <button key={sticker.id} onClick={() => handleAddStickerAndEdit(sticker.id)} className="p-2 bg-gray-100 rounded-lg flex flex-col items-center justify-center space-y-1 hover:bg-gray-200 transition-colors aspect-square" title={`Add ${sticker.name} sticker`}> <div className="w-10 h-10 flex items-center justify-center"> <img src={sticker.imageData} alt={sticker.name} className="w-full h-full object-contain" /> </div> <span className="text-xs text-gray-600 truncate">{sticker.name}</span> </button> ))} {filteredLibraryStickers.map(sticker => ( <button key={sticker.id} onClick={() => handleAddStickerAndEdit(sticker.id)} className="p-2 bg-gray-100 rounded-lg flex flex-col items-center justify-center space-y-1 hover:bg-gray-200 transition-colors aspect-square" title={`Add ${sticker.name} sticker`}> <span className="text-4xl">{sticker.id}</span> <span className="text-xs text-gray-600 truncate">{sticker.name}</span> </button> ))} </div> ); })()} <div className="mt-8 border-t pt-6"> <button onClick={onClearStickers} className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"> Clear All Stickers </button> </div> </section>
                ) : activeSection === 'widgets' ? (
                     <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Widgets</h3> <p className="mt-2 text-gray-600"> Add interactive widgets to your home screen. </p> </div> <div className="mb-4 flex space-x-2"> <button onClick={onEnterWidgetEditMode} className="w-full px-4 py-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200"> Arrange Widgets </button> <button onClick={onClearWidgets} className="w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"> Clear All Widgets </button> </div> <div className="grid grid-cols-2 gap-4"> <button onClick={() => onAddWidget('note')} className="p-4 bg-gray-100 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-200 transition-colors aspect-video"> <div className="w-20 h-20 bg-yellow-200 rounded-lg shadow-inner flex items-center justify-center font-['Caveat'] text-gray-600">note...</div> <span className="text-sm font-medium text-gray-800">Sticky Note</span> </button> <button onClick={() => onAddWidget('weather')} className="p-4 bg-gray-100 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-200 transition-colors aspect-video"> <div className="w-20 h-20 bg-blue-100 rounded-lg shadow-inner flex flex-col items-center justify-center space-y-1"> <span className="text-2xl">☁️</span> <span className="font-bold text-blue-800">19°C</span> </div> <span className="text-sm font-medium text-gray-800">Weather</span> </button> </div> </section>
                ) : activeSection === 'theme-store' ? (
                     <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Theme Store</h3> <p className="mt-2 text-gray-600"> Instantly apply a preset combination of wallpaper and clock styles. </p> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div className="border rounded-lg p-4"> <div className="w-full h-32 rounded-md theme-animated-3 mb-4"></div> <h4 className="font-bold text-gray-800">Neon City</h4> <p className="text-sm text-gray-600 mt-1">A vibrant, animated theme with a futuristic clock.</p> <button onClick={() => applyThemePreset('neon')} className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">Apply Theme</button> </div> <div className="border rounded-lg p-4"> <div className="w-full h-32 rounded-md theme-gradient-8 mb-4"></div> <h4 className="font-bold text-gray-800">Forest Retreat</h4> <p className="text-sm text-gray-600 mt-1">A calming green gradient with a classic serif clock.</p> <button onClick={() => applyThemePreset('forest')} className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">Apply Theme</button> </div> <div className="border rounded-lg p-4"> <div className="w-full h-32 rounded-md bg-gray-100 mb-4"></div> <h4 className="font-bold text-gray-800">Minimalist Mono</h4> <p className="text-sm text-gray-600 mt-1">A clean, simple theme with a monospaced font clock.</p> <button onClick={() => applyThemePreset('mono')} className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">Apply Theme</button> </div> </div> </section>
                ) : activeSection === 'app-icon' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">App Icon</h3> <p className="mt-2 text-gray-600"> Choose a new look for your home screen icon. (Requires PWA installation) </p> </div> <div className="grid grid-cols-3 md:grid-cols-4 gap-4"> <button className="flex flex-col items-center space-y-2 p-2 rounded-lg border-2 border-blue-500"> <img src="https://i.ibb.co/GvWTsPF1/IMG-3744.png" alt="Default Icon" className="w-16 h-16 rounded-lg" /> <span className="text-sm font-medium text-gray-700">Default</span> </button> <button className="flex flex-col items-center space-y-2 p-2 rounded-lg border-2 border-transparent hover:border-gray-300"> <img src="https://i.ibb.co/3cH33vX/icon-dark.png" alt="Dark Icon" className="w-16 h-16 rounded-lg" /> <span className="text-sm font-medium text-gray-700">Dark</span> </button> <button className="flex flex-col items-center space-y-2 p-2 rounded-lg border-2 border-transparent hover:border-gray-300"> <img src="https://i.ibb.co/yQz4M8J/icon-retro.png" alt="Retro Icon" className="w-16 h-16 rounded-lg" /> <span className="text-sm font-medium text-gray-700">Retro</span> </button> </div> </section>
                ) : activeSection === 'language-region' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Language & Region</h3> <p className="mt-2 text-gray-600"> Customize language preferences and regional settings. </p> </div> <div className="space-y-6"> <div className="p-4 border rounded-lg bg-gray-50/50"> <label htmlFor="ui-language" className="block font-medium text-gray-700">UI Language</label> <p className="text-xs text-gray-500 mt-1 mb-2">Change the display language of the app.</p> <select id="ui-language" value={localLanguageSettings.uiLanguage} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"> <option value="en">English</option> </select> </div> <div className="p-4 border rounded-lg bg-gray-50/50"> <label htmlFor="search-region" className="block font-medium text-gray-700">Search Region</label> <p className="text-xs text-gray-500 mt-1 mb-2">Prioritize search results from a specific region.</p> <select id="search-region" value={localLanguageSettings.searchRegion} onChange={e => setLocalLanguageSettings(s => ({ ...s, searchRegion: e.target.value as 'auto' | 'US' | 'WW' }))} className="w-full px-3 py-2 border border-gray-300 rounded-md"> <option value="auto">Auto-detect</option> <option value="US">United States</option> <option value="WW">Worldwide</option> </select> </div> </div> </section>
                ) : activeSection === 'keyboard-shortcuts' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Keyboard Shortcuts</h3> <p className="mt-2 text-gray-600"> Use these shortcuts to navigate the app faster. </p> </div> <div className="space-y-3"> <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"> <span className="font-medium text-gray-700">Open Settings</span> <kbd className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 border border-gray-300 rounded-md">Cmd/Ctrl + ,</kbd> </div> <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"> <span className="font-medium text-gray-700">Toggle Temporary Mode</span> <kbd className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 border border-gray-300 rounded-md">Cmd/Ctrl + Shift + P</kbd> </div> <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"> <span className="font-medium text-gray-700">Go to Home</span> <kbd className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 border border-gray-300 rounded-md">Esc</kbd> </div> </div> </section>
                ) : activeSection === 'sync-backup' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Sync & Backup</h3> <p className="mt-2 text-gray-600"> Keep your settings synced across devices. (Coming Soon) </p> </div> <div className="space-y-4"> <button disabled className="w-full px-4 py-3 font-medium text-gray-500 bg-gray-200 rounded-lg cursor-not-allowed">Sign in with Google to Sync</button> <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 opacity-50"> <div><label className="font-medium text-gray-700">Automatic daily backup</label><p className="text-xs text-gray-500 mt-1">Requires cloud sync to be enabled.</p></div> <div className="bg-gray-200 relative inline-flex items-center h-6 rounded-full w-11"> <span className="translate-x-1 inline-block w-4 h-4 transform bg-white rounded-full" /> </div> </div> </div> </section>
                ) : activeSection === 'sharing' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Collaboration</h3> <p className="mt-2 text-gray-600"> Manage settings for shared spaces. (Coming Soon) </p> </div> <p className="text-center text-gray-500 py-10">Collaboration features are under development.</p> </section>
                ) : activeSection === 'connected-apps' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Connected Apps</h3> <p className="mt-2 text-gray-600"> Integrate Silo Search with your other tools. (Coming Soon) </p> </div> <div className="space-y-3"> <div className="flex justify-between items-center p-3 border rounded-lg"> <span className="font-medium text-gray-700">Notion</span> <button disabled className="px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded-md cursor-not-allowed">Connect</button> </div> <div className="flex justify-between items-center p-3 border rounded-lg"> <span className="font-medium text-gray-700">Slack</span> <button disabled className="px-3 py-1 text-sm text-gray-500 bg-gray-200 rounded-md cursor-not-allowed">Connect</button> </div> </div> </section>
                ) : activeSection === 'usage-analytics' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Usage & Analytics</h3> <p className="mt-2 text-gray-600"> View your activity and manage privacy settings. </p> </div> <div className="space-y-6"> <div className="p-4 border rounded-lg bg-gray-50/50"> <h4 className="font-medium text-gray-700">This Week's Activity</h4> <p className="text-4xl font-bold text-gray-800 mt-2">42</p> <p className="text-sm text-gray-500">Total Searches</p> </div> <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50"> <div><label htmlFor="analytics-toggle" className="font-medium text-gray-700">Enable Anonymous Analytics</label><p className="text-xs text-gray-500 mt-1">Help us improve Silo Search by sharing anonymous usage data.</p></div> <button id="analytics-toggle" role="switch" aria-checked={localAnalyticsSettings.enabled} onClick={() => setLocalAnalyticsSettings(s => ({ ...s, enabled: !s.enabled }))} className={`${localAnalyticsSettings.enabled ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}> <span className={`${localAnalyticsSettings.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /> </button> </div> </div> </section>
                ) : activeSection === 'notifications' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Notifications</h3> <p className="mt-2 text-gray-600"> Choose what you want to be notified about. (Coming Soon) </p> </div> <div className="space-y-6"> <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 opacity-50"> <div><label className="font-medium text-gray-700">Feature Updates</label><p className="text-xs text-gray-500 mt-1">Get notified about new features and improvements.</p></div> <button role="switch" aria-checked={localNotificationSettings.featureUpdates} onClick={() => setLocalNotificationSettings(s => ({ ...s, featureUpdates: !s.featureUpdates }))} className={`${localNotificationSettings.featureUpdates ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}> <span className={`${localNotificationSettings.featureUpdates ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /> </button> </div> <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50 opacity-50"> <div><label className="font-medium text-gray-700">Collaboration Invites</label><p className="text-xs text-gray-500 mt-1">Receive notifications for shared space invitations.</p></div> <button role="switch" aria-checked={localNotificationSettings.collaborationInvites} onClick={() => setLocalNotificationSettings(s => ({ ...s, collaborationInvites: !s.collaborationInvites }))} className={`${localNotificationSettings.collaborationInvites ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}> <span className={`${localNotificationSettings.collaborationInvites ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /> </button> </div> </div> </section>
                ) : activeSection === 'developer-options' ? (
                    <section> <div className="mb-8"> <h3 className="text-2xl font-bold text-gray-800">Developer Options</h3> <p className="mt-2 text-gray-600"> Advanced settings for debugging and development. </p> </div> <div className="space-y-6"> <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50"> <div><label htmlFor="api-logger-toggle" className="font-medium text-gray-700">Show API Logger</label><p className="text-xs text-gray-500 mt-1">Display API request/response in the console.</p></div> <button id="api-logger-toggle" role="switch" aria-checked={localDeveloperSettings.showApiLogger} onClick={() => setLocalDeveloperSettings(s => ({...s, showApiLogger: !s.showApiLogger}))} className={`${localDeveloperSettings.showApiLogger ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}> <span className={`${localDeveloperSettings.showApiLogger ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} /> </button> </div> <div className="p-4 border rounded-lg bg-gray-50/50"> <h4 className="font-medium text-gray-700">Cache Management</h4> <p className="text-xs text-gray-500 mt-1">Force-clear all cached application data.</p> <button onClick={() => alert('Cache cleared!')} className="mt-2 px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">Clear Cache</button> </div> </div> </section>
                ) : null}
            </main>
        </div>

        <footer className="flex-shrink-0 p-4 border-t flex justify-end items-center space-x-4 bg-gray-50">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"> Cancel </button>
            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"> Save Changes </button>
        </footer>
      </div>
    </div>
  );
};
