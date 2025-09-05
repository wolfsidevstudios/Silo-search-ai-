

import React, { useState, useEffect, useRef } from 'react';
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
import { Clock } from './Clock';
import { STICKERS } from './sticker-library';
import type { ClockSettings, CustomSticker } from '../types';
import { SearchIcon } from './icons/SearchIcon';


interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: string;
  apiKeys: { [key: string]: string };
  onApiKeysChange: (keys: { [key: string]: string }) => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  isClockVisible: boolean;
  onIsClockVisibleChange: (isVisible: boolean) => void;
  clockSettings: ClockSettings;
  onClockSettingsChange: (settings: ClockSettings) => void;
  onAddSticker: (stickerId: string) => void;
  onClearStickers: () => void;
  onEnterStickerEditMode: () => void;
  customStickers: CustomSticker[];
  onAddCustomSticker: (imageData: string, name: string) => void;
}

const navSections = {
  "AI Providers": [
    { 
      id: 'gemini', 
      name: 'Google Gemini', 
      Icon: (props: any) => <LogoIcon {...props} />,
      description: 'The Silo Search core functionality is powered by Gemini. You can get your API key from Google AI Studio.',
      placeholder: 'Enter your Google Gemini API key',
      getLink: 'https://aistudio.google.com/app/apikey'
    },
    { 
      id: 'openai', 
      name: 'OpenAI', 
      Icon: OpenAIIcon,
      description: 'You can find your OpenAI API key on your OpenAI account page.',
      placeholder: 'Enter your OpenAI API key (e.g., sk-...)',
      getLink: 'https://platform.openai.com/api-keys'
    },
    { 
      id: 'anthropic', 
      name: 'Anthropic', 
      Icon: AnthropicIcon,
      description: 'Access your Anthropic API key from the Anthropic console settings.',
      placeholder: 'Enter your Anthropic API key',
      getLink: 'https://console.anthropic.com/settings/keys'
    },
  ],
  "Appearance": [
    {
      id: 'clock',
      name: 'Clock Display',
      Icon: ClockIcon,
    },
    {
      id: 'wallpaper',
      name: 'Wallpaper',
      Icon: WallpaperIcon,
    },
    {
      id: 'stickers',
      name: 'Stickers',
      Icon: StickerIcon,
    },
  ],
  "Information": [
    {
      id: 'about',
      name: 'About',
      Icon: InfoIcon,
    },
    {
      id: 'privacy',
      name: 'Privacy Policy',
      Icon: PrivacyIcon,
    },
    {
      id: 'releaseNotes',
      name: 'Release Notes',
      Icon: ReleaseNotesIcon,
    }
  ]
};

const allNavItems = Object.values(navSections).flat();

const wallpapers = {
  Default: [
    { name: 'White', class: 'bg-white' },
    { name: 'Light Gray', class: 'bg-gray-100' },
  ],
  Gradients: [
    { name: 'Peachy', class: 'theme-gradient-2' },
    { name: 'Lavender', class: 'theme-gradient-1' },
    { name: 'Minty', class: 'theme-gradient-3' },
    { name: 'Ocean', class: 'theme-gradient-4' },
    { name: 'Sunset', class: 'theme-gradient-5' },
  ],
  Animated: [
    { name: 'Aurora', class: 'theme-animated-1' },
    { name: 'Nebula', class: 'theme-animated-2' },
  ]
};

const clockThemes = [
  { id: 'classic', name: 'Classic', darkClass: 'bg-[#006A4E]', lightClass: 'bg-[#7FFFD4]' },
  { id: 'mint', name: 'Mint', darkClass: 'bg-emerald-700', lightClass: 'bg-green-300' },
  { id: 'peach', name: 'Peach', darkClass: 'bg-orange-600', lightClass: 'bg-amber-300' },
  { id: 'mono', name: 'Mono', darkClass: 'bg-black', lightClass: 'bg-gray-400' },
  { id: 'ocean', name: 'Ocean', darkClass: 'bg-blue-800', lightClass: 'bg-sky-400' },
  { id: 'sunset', name: 'Sunset', darkClass: 'bg-purple-800', lightClass: 'bg-orange-400' },
  { id: 'forest', name: 'Forest', darkClass: 'bg-green-900', lightClass: 'bg-lime-500' },
  { id: 'neon', name: 'Neon', darkClass: 'bg-pink-500', lightClass: 'bg-cyan-300' },
  { id: 'candy', name: 'Candy', darkClass: 'bg-red-500', lightClass: 'bg-yellow-300' },
];

