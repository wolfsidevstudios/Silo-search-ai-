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


export const STICKERS = [
    { id: 'star', name: 'Star', component: StarSticker },
    { id: 'heart', name: 'Heart', component: HeartSticker },
    { id: 'lightning', name: 'Lightning', component: LightningSticker },
    { id: 'animated-blob', name: 'Blob Friend', component: AnimatedBlobSticker },
];

export const StickerComponents: { [key: string]: React.FC } = {
    star: StarSticker,
    heart: HeartSticker,
    lightning: LightningSticker,
    'animated-blob': AnimatedBlobSticker,
};
