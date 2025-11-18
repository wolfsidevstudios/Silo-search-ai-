import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob as GenaiBlob } from "@google/genai";
import { LogoIcon } from './icons/LogoIcon';
import { VoiceIcon } from './icons/VoiceIcon';

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
  const [isHolding, setIsHolding] = useState(false);
  
  const isHoldingRef = useRef(isHolding);
  isHoldingRef.current = isHolding;

  const audioCleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!geminiApiKey) {
      setStatus('error');
      console.error("Gemini API key is missing.");
      return;
    }

    setStatus('connecting');
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    let nextStartTime = 0;
    const sources = new Set<AudioBufferSourceNode>();

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
            if (isHoldingRef.current) {
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
              inputAudioContext.close();
              stream.getTracks().forEach(track => track.stop());
          };
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
          if (base64EncodedAudioString) {
            setStatus('speaking');
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const audioBuffer = await decodeAudioData(decode(base64EncodedAudioString), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start();
          }
          if (message.serverContent?.turnComplete) {
              if (status !== 'ended') setStatus('connected');
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
    };
  }, [geminiApiKey]);
  
  const handleEndCall = () => {
    setStatus('ended');
    session?.close();
    audioCleanupRef.current();
    onExit();
  };

  const handleHold = () => {
    setIsHolding(true);
    setStatus('listening');
  };

  const handleRelease = () => {
    setIsHolding(false);
    if (status === 'listening') setStatus('connected');
  };

  return (
    <div className="kyndra-live-bg fixed inset-0 flex flex-col items-center justify-between text-white p-8 overflow-hidden">
      <div className="live-wave-gradient"></div>
      
      <div className="relative z-10 text-center">
        <h1 className="text-3xl font-bold flex items-center space-x-2">
          <VoiceIcon className="w-8 h-8"/>
          <span>Kyndra Live</span>
        </h1>
        <p className="mt-4 text-gray-300">
            {status === 'connecting' && 'Connecting...'}
            {status === 'connected' && 'Hold to speak'}
            {status === 'listening' && 'Listening...'}
            {status === 'speaking' && '...'}
            {status === 'error' && 'Connection error. Please try again.'}
        </p>
      </div>

      <div className="relative z-10 w-full max-w-xs flex items-center justify-center gap-12">
        <div className="flex flex-col items-center">
          <button 
            onMouseDown={handleHold}
            onMouseUp={handleRelease}
            onTouchStart={(e) => { e.preventDefault(); handleHold(); }}
            onTouchEnd={handleRelease}
            disabled={status !== 'connected' && status !== 'listening'}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${isHolding ? 'bg-white scale-110' : 'bg-white/80'}`}
            aria-label="Hold to speak"
          >
            <VoiceIcon className={`w-10 h-10 transition-colors ${isHolding ? 'text-black' : 'text-gray-700'}`} />
          </button>
          <span className="mt-3 font-medium text-gray-300">Hold</span>
        </div>

        <div className="flex flex-col items-center">
          <button onClick={handleEndCall} className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors" aria-label="End call">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.969 5.469a.5.5 0 0 1 .707 0l2.353 2.354 2.354-2.354a.5.5 0 1 1 .707.707L8.744 8.53l2.354 2.354a.5.5 0 1 1-.707.707L8.037 9.237 5.683 11.59a.5.5 0 0 1-.707-.707L7.323 8.53 4.969 6.176a.5.5 0 0 1 0-.707z"/>
            </svg>
          </button>
          <span className="mt-3 font-medium text-gray-300">End</span>
        </div>
      </div>
    </div>
  );
};