const clockFonts = [
    { id: 'fredoka', name: 'Bubbly', className: "font-['Fredoka_One']" },
    { id: 'serif', name: 'Serif', className: "font-['Roboto_Slab']" },
    { id: 'mono', name: 'Mono', className: "font-['Roboto_Mono']" },
    { id: 'pacifico', name: 'Script', className: "font-['Pacifico']" },
    { id: 'bungee', name: 'Blocky', className: "font-['Bungee']" },
    { id: 'press-start', name: 'Pixel', className: "font-['Press_Start_2P'] text-xs" },
    { id: 'caveat', name: 'Handwriting', className: "font-['Caveat'] text-2xl" },
];

const WallpaperSwatch: React.FC<{ themeClass: string; isSelected: boolean; onClick: () => void; }> = ({ themeClass, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full h-16 rounded-lg border-2 transition-all ${isSelected ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-300'}`}
    aria-label={`Select theme: ${themeClass}`}
  >
    <div className={`w-full h-full rounded-md flex items-center justify-center ${themeClass}`}>
      {isSelected && (
        <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-blue-600">
            <CheckIcon />
        </div>
      )}
    </div>
  </button>
);


const ClockThemeSwatch: React.FC<{ theme: { name: string, darkClass: string, lightClass: string }, isSelected: boolean, onClick: () => void }> = ({ theme, isSelected, onClick }) => (
    <button onClick={onClick} className={`p-2 rounded-lg border-2 w-full text-left ${isSelected ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}`}>
        <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-full ${theme.darkClass}`}></div>
            <div className={`w-6 h-6 rounded-full ${theme.lightClass}`}></div>
            <span className="text-sm font-medium text-gray-800">{theme.name}</span>
        </div>
    </button>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialSection, apiKeys, onApiKeysChange, currentTheme, onThemeChange, isClockVisible, onIsClockVisibleChange, clockSettings, onClockSettingsChange, onAddSticker, onClearStickers, onEnterStickerEditMode, customStickers, onAddCustomSticker }) => {
  const [activeSection, setActiveSection] = useState('gemini');
  const [localApiKeys, setLocalApiKeys] = useState(apiKeys);
  const [localClockSettings, setLocalClockSettings] = useState(clockSettings);
  const [localIsClockVisible, setLocalIsClockVisible] = useState(isClockVisible);
  const [localTheme, setLocalTheme] = useState(currentTheme);
  const [stickerSearch, setStickerSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isOpen) {
        setActiveSection(initialSection || 'gemini');
        setLocalApiKeys(apiKeys);
        setLocalClockSettings(clockSettings);
        setLocalIsClockVisible(isClockVisible);
        setLocalTheme(currentTheme);
        setStickerSearch('');
    }
  }, [isOpen, initialSection, apiKeys, clockSettings, isClockVisible, currentTheme]);
  
  const handleSave = () => {
    onApiKeysChange(localApiKeys);
    onClockSettingsChange(localClockSettings);
    onIsClockVisibleChange(localIsClockVisible);
    onThemeChange(localTheme);
    onClose();
  };

  const handleInputChange = (provider: string, value: string) => {
    setLocalApiKeys(prev => ({ ...prev, [provider]: value }));
  };
  
  const handleAddStickerAndEdit = (stickerId: string) => {
    onAddSticker(stickerId);
    onEnterStickerEditMode();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, GIF, etc.).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert('File size should not exceed 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      const name = file.name.split('.').slice(0, -1).join('.') || 'My Sticker';
      onAddCustomSticker(imageData, name);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Sorry, there was an error uploading your sticker.');
    };
    reader.readAsDataURL(file);

    // Reset file input value so the user can upload the same file again if needed
    event.target.value = '';
  };

  const activeItemData = allNavItems.find(p => p.id === activeSection);


  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] max-h-[700px] flex flex-col transform transition-all">
        <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 id="settings-modal-title" className="text-xl font-bold text-gray-800">
            Settings & Information
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors" 
            aria-label="Close settings"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="flex-grow flex min-h-0">
            <nav className="w-1/3 md:w-1/4 border-r bg-gray-50/50 p-4 overflow-y-auto">
               {Object.entries(navSections).map(([sectionTitle, items]) => (
                <div key={sectionTitle} className="mb-4 last:mb-0">
                    <p className="px-2 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{sectionTitle}</p>
                    <div className="space-y-1">
                      {items.map(item => (
                          <button
                              key={item.id}
                              onClick={() => setActiveSection(item.id)}
                              className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left text-sm font-medium transition-colors ${
                                  activeSection === item.id ? 'bg-black/10 text-gray-900' : 'text-gray-600 hover:bg-black/5'
                              }`}
                          >
                              <item.Icon className="w-5 h-5 flex-shrink-0" />
                              <span>{item.name}</span>
                          </button>
                      ))}
                    </div>
                </div>
              ))}
            </nav>
            <main className="w-2/3 md:w-3/4 p-6 md:p-8 overflow-y-auto">
                {activeSection === 'about' ? (
                 <section className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">About Silo Search</h3>
                        <p className="mt-2 text-gray-600">Version 1.2.0</p>
                    </div>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <p>Silo Search is an intelligent search application designed to provide quick, concise, and accurate summaries for your queries, powered by leading AI models.</p>
                      <p>Our mission is to streamline your access to information, cutting through the noise to deliver what you need, when you need it.</p>
                      <p>For more details, please review our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
                    </div>
                     <div className="pt-4 text-center text-xs text-gray-400">
                        <p>Made with ❤️</p>
                    </div>
                </section>
                ) : activeSection === 'privacy' ? (
                    <section className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Privacy Policy</h3>
                            <p className="mt-2 text-gray-600">Last updated: August 1, 2024</p>
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-700">
                        <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use Silo Search.</p>
                        <h4>Information We Collect</h4>
                        <p>We may collect information about you in a variety of ways. The information we may collect via the Application includes:</p>
                        <ul>
                            <li><strong>API Keys:</strong> We store your AI provider API keys in your browser's local storage. These keys are never transmitted to our servers and are used directly by your browser to communicate with the respective AI provider APIs.</li>
                            <li><strong>Search History:</strong> Your recent searches are stored in your browser's local storage to provide you with a history feature. This data is not sent to our servers. You can clear this history at any time.</li>
                            <li><strong>Usage Data:</strong> We do not collect any personal or usage data. All processing happens on your local device.</li>
                        </ul>
                        <h4>How We Use Your Information</h4>
                        <p>We use the information stored locally on your device to provide and improve the functionality of the application, such as personalizing your experience by remembering recent searches and themes.</p>
                        <h4>Data Security</h4>
                        <p>We are committed to protecting your data. Since all sensitive data like API keys and search history is stored on your device, you have full control over it. We do not have access to this information.</p>
                        </div>
                    </section>
                ) : activeSection === 'releaseNotes' ? (
                     <section className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">Release Notes</h3>
                        </div>
                        <div className="prose prose-sm max-w-none text-gray-700 space-y-8">
                            <div>
                              <h4>Version 1.2.0 <span className="text-xs text-gray-500 font-normal ml-2">August 1, 2024</span></h4>
                              <ul>
                                  <li>Added Privacy Policy and Release Notes to the settings menu.</li>
                                  <li>Introduced new icons for better navigation in settings.</li>
                              </ul>
                            </div>
                            <div>
                              <h4>Version 1.1.0 <span className="text-xs text-gray-500 font-normal ml-2">July 28, 2024</span></h4>
                              <ul>
                                  <li>Added an "About" section to settings.</li>
                                  <li>Streamlined the settings UI for a cleaner look.</li>
                              </ul>
                            </div>
                             <div>
                              <h4>Version 1.0.0 <span className="text-xs text-gray-500 font-normal ml-2">July 20, 2024</span></h4>
                              <ul>
                                  <li>Initial release of Silo Search.</li>
                                  <li>Core search functionality with Google Gemini.</li>
                                  <li>Support for multiple AI provider API keys (Gemini, OpenAI, Anthropic).</li>
                                  <li>Recent search history and customizable themes.</li>
                              </ul>
                            </div>
                        </div>
                    </section>
                ) : activeSection === 'clock' ? (
                    <section>
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Clock Customization</h3>
                            <p className="mt-2 text-gray-600">
                                Personalize the clock displayed on the home screen. Changes are previewed below.
                            </p>
                        </div>
                        <div className="bg-gray-800 rounded-xl p-8 mb-8 flex items-center justify-center min-h-[200px] overflow-hidden">
                            <Clock settings={localClockSettings} />
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50">
                                <label htmlFor="clock-toggle" className="font-medium text-gray-700">Show home screen clock</label>
                                <button
                                    id="clock-toggle"
                                    role="switch"
                                    aria-checked={localIsClockVisible}
                                    onClick={() => setLocalIsClockVisible(v => !v)}
                                    className={`${localIsClockVisible ? 'bg-black' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black`}
                                >
                                    <span className={`${localIsClockVisible ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                </button>
                            </div>
                             <div>
                                <h4 className="font-medium text-gray-800 mb-3">Animation</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <button onClick={() => setLocalClockSettings(s => ({ ...s, animation: 'none' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.animation === 'none' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>None</button>
                                    <button onClick={() => setLocalClockSettings(s => ({ ...s, animation: 'pulse' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.animation === 'pulse' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Pulse</button>
                                    <button onClick={() => setLocalClockSettings(s => ({ ...s, animation: 'float' }))} className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.animation === 'float' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>Float</button>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Style</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <button
                                        onClick={() => setLocalClockSettings(s => ({ ...s, style: 'horizontal' }))}
                                        className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.style === 'horizontal' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        Horizontal
                                    </button>
                                    <button
                                        onClick={() => setLocalClockSettings(s => ({ ...s, style: 'stacked' }))}
                                        className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.style === 'stacked' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        Stacked
                                    </button>
                                     <button
                                        onClick={() => setLocalClockSettings(s => ({ ...s, style: 'diagonal' }))}
                                        className={`p-4 border rounded-lg text-center transition-colors ${localClockSettings.style === 'diagonal' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                    >
                                        Diagonal
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Theme</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {clockThemes.map(theme => (
                                        <ClockThemeSwatch 
                                            key={theme.id}
                                            theme={theme}
                                            isSelected={localClockSettings.theme === theme.id}
                                            onClick={() => setLocalClockSettings(s => ({ ...s, theme: theme.id as ClockSettings['theme'] }))}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Font</h4>
                                <div className="flex flex-wrap gap-4">
                                    {clockFonts.map(font => (
                                        <button
                                            key={font.id}
                                            onClick={() => setLocalClockSettings(s => ({ ...s, font: font.id as ClockSettings['font'] }))}
                                            className={`p-4 border rounded-lg text-center transition-colors grow basis-24 ${font.className} ${localClockSettings.font === font.id ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                        >
                                            {font.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Size</h4>
                                <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50/50">
                                    <input 
                                        type="range"
                                        min="8" max="14" step="0.5"
                                        value={localClockSettings.size}
                                        onChange={(e) => setLocalClockSettings(s => ({ ...s, size: parseFloat(e.target.value) }))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="font-mono text-sm text-gray-600 w-20 text-right">{localClockSettings.size.toFixed(1)}rem</span>
                                </div>
                            </div>
                             <div>
                                <h4 className="font-medium text-gray-800 mb-3">Outline Thickness</h4>
                                <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50/50">
                                    <input 
                                        type="range"
                                        min="0" max="8" step="1"
                                        value={localClockSettings.thickness}
                                        onChange={(e) => setLocalClockSettings(s => ({ ...s, thickness: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="font-mono text-sm text-gray-600 w-20 text-right">{localClockSettings.thickness}px</span>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : activeSection === 'wallpaper' ? (
                    <section>
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Wallpaper</h3>
                            <p className="mt-2 text-gray-600">
                                Choose a background for the application.
                            </p>
                        </div>
                         <div className="space-y-6">
                            {Object.entries(wallpapers).map(([category, themeList]) => (
                            <div key={category}>
                                <h3 className="text-sm font-medium text-gray-500 mb-3">{category}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                {themeList.map(theme => (
                                    <WallpaperSwatch 
                                    key={theme.class}
                                    themeClass={theme.class}
                                    isSelected={localTheme === theme.class}
                                    onClick={() => setLocalTheme(theme.class)}
                                    />
                                ))}
                                </div>
                            </div>
                            ))}
                        </div>
                    </section>
                ) : activeSection === 'stickers' ? (
                    <section>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                            aria-hidden="true"
                        />
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-800">Stickers</h3>
                            <p className="mt-2 text-gray-600">
                                Add some flair to your home screen! Click a sticker to add it, or upload your own.
                            </p>
                        </div>
                         <div className="relative mb-4">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                value={stickerSearch}
                                onChange={(e) => setStickerSearch(e.target.value)}
                                placeholder="Search stickers..."
                                className="block w-full rounded-full border-0 bg-gray-100 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                            />
                        </div>
                         <div className="mb-4 flex space-x-2">
                            <button
                                onClick={onEnterStickerEditMode}
                                className="w-full px-4 py-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Arrange Stickers
                            </button>
                            <button
                                onClick={handleUploadClick}
                                className="w-full px-4 py-3 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
                            >
                                Upload Your Own
                            </button>
                        </div>
                        {(() => {
                            const lowercasedQuery = stickerSearch.toLowerCase();
                            const filteredLibraryStickers = STICKERS.filter(sticker => 
                                sticker.name.toLowerCase().includes(lowercasedQuery)
                            );
                            const filteredCustomStickers = customStickers.filter(sticker => 
                                sticker.name.toLowerCase().includes(lowercasedQuery)
                            );
                            const hasResults = filteredLibraryStickers.length > 0 || filteredCustomStickers.length > 0;

                            if (!hasResults) {
                                return <p className="text-center text-gray-500 py-8">No stickers found for "{stickerSearch}"</p>;
                            }

                            return (
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                    {/* Library Stickers */}
                                    {filteredLibraryStickers.map(sticker => (
                                        <button
                                            key={sticker.id}
                                            onClick={() => handleAddStickerAndEdit(sticker.id)}
                                            className="p-4 bg-gray-100 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-200 transition-colors aspect-square"
                                            title={`Add ${sticker.name} sticker`}
                                        >
                                            <div className="w-12 h-12">
                                                <sticker.component />
                                            </div>
                                            <span className="text-xs text-gray-600 truncate">{sticker.name}</span>
                                        </button>
                                    ))}
                                    {/* Custom Stickers */}
                                    {filteredCustomStickers.map(sticker => (
                                        <button
                                            key={sticker.id}
                                            onClick={() => handleAddStickerAndEdit(sticker.id)}
                                            className="p-4 bg-gray-100 rounded-lg flex flex-col items-center justify-center space-y-2 hover:bg-gray-200 transition-colors aspect-square"
                                            title={`Add ${sticker.name} sticker`}
                                        >
                                            <div className="w-12 h-12">
                                                <img src={sticker.imageData} alt={sticker.name} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-xs text-gray-600 truncate">{sticker.name}</span>
                                        </button>
                                    ))}
                                </div>
                            );
                        })()}
                        <div className="mt-8 border-t pt-6">
                             <button
                                onClick={onClearStickers}
                                className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                            >
                                Clear All Stickers
                            </button>
                        </div>
                    </section>
                ) : activeItemData && 'placeholder' in activeItemData ? (
                <section className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{activeItemData.name} API Key</h3>
                        <p className="mt-2 text-gray-600">
                            {activeItemData.description}
                            <a href={activeItemData.getLink} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 hover:underline">
                                Get key
                            </a>
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="apiKeyInput" className="font-medium text-gray-700">API Key</label>
                        <input 
                            id="apiKeyInput"
                            type="password" 
                            value={localApiKeys[activeItemData.id] || ''}
                            onChange={(e) => handleInputChange(activeItemData.id, e.target.value)}
                            placeholder={activeItemData.placeholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </section>
                ) : null}
            </main>
        </div>


        <footer className="flex-shrink-0 p-4 border-t flex justify-end items-center space-x-4 bg-gray-50">
            <button 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave} 
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
            >
                Save Changes
            </button>
        </footer>
      </div>
    </div>
  );
};