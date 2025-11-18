import React from 'react';
import type { DeepResearchResult, UserProfile } from '../types';
import { Header } from './Header';
import { Footer } from './Footer';
import { SearchInput } from './SearchInput';
import { CopyIcon } from './icons/CopyIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { KeyIcon as KeyTakeawaysIcon } from './icons/KeyIcon';
import { LinkIcon } from './icons/LinkIcon';

interface DeepResearchPageProps {
  result: DeepResearchResult;
  onSearch: (query: string, options: { researchSearch?: boolean; }) => void;
  onHome: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
  geminiApiKey: string;
}

export const DeepResearchPage: React.FC<DeepResearchPageProps> = ({ result, onSearch, onHome, geminiApiKey, ...headerProps }) => {

  const generateReportText = () => {
    let text = `Report: ${result.title}\n\n`;
    text += `INTRODUCTION\n${result.introduction}\n\n`;
    result.sections.forEach(section => {
      text += `SECTION: ${section.title}\n${section.content}\n\n`;
    });
    text += `CONCLUSION\n${result.conclusion}\n\n`;
    text += `KEY TAKEAWAYS\n- ${result.keyTakeaways.join('\n- ')}\n\n`;
    text += `SOURCES\n${result.sources.map(s => `- ${s.title}: ${s.uri}`).join('\n')}`;
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
  };

  const handleDownload = () => {
    const blob = new Blob([generateReportText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header {...headerProps} onHome={onHome} showHomeButton={true} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{result.title}</h1>
            <div className="mt-4 flex space-x-4">
              <button onClick={handleCopy} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black"><CopyIcon /><span>Copy Report</span></button>
              <button onClick={handleDownload} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black"><DownloadIcon /><span>Download Report</span></button>
            </div>
          </header>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border">
              <div className="prose prose-sm max-w-none">
                <h2>Introduction</h2>
                <p>{result.introduction}</p>
                {result.sections.map((section, index) => (
                  <div key={index}>
                    <h2>{section.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }} />
                  </div>
                ))}
                <h2>Conclusion</h2>
                <p>{result.conclusion}</p>
              </div>
            </div>

            <aside className="lg:col-span-1 mt-8 lg:mt-0 space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-md border">
                <h3 className="text-lg font-bold mb-4 flex items-center"><KeyTakeawaysIcon className="w-5 h-5 mr-2" /> Key Takeaways</h3>
                <ul className="space-y-3 text-sm list-disc list-inside">
                  {result.keyTakeaways.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border">
                <h3 className="text-lg font-bold mb-4 flex items-center"><LinkIcon className="w-5 h-5 mr-2" /> Sources</h3>
                <ul className="space-y-3 text-sm">
                  {result.sources.map((source, index) => (
                    <li key={index}>
                      <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline line-clamp-2" title={source.uri}>
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <footer className="sticky bottom-0 left-0 right-0 p-2 sm:p-4 bg-white/80 backdrop-blur-sm z-20">
        <div className="max-w-xl mx-auto">
          <SearchInput 
            onSearch={onSearch} 
            isLarge={false} 
            speechLanguage="en-US" 
            onOpenComingSoonModal={() => {}} 
            isStudyMode={false} 
            setIsStudyMode={() => {}} 
            summarizationSource={null}
            onOpenSummarizeSourceSelector={() => {}}
            onClearSummarizationSource={() => {}}
            geminiApiKey={geminiApiKey}
          />
          <Footer onOpenLegalPage={headerProps.onOpenLegalPage} className="p-0 pt-2 text-xs" />
        </div>
      </footer>
    </div>
  );
};