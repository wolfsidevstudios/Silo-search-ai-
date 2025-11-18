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
import { ImageIcon } from './icons/ImageIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';

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

const FeaturedToolCard: React.FC<{ onClick: () => void; }> = ({ onClick }) => (
    <button onClick={onClick} className="md:col-span-3 text-left p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2">
            <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-4">
                <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-2xl text-gray-900">Image Generation</h3>
            <p className="mt-2 text-gray-600">Create stunning, high-quality visuals from a simple text description with Imagen.</p>
        </div>
        <div className="w-full md:w-1/2 h-48 md:h-full relative bg-gray-100 rounded-xl overflow-hidden image-gen-animation">
            <div className="prompt p-4">
                <div className="w-full max-w-sm p-1.5 pl-4 rounded-full bg-white border border-gray-200 flex items-center">
                    <SearchIcon className="text-gray-400 w-4 h-4" />
                    <p className="ml-2 text-gray-700 text-xs flex-grow text-left">a robot holding a red skateboard</p>
                    <div className="ml-auto flex-shrink-0 w-6 h-6 flex items-center justify-center bg-black text-white rounded-full"><ArrowRightIcon /></div>
                </div>
            </div>
            <div className="shimmer-bar"></div>
            <div className="image-placeholder bg-cover bg-center" style={{ backgroundImage: "url('https://storage.googleapis.com/gweb-aip-demos/imagen3/desktop/4_A_robot_holding_a_red_skateboard.jpg')" }}></div>
        </div>
    </button>
);

export const AiLabsPage: React.FC<AiLabsPageProps> = ({ navigate, onOpenLegalPage, ...headerProps }) => {
    return (
        <div className="flex flex-col min-h-screen ai-labs-background">
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            
            <Header {...headerProps} activeTab="ai-labs" onNavigate={navigate} />

            <main className="relative z-10 flex-grow container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">AI Labs</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        A playground of powerful generative AI tools for audio, music, images and more.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <FeaturedToolCard onClick={() => navigate('/labs/image-generation')} />
                    {tools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} onClick={() => navigate(`/labs/${tool.id}`)} />
                    ))}
                </div>
            </main>
            <Footer onOpenLegalPage={onOpenLegalPage} />
        </div>
    );
};