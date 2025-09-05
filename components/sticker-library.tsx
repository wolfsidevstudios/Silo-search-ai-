
import React from 'react';

const StarSticker = () => (
    <svg viewBox="0 0 100 100" fill="gold" stroke="orange" strokeWidth="5">
        <path d="M50,5 L61.8,38.2 L97.5,38.2 L68.8,57 L79.6,90.2 L50,69 L20.4,90.2 L31.2,57 L2.5,38.2 L38.2,38.2 Z" />
    </svg>
);

const HeartSticker = () => (
    <svg viewBox="0 0 100 100" fill="#FF4F81" stroke="#E03C6A" strokeWidth="5">
        <path d="M50,90 C-20,40 20,10 50,40 C80,10 120,40 50,90 Z" />
    </svg>
);

const LightningSticker = () => (
    <svg viewBox="0 0 100 100" fill="#FFC700" stroke="#EAA900" strokeWidth="5">
        <polygon points="50,5 25,50 45,50 35,95 75,40 55,40" />
    </svg>
);

const AnimatedBlobSticker = () => (
    <>
        <style>{`
            @keyframes blob-bounce {
                0%, 100% { transform: translateY(0) scale(1, 1); }
                50% { transform: translateY(-10%) scale(0.95, 1.05); }
            }
            @keyframes blob-eyes {
                0%, 90% { transform: scaleY(1); }
                95%, 100% { transform: scaleY(0.1); }
            }
            .blob-body { animation: blob-bounce 3s ease-in-out infinite; transform-origin: bottom; }
            .blob-eye { animation: blob-eyes 4s linear infinite; transform-origin: center; }
        `}</style>
        <svg viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
            <g className="blob-body">
                <path d="M50,95 C20,95 5,70 5,50 C5,20 20,5 50,5 C80,5 95,20 95,50 C95,70 80,95 50,95 Z" fill="#87CEEB" />
                <circle cx="38" cy="45" r="5" fill="black" className="blob-eye" />
                <circle cx="62" cy="45" r="5" fill="black" className="blob-eye" />
                <path d="M40 65 Q 50 75 60 65" stroke="black" fill="transparent" strokeWidth="3" strokeLinecap="round" />
            </g>
        </svg>
    </>
);

const GrinningFaceSticker = () => (
    <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="#FFDE33" stroke="#B59A1A" strokeWidth="5" />
        <circle cx="35" cy="40" r="8" fill="black" />
        <circle cx="65" cy="40" r="8" fill="black" />
        <path d="M30 60 C 40 80, 60 80, 70 60 Q 50 70 30 60" fill="black" />
    </svg>
);

const ThinkingFaceSticker = () => (
    <svg viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <circle cx="50" cy="50" r="45" fill="#FFDE33" stroke="#B59A1A" strokeWidth="5" />
        <path d="M30 42 C 35 32, 45 32, 50 42" fill="none" stroke="black" strokeWidth="5" />
        <path d="M70 42 C 65 32, 55 32, 50 42" fill="none" stroke="black" strokeWidth="5" />
        <line x1="40" y1="70" x2="60" y2="70" stroke="black" strokeWidth="5" strokeLinecap="round" />
        <path d="M40 80 C 20 85, 20 100, 35 105 C 45 108, 55 100, 50 85 Z" fill="#F4AC3C" stroke="black" strokeWidth="3" />
    </svg>
);

const StarStruckSticker = () => (
    <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="#FFDE33" stroke="#B59A1A" strokeWidth="5" />
        <g transform="translate(35, 40) scale(0.2)">
            <path d="M50,5 L61.8,38.2 L97.5,38.2 L68.8,57 L79.6,90.2 L50,69 L20.4,90.2 L31.2,57 L2.5,38.2 L38.2,38.2 Z" fill="gold" stroke="orange" strokeWidth="15" />
        </g>
         <g transform="translate(65, 40) scale(0.2)">
            <path d="M50,5 L61.8,38.2 L97.5,38.2 L68.8,57 L79.6,90.2 L50,69 L20.4,90.2 L31.2,57 L2.5,38.2 L38.2,38.2 Z" fill="gold" stroke="orange" strokeWidth="15" />
        </g>
        <path d="M30 65 C 40 85, 60 85, 70 65" fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" />
    </svg>
);

const PartyPopperSticker = () => (
    <svg viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <path d="M20 80 L40 60 L80 100 L60 120 Z" fill="#4285F4" stroke="#1A73E8" strokeWidth="5" />
        <path d="M40 60 L50 50" stroke="black" strokeWidth="3" />
        <circle cx="60" cy="30" r="5" fill="#E53935" />
        <circle cx="75" cy="45" r="4" fill="#FDD835" />
        <circle cx="50" cy="15" r="6" fill="#43A047" />
        <path d="M70 20 L 80 10" stroke="#8E24AA" strokeWidth="4" />
    </svg>
);

export const STICKERS = [
    { id: 'star', name: 'Star', component: StarSticker },
    { id: 'heart', name: 'Heart', component: HeartSticker },
    { id: 'lightning', name: 'Lightning', component: LightningSticker },
    { id: 'animated-blob', name: 'Blob Friend', component: AnimatedBlobSticker },
    { id: 'grinning', name: 'Grinning', component: GrinningFaceSticker },
    { id: 'thinking', name: 'Thinking', component: ThinkingFaceSticker },
    { id: 'star-struck', name: 'Star-Struck', component: StarStruckSticker },
    { id: 'party-popper', name: 'Party Popper', component: PartyPopperSticker },
];

export const StickerComponents: { [key: string]: React.FC } = {
    star: StarSticker,
    heart: HeartSticker,
    lightning: LightningSticker,
    'animated-blob': AnimatedBlobSticker,
    grinning: GrinningFaceSticker,
    thinking: ThinkingFaceSticker,
    'star-struck': StarStruckSticker,
    'party-popper': PartyPopperSticker,
};
