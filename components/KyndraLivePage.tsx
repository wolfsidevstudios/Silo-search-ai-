import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob as GenaiBlob } from "@google/genai";
import { VoiceIcon } from './icons/VoiceIcon';
import { PauseIcon } from './icons/PauseIcon';

interface KyndraLivePageProps {
  geminiApiKey: string;
  onExit: () => void;
}

// Audio decoding functions from documentation
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// Audio encoding function from documentation
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}


export const KyndraLivePage: React.FC<KyndraLivePageProps> = ({ geminiApiKey, onExit }) => {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'error' | 'ended'>('idle');
  const [isHoldingToSpeak, setIsHoldingToSpeak] = useState(false);
  const [isAiOnHold, setIsAiOnHold] = useState(false);
  
  const isHoldingToSpeakRef = useRef(isHoldingToSpeak);
  isHoldingToSpeakRef.current = isHoldingToSpeak;

  const audioCleanupRef = useRef<() => void>(() => {});
  const outputAudioContext = useRef<AudioContext | null>(null);
  const outputNode = useRef<GainNode | null>(null);
  const sources = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTime = useRef(0);

  useEffect(() => {
    if (!geminiApiKey) {
      setStatus('error');
      console.error("Gemini API key is missing.");
      return;
    }

    setStatus('connecting');
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    outputNode.current = outputAudioContext.current.createGain();
    outputNode.current.connect(outputAudioContext.current.destination);
    
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: async () => {
          setStatus('connected');
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          const source = inputAudioContext.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            if (isHoldingToSpeakRef.current) {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: GenaiBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then((s) => s.sendRealtimeInput({ media: pcmBlob }));
            }
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
          
          audioCleanupRef.current = () => {
              scriptProcessor.disconnect();
              source.disconnect();
              inputAudioContext.close().catch(console.error);
              stream.getTracks().forEach(track => track.stop());
          };
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
          if (base64EncodedAudioString) {
            setStatus('speaking');
            const ctx = outputAudioContext.current;
            const node = outputNode.current;
            if (ctx && node) {
              nextStartTime.current = Math.max(nextStartTime.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(node);
              source.addEventListener('ended', () => {
                sources.current.delete(source);
                if (sources.current.size === 0 && status !== 'ended') {
                    setStatus('connected');
                }
              });
              source.start(nextStartTime.current);
              nextStartTime.current += audioBuffer.duration;
              sources.current.add(source);
            }
          }
          if (message.serverContent?.interrupted) {
            for (const source of sources.current.values()) {
              source.stop();
              sources.current.delete(source);
            }
            nextStartTime.current = 0;
          }
          if (message.serverContent?.turnComplete) {
              if (status !== 'ended' && sources.current.size === 0) setStatus('connected');
          }
        },
        onerror: (e: ErrorEvent) => {
          console.error('Live session error:', e);
          setStatus('error');
        },
        onclose: (e: CloseEvent) => {
          if (status !== 'ended') setStatus('ended');
        },
      },
      config: {
        responseModalities: [Modality.AUDIO],
      },
    });
    
    sessionPromise.then(setSession);
    
    return () => {
        sessionPromise.then(s => s.close());
        audioCleanupRef.current();
        outputAudioContext.current?.close().catch(console.error);
    };
  }, [geminiApiKey]);

  useEffect(() => {
    if (outputAudioContext.current && outputNode.current) {
        outputNode.current.gain.setValueAtTime(isAiOnHold ? 0 : 1, outputAudioContext.current.currentTime);
    }
  }, [isAiOnHold]);
  
  const handleEndCall = () => {
    setStatus('ended');
    session?.close();
    audioCleanupRef.current();
    onExit();
  };

  const handleHoldToSpeak = () => {
    setIsHoldingToSpeak(true);
    setStatus('listening');
  };

  const handleReleaseToSpeak = () => {
    setIsHoldingToSpeak(false);
    if (status === 'listening') setStatus('connected');
  };

  return (
    <div className="kyndra-live-bg fixed inset-0 flex flex-col items-center justify-between text-white p-8 overflow-hidden">
      <div className="live-wave-gradient"></div>
      
      <div className="relative z-10 text-center pt-8">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <VoiceIcon className="w-8 h-8"/>
          <span>Kyndra Live</span>
        </h1>
        <p className="mt-4 text-gray-300 h-6">
            {status === 'connecting' && 'Connecting...'}
            {status === 'connected' && 'Hold the button to speak'}
            {status === 'listening' && 'Listening...'}
            {status === 'speaking' && '...'}
            {status === 'error' && 'Connection error. Please try again.'}
        </p>
      </div>

      <div className="relative z-10 w-full max-w-sm flex items-center justify-center gap-12">
        <div className="flex flex-col items-center">
            <button
                onClick={() => setIsAiOnHold(!isAiOnHold)}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${isAiOnHold ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white'}`}
                aria-label={isAiOnHold ? "Resume AI" : "Put AI on hold"}
            >
                <PauseIcon className={`w-8 h-8`} />
            </button>
            <span className="mt-3 font-medium text-gray-300">Hold</span>
        </div>
        
        <div className="flex flex-col items-center">
          <button 
            onMouseDown={handleHoldToSpeak}
            onMouseUp={handleReleaseToSpeak}
            onTouchStart={(e) => { e.preventDefault(); handleHoldToSpeak(); }}
            onTouchEnd={handleReleaseToSpeak}
            disabled={status !== 'connected' && status !== 'listening'}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${isHoldingToSpeak ? 'bg-white scale-110' : 'bg-white/80'}`}
            aria-label="Hold to speak"
          >
            <VoiceIcon className={`w-10 h-10 transition-colors ${isHoldingToSpeak ? 'text-black' : 'text-gray-700'}`} />
          </button>
          <span className="mt-3 font-medium text-gray-300">Speak</span>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={handleEndCall} className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors" aria-label="End call">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.25-3.77-6.6-6.6l1.97-1.57c.27-.27.36-.66.24-1.01-.36-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.72 21 20.01 21c.75 0 .99-.65.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
          </button>
          <span className="mt-3 font-medium text-gray-300">End</span>
        </div>
      </div>
    </div>
  );
};