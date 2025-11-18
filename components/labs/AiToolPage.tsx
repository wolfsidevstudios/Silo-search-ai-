import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Header } from '../Header';
import { Footer } from '../Footer';
import type { UserProfile } from '../../types';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { LogoIcon } from '../icons/LogoIcon';
import { fetchTTSAudio } from '../../services/elevenLabsService';

interface AiToolPageProps {
  toolId: string;
  apiKeys: { [key: string]: string };
  navigate: (path: string) => void;
  onHome: () => void;
  isTemporaryMode: boolean;
  onToggleSidebar: () => void;
  onToggleTemporaryMode: () => void;
  onOpenSettings: (section?: string) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onOpenLegalPage: (page: 'privacy' | 'terms' | 'about') => void;
}

const toolDetails: { [key: string]: { name: string, placeholder: string } } = {
    'tts': { name: 'Text-to-Speech', placeholder: 'Enter text to convert to speech...' },
    'image-generation': { name: 'Image Generation', placeholder: 'A robot holding a red skateboard...' },
    'music': { name: 'Music Generation', placeholder: 'Describe the music you want to create...' },
    'stt': { name: 'Speech-to-Text', placeholder: 'This tool will transcribe audio files.' },
    'voice-clone': { name: 'Voice Cloning & Design', placeholder: 'This tool will clone or design voices.' },
    'dubbing': { name: 'AI Dubbing', placeholder: 'This tool will translate and dub audio.' },
    'sts': { name: 'Speech-to-Speech', placeholder: 'This tool will transform voices.' },
    'voice-changer': { name: 'Voice Changer', placeholder: 'This tool will modify voice audio.' },
    'voice-isolator': { name: 'Voice Isolator', placeholder: 'This tool will isolate voices from background noise.' },
    'sound-effects': { name: 'Sound Effects', placeholder: 'Describe a sound effect to generate...' },
};

const ELEVENLABS_VOICES: { [key: string]: string } = {
    'Rachel': '21m00Tcm4TlvDq8ikWAM',
    'Adam': 'pNInz6obpgDQGcFmaJgB',
    'Antoni': 'ErXwobaYiN019PkySvjV',
    'Bella': 'EXAVITQu4vr4xnSDxMaL',
    'Elli': 'MF3mGyEYCl7XYWbV9V6O',
};

const VOICES = Object.keys(ELEVENLABS_VOICES);

export const AiToolPage: React.FC<AiToolPageProps> = ({ toolId, apiKeys, navigate, ...headerProps }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    // TTS specific state
    const [selectedVoice, setSelectedVoice] = useState('Rachel');
    // Music specific state
    const [musicMode, setMusicMode] = useState<'lyrics' | 'instrumental'>('instrumental');

    useEffect(() => {
        return () => {
            if (resultUrl) URL.revokeObjectURL(resultUrl);
        }
    }, [resultUrl]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;
        
        setIsLoading(true);
        setError(null);
        setResultUrl(null);
        setGeneratedImage(null);

        try {
            if (toolId === 'tts') {
                if (!apiKeys.elevenlabs) {
                    throw new Error('Please set your ElevenLabs API key in settings.');
                }
                const voiceId = ELEVENLABS_VOICES[selectedVoice];
                const audioBlob = await fetchTTSAudio(prompt, apiKeys.elevenlabs, voiceId);
                const url = URL.createObjectURL(audioBlob);
                setResultUrl(url);
            } else if (toolId === 'image-generation') {
                if (!apiKeys.gemini) {
                    throw new Error('Please set your Google Gemini API key in settings.');
                }
                const ai = new GoogleGenAI({ apiKey: apiKeys.gemini });
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: prompt,
                    config: { numberOfImages: 1 },
                });
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                setGeneratedImage(imageUrl);
            } else {
                await new Promise(res => setTimeout(res, 1500));
                setError(`Tool "${toolDetails[toolId]?.name || toolId}" is not yet implemented.`);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const toolInfo = toolDetails[toolId] || { name: 'AI Lab Tool', placeholder: 'Enter your prompt...' };
    
    return (
        <div className="flex flex-col min-h-screen labs-bg-gradient">
            <Header {...headerProps} onHome={() => navigate('/labs')} showHomeButton={true} />
            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-3xl text-center">
                    <h1 className="text-3xl font-bold mb-8">{toolInfo.name}</h1>
                    <form onSubmit={handleGenerate} className="relative w-full">
                        <input
                            type="text"
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder={toolInfo.placeholder}
                            className="w-full pl-6 pr-16 py-4 text-lg bg-white/80 backdrop-blur-sm rounded-full border border-gray-300 shadow-lg focus:ring-2 focus:ring-purple-400 outline-none"
                        />
                        <button type="submit" disabled={isLoading} className="absolute right-3 top-3 bottom-3 w-12 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition disabled:bg-gray-300">
                            {isLoading ? <LogoIcon className="w-6 h-6 animate-spin" /> : <ArrowUpIcon />}
                        </button>
                    </form>

                    {toolId === 'tts' && (
                        <div className="mt-6">
                            <p className="text-sm font-medium text-gray-600 mb-2">Select a Voice</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {VOICES.map(voice => (
                                    <button key={voice} onClick={() => setSelectedVoice(voice)} className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${selectedVoice === voice ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:border-black'}`}>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full wavy-gradient flex-shrink-0"></div>
                                            <span>{voice}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {toolId === 'music' && (
                         <div className="mt-6">
                            <p className="text-sm font-medium text-gray-600 mb-2">Mode</p>
                            <div className="inline-flex bg-gray-200 p-1 rounded-full">
                               <button onClick={() => setMusicMode('instrumental')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${musicMode === 'instrumental' ? 'bg-white shadow' : 'text-gray-600'}`}>Instrumental</button>
                               <button onClick={() => setMusicMode('lyrics')} className={`px-4 py-1.5 text-sm font-semibold rounded-full ${musicMode === 'lyrics' ? 'bg-white shadow' : 'text-gray-600'}`}>With Lyrics</button>
                            </div>
                        </div>
                    )}
                    
                    <div className="mt-8">
                        {error && <p className="text-red-600">{error}</p>}
                        {resultUrl && toolId === 'tts' && (
                            <div className="space-y-2">
                                <h2 className="font-semibold">Result</h2>
                                <audio controls src={resultUrl} className="w-full max-w-md mx-auto"></audio>
                            </div>
                        )}
                        {generatedImage && toolId === 'image-generation' && (
                             <div className="space-y-4">
                                <h2 className="font-semibold">Result</h2>
                                <div className="max-w-md mx-auto aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                                    <img src={generatedImage} alt={prompt} className="w-full h-full object-contain" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer onOpenLegalPage={headerProps.onOpenLegalPage} />
        </div>
    );
};