import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import type { UserProfile } from '../types';
import { TtsIcon } from './icons/TtsIcon';
import { SttIcon } from './icons/SttIcon';
import { VoiceCloningIcon } from './icons/VoiceCloningIcon';
import { DubbingIcon } from './icons/DubbingIcon';
import { StsIcon } from './icons/StsIcon';
import { VoiceChangerIcon } from './icons/VoiceChangerIcon';
import { VoiceIsolatorIcon } from './icons/VoiceIsolatorIcon';
import { MusicIcon } from './icons/MusicIcon';
import { SoundEffectsIcon } from './icons/SoundEffectsIcon';

interface AiLabsPageProps {
  navigate: (path: string) => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

const tools = [
  { id: 'tts', name: 'Text-to-Speech', description: 'Convert written text into natural, lifelike audio.', Icon: TtsIcon },
  { id: 'stt', name: 'Speech-to-Text', description: 'Transcribe spoken audio into text across many languages.', Icon: SttIcon },
  { id: 'voice-clone', name: 'Voice Cloning & Design', description: 'Create a digital copy of a voice or design a new one.', Icon: VoiceCloningIcon },
  { id: 'dubbing', name: 'AI Dubbing', description: 'Translate and dub audio and video content.', Icon: DubbingIcon },
  { id: 'sts', name: 'Speech-to-Speech', description: 'Transform one voice into another, maintaining intonation.', Icon: StsIcon },
  { id: 'voice-changer', name: 'Voice Changer', description: 'Modify voices from existing audio files.', Icon: VoiceChangerIcon },
  { id: 'voice-isolator', name: 'Voice Isolator', description: 'Isolate voices from background noise in an audio file.', Icon: VoiceIsolatorIcon },
  { id: 'sound-effects', name: 'Sound Effects', description: 'Generate cinematic sound effects from text prompts.', Icon: SoundEffectsIcon },
  { id: 'music', name: 'Music Generation', description: 'Compose royalty-free music in any genre.', Icon: MusicIcon },
];

const ToolCard: React.FC<{ tool: typeof tools[0]; onClick: () => void; }> = ({ tool, onClick }) => (
    <button onClick={onClick} className="text-left p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4">
            <tool.Icon className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-lg text-gray-900">{tool.name}</h3>
        <p className="mt-1 text-sm text-gray-600">{tool.description}</p>
    </button>
);

export const AiLabsPage: React.FC<AiLabsPageProps> = ({ navigate, onOpenLegalPage, ...headerProps }) => {
    return (
        <div className="flex flex-col min-h-screen ai-labs-background">
            <Header {...headerProps} activeTab="ai-labs" onNavigate={navigate} />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">AI Labs</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        A playground of powerful generative AI tools for audio, music, and more.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {tools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} onClick={() => navigate(`/labs/${tool.id}`)} />
                    ))}
                </div>
            </main>
            <Footer onOpenLegalPage={onOpenLegalPage} />
        </div>
    );
};
