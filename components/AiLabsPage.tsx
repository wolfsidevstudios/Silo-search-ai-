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
  { id: 'image-generation', name: 'Image Generation', description: 'Create stunning, high-quality visuals from a simple text description with Imagen.', Icon: ImageIcon },
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

const LabToolCard: React.FC<{ tool: typeof tools[0]; onClick: () => void; }> = ({ tool, onClick }) => (
  <button onClick={onClick} className="lab-tool-card w-full">
    <div className="lab-card-image-container">
      <div className={`lab-card-image lab-image-${tool.id}`}></div>
    </div>
    <div className="lab-card-content">
      <h3 className="font-bold text-xl text-gray-900">{tool.name}</h3>
      <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
      <div className="try-now-button">Try now</div>
    </div>
  </button>
);


export const AiLabsPage: React.FC<AiLabsPageProps> = ({ navigate, onOpenLegalPage, ...headerProps }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header {...headerProps} activeTab="ai-labs" onNavigate={navigate} />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="text-left mb-12 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">AI Labs</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        A playground of powerful generative AI tools for audio, music, images and more.
                    </p>
                </div>
                <div className="flex flex-col items-center space-y-6 max-w-4xl mx-auto">
                    {tools.map(tool => (
                        <LabToolCard key={tool.id} tool={tool} onClick={() => navigate(`/labs/${tool.id}`)} />
                    ))}
                </div>
            </main>
            <Footer onOpenLegalPage={onOpenLegalPage} />
        </div>
    );
};