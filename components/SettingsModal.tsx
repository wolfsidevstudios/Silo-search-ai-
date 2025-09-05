import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { LogoIcon } from './icons/LogoIcon';
import { OpenAIIcon } from './icons/OpenAIIcon';
import { AnthropicIcon } from './icons/AnthropicIcon';
import { InfoIcon } from './icons/InfoIcon';
import { PrivacyIcon } from './icons/PrivacyIcon';
import { ReleaseNotesIcon } from './icons/ReleaseNotesIcon';


interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: { [key: string]: string };
  onApiKeysChange: (keys: { [key: string]: string }) => void;
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

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, apiKeys, onApiKeysChange }) => {
  const [localApiKeys, setLocalApiKeys] = useState(apiKeys);
  const [activeProvider, setActiveProvider] = useState('gemini');

  useEffect(() => {
    if (isOpen) {
        setLocalApiKeys(apiKeys);
    }
  }, [isOpen, apiKeys]);
  
  const handleSave = () => {
    onApiKeysChange(localApiKeys);
    onClose();
  };

  const handleInputChange = (provider: string, value: string) => {
    setLocalApiKeys(prev => ({ ...prev, [provider]: value }));
  };
  
  const activeItemData = allNavItems.find(p => p.id === activeProvider);


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
                    <div className="space-y-2">
                      {items.map(item => (
                          <button
                              key={item.id}
                              onClick={() => setActiveProvider(item.id)}
                              className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left text-sm font-medium transition-colors ${
                                  activeProvider === item.id ? 'bg-black/10 text-gray-900' : 'text-gray-600 hover:bg-black/5'
                              }`}
                          >
                              <item.Icon className="w-6 h-6 flex-shrink-0" />
                              <span>{item.name}</span>
                          </button>
                      ))}
                    </div>
                </div>
              ))}
            </nav>
            <main className="w-2/3 md:w-3/4 p-6 md:p-8 overflow-y-auto">
                {activeProvider === 'about' ? (
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
                ) : activeProvider === 'privacy' ? (
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
                ) : activeProvider === 'releaseNotes' ? (
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