

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

const CloudSticker = () => (
    <svg viewBox="0 0 100 100" fill="#B0E0E6" stroke="#87CEEB" strokeWidth="5">
        <path d="M25 75 C 5 75, 5 50, 30 50 C 30 30, 60 30, 60 50 C 85 50, 85 75, 65 75 Z" />
    </svg>
);

const MoonSticker = () => (
    <svg viewBox="0 0 100 100" fill="#F0E68C">
        <path d="M50 5 A 45 45 0 1 0 50 95 A 35 35 0 1 1 50 5 Z" />
    </svg>
);

const SunSticker = () => (
    <svg viewBox="0 0 100 100" fill="#FFD700">
        <circle cx="50" cy="50" r="25" />
        <path d="M50 5 V 20 M50 80 V 95 M5 50 H 20 M80 50 H 95 M21 21 L 32 32 M68 68 L 79 79 M21 79 L 32 68 M68 32 L 79 21" stroke="#FFD700" strokeWidth="8" strokeLinecap="round" />
    </svg>
);

const PizzaSticker = () => (
    <svg viewBox="0 0 100 100">
        <path d="M5 10 L 95 10 L 50 90 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="5" />
        <circle cx="30" cy="30" r="8" fill="#C83737" />
        <circle cx="70" cy="30" r="8" fill="#C83737" />
        <circle cx="50" cy="60" r="8" fill="#C83737" />
    </svg>
);

const CoffeeSticker = () => (
    <svg viewBox="0 0 100 100">
        <path d="M15 20 H 75 V 80 H 15 Z" fill="white" stroke="black" strokeWidth="5" rx="10" />
        <path d="M75 35 C 90 40, 90 60, 75 65" fill="none" stroke="black" strokeWidth="5" />
        <path d="M30 25 C 30 15, 40 15, 40 25" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 25 C 50 15, 60 15, 60 25" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

const BookSticker = () => (
    <svg viewBox="0 0 100 100">
        <path d="M50 10 L 10 20 V 80 L 50 90 L 90 80 V 20 Z" fill="#A0522D" stroke="#8B4513" strokeWidth="5" />
        <path d="M50 10 V 90" stroke="black" strokeWidth="3" />
    </svg>
);

const RocketSticker = () => (
    <svg viewBox="0 0 100 100">
        <path d="M50 5 L 70 40 H 30 Z" fill="#D3D3D3" stroke="black" strokeWidth="5" />
        <rect x="30" y="40" width="40" height="50" fill="#D3D3D3" stroke="black" strokeWidth="5" />
        <path d="M30 90 L 10 100 V 70 Z" fill="#FF4500" stroke="black" strokeWidth="5" />
        <path d="M70 90 L 90 100 V 70 Z" fill="#FF4500" stroke="black" strokeWidth="5" />
        <circle cx="50" cy="60" r="10" fill="#ADD8E6" stroke="black" strokeWidth="3" />
    </svg>
);

const GhostSticker = () => (
    <svg viewBox="0 0 100 100">
        <path d="M20 90 L 20 50 C 20 20, 80 20, 80 50 L 80 90 L 70 80 L 60 90 L 50 80 L 40 90 L 30 80 Z" fill="white" stroke="black" strokeWidth="5" />
        <circle cx="40" cy="50" r="5" fill="black" />
        <circle cx="60" cy="50" r="5" fill="black" />
    </svg>
);

const CatSticker = () => (
    <svg viewBox="0 0 100 100" fill="black">
        <circle cx="50" cy="55" r="30" />
        <path d="M40 30 C 20 0, 40 20, 40 30" />
        <path d="M60 30 C 80 0, 60 20, 60 30" />
        <path d="M75 60 C 95 60, 95 80, 75 80" stroke="black" strokeWidth="8" strokeLinecap="round" fill="none" />
    </svg>
);

const DogPawSticker = () => (
    <svg viewBox="0 0 100 100" fill="#8B4513">
        <circle cx="50" cy="60" r="25" />
        <circle cx="25" cy="25" r="10" />
        <circle cx="45" cy="20" r="10" />
        <circle cx="65" cy="25" r="10" />
        <circle cx="80" cy="40" r="10" />
    </svg>
);

const TreeSticker = () => (
    <svg viewBox="0 0 100 100">
        <polygon points="50,5 20,45 80,45" fill="#228B22" />
        <polygon points="50,35 25,75 75,75" fill="#228B22" />
        <rect x="40" y="75" width="20" height="20" fill="#8B4513" />
    </svg>
);

const FlowerSticker = () => (
    <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="15" fill="yellow" />
        <g fill="white" stroke="black" strokeWidth="3">
            <ellipse cx="50" cy="25" rx="15" ry="20" />
            <ellipse cx="50" cy="75" rx="15" ry="20" />
            <ellipse cx="25" cy="50" rx="20" ry="15" />
            <ellipse cx="75" cy="50" rx="20" ry="15" />
            <ellipse transform="rotate(45 50 50)" cx="50" cy="25" rx="15" ry="20" />
            <ellipse transform="rotate(45 50 50)" cx="50" cy="75" rx="15" ry="20" />
            <ellipse transform="rotate(45 50 50)" cx="25" cy="50" rx="20" ry="15" />
            <ellipse transform="rotate(45 50 50)" cx="75" cy="50" rx="20" ry="15" />
        </g>
    </svg>
);

const DiamondSticker = () => (
    <svg viewBox="0 0 100 100" fill="#B9F2FF">
        <path d="M50 5 L 95 40 L 50 95 L 5 40 Z" stroke="#81C7D4" strokeWidth="5" />
        <path d="M5 40 L 50 40 L 95 40 M50 5 L 50 95" stroke="#81C7D4" strokeWidth="3" />
    </svg>
);

const CrownSticker = () => (
    <svg viewBox="0 0 100 100" fill="#FFD700" stroke="#DAA520" strokeWidth="5">
        <path d="M10 80 H 90 V 60 L 70 70 L 50 40 L 30 70 L 10 60 Z" />
        <circle cx="20" cy="85" r="5" fill="#FF4500"/>
        <circle cx="50" cy="85" r="5" fill="#4169E1"/>
        <circle cx="80" cy="85" r="5" fill="#32CD32"/>
    </svg>
);

const MusicNoteSticker = () => (
    <svg viewBox="0 0 100 100" fill="black">
        <circle cx="35" cy="80" r="15" />
        <rect x="50" y="20" width="10" height="65" />
        <path d="M50 35 C 70 30, 80 40, 80 50" stroke="black" strokeWidth="10" fill="none" />
    </svg>
);

const ControllerSticker = () => (
    <svg viewBox="0 0 100 100">
        <path d="M10 50 C 10 20, 30 20, 40 40 H 60 C 70 20, 90 20, 90 50 C 90 80, 70 80, 60 60 H 40 C 30 80, 10 80, 10 50 Z" fill="#E0E0E0" stroke="black" strokeWidth="5" />
        <rect x="20" y="40" width="20" height="5" fill="black" />
        <rect x="27.5" y="32.5" width="5" height="20" fill="black" />
        <circle cx="70" cy="40" r="8" fill="#FF4500" />
        <circle cx="80" cy="55" r="8" fill="#4169E1" />
    </svg>
);

const PlanetSticker = () => (
    <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" fill="#F4A460" stroke="#CD853F" strokeWidth="5" />
        <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#D2B48C" strokeWidth="8" />
    </svg>
);

const RobotSticker = () => (
    <svg viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" rx="10" fill="#C0C0C0" stroke="black" strokeWidth="5" />
        <circle cx="40" cy="45" r="8" fill="#32CD32" />
        <circle cx="60" cy="45" r="8" fill="#32CD32" />
        <rect x="30" y="65" width="40" height="5" fill="black" />
    </svg>
);

const UnicornSticker = () => (
    <svg viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <path d="M50 95 L 60 20 L 70 95" fill="white" stroke="black" strokeWidth="5" />
        <path d="M52 85 L 60 25 M54 75 L 62 30 M56 65 L 64 35 M58 55 L 66 40" stroke="#DDA0DD" strokeWidth="4" />
    </svg>
);

const RainbowSticker = () => (
    <svg viewBox="0 0 100 100">
        <path d="M10 80 A 40 40 0 0 1 90 80" stroke="#FF0000" strokeWidth="8" fill="none" />
        <path d="M20 80 A 30 30 0 0 1 80 80" stroke="#FFA500" strokeWidth="8" fill="none" />
        <path d="M30 80 A 20 20 0 0 1 70 80" stroke="#FFFF00" strokeWidth="8" fill="none" />
        <path d="M40 80 A 10 10 0 0 1 60 80" stroke="#008000" strokeWidth="8" fill="none" />
    </svg>
);

const DonutSticker = () => (
    <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="#F4A460" stroke="#CD853F" strokeWidth="5" />
        <circle cx="50" cy="50" r="15" fill="white" />
        <g strokeWidth="3" strokeLinecap="round">
            <path d="M30 30 L 35 35" stroke="#FF69B4" />
            <path d="M60 25 L 65 30" stroke="#87CEEB" />
            <path d="M75 50 L 70 55" stroke="#98FB98" />
            <path d="M60 75 L 65 70" stroke="#FF69B4" />
            <path d="M30 70 L 35 65" stroke="#87CEEB" />
        </g>
    </svg>
);

const IceCreamSticker = () => (
    <svg viewBox="0 0 100 100">
        <path d="M30 95 L 50 20 L 70 95 Z" fill="#D2B48C" stroke="#8B4513" strokeWidth="5" />
        <circle cx="50" cy="30" r="25" fill="#FFC0CB" stroke="#FF69B4" strokeWidth="5" />
    </svg>
);

const TacoSticker = () => (
    <svg viewBox="0 0 100 100">
        <path d="M20 80 C 20 40, 80 40, 80 80" fill="#FFD700" stroke="#DAA520" strokeWidth="5" />
        <rect x="25" y="45" width="50" height="10" fill="#006400" rx="5" />
        <rect x="30" y="55" width="40" height="10" fill="#8B0000" rx="5" />
    </svg>
);

const PresentSticker = () => (
    <svg viewBox="0 0 100 100">
        <rect x="20" y="40" width="60" height="50" fill="#DC143C" stroke="black" strokeWidth="5" />
        <rect x="45" y="40" width="10" height="50" fill="#FFD700" />
        <path d="M40 30 C 20 20, 30 5, 50 15 C 70 5, 80 20, 60 30 Z" fill="#FFD700" stroke="black" strokeWidth="5" />
    </svg>
);

const SpeechBubbleSticker = () => (
    <svg viewBox="0 0 100 100">
        <path d="M10 10 H 90 V 70 H 40 L 20 90 L 30 70 H 10 Z" fill="white" stroke="black" strokeWidth="5" rx="15" />
    </svg>
);

const LightbulbSticker = () => (
    <svg viewBox="0 0 100 100">
        <circle cx="50" cy="40" r="30" fill="#FFFFE0" stroke="black" strokeWidth="5" />
        <rect x="35" y="70" width="30" height="20" fill="#D3D3D3" stroke="black" strokeWidth="5" />
        <path d="M40 90 H 60 M 42 95 H 58" stroke="black" strokeWidth="3" />
    </svg>
);

const TargetSticker = () => (
    <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="white" stroke="black" strokeWidth="5" />
        <circle cx="50" cy="50" r="30" fill="red" />
        <circle cx="50" cy="50" r="15" fill="white" />
        <circle cx="50" cy="50" r="5" fill="red" />
    </svg>
);

const PaperPlaneSticker = () => (
    <svg viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="5">
        <path d="M10 10 L 90 50 L 10 90 L 30 50 Z" fill="#F0F8FF" />
    </svg>
);

const KeySticker = () => (
    <svg viewBox="0 0 100 100" stroke="black" strokeWidth="5" fill="#FFD700">
        <circle cx="35" cy="30" r="20" />
        <rect x="30" y="50" width="50" height="10" />
        <rect x="70" y="60" width="10" height="15" />
        <rect x="55" y="60" width="10" height="10" />
    </svg>
);

const LockSticker = () => (
    <svg viewBox="0 0 100 100" stroke="black" strokeWidth="5" fill="#C0C0C0">
        <rect x="20" y="40" width="60" height="50" rx="10" />
        <path d="M35 40 V 25 C 35 10, 65 10, 65 25 V 40" fill="none" />
        <circle cx="50" cy="65" r="5" fill="black" />
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
    { id: 'cloud', name: 'Cloud', component: CloudSticker },
    { id: 'moon', name: 'Moon', component: MoonSticker },
    { id: 'sun', name: 'Sun', component: SunSticker },
    { id: 'pizza', name: 'Pizza Slice', component: PizzaSticker },
    { id: 'coffee', name: 'Coffee Cup', component: CoffeeSticker },
    { id: 'book', name: 'Book', component: BookSticker },
    { id: 'rocket', name: 'Rocket', component: RocketSticker },
    { id: 'ghost', name: 'Ghost', component: GhostSticker },
    { id: 'cat', name: 'Cat', component: CatSticker },
    { id: 'dog-paw', name: 'Dog Paw', component: DogPawSticker },
    { id: 'tree', name: 'Tree', component: TreeSticker },
    { id: 'flower', name: 'Flower', component: FlowerSticker },
    { id: 'diamond', name: 'Diamond', component: DiamondSticker },
    { id: 'crown', name: 'Crown', component: CrownSticker },
    { id: 'music-note', name: 'Music Note', component: MusicNoteSticker },
    { id: 'controller', name: 'Game Controller', component: ControllerSticker },
    { id: 'planet', name: 'Planet', component: PlanetSticker },
    { id: 'robot', name: 'Robot', component: RobotSticker },
    { id: 'unicorn', name: 'Unicorn Horn', component: UnicornSticker },
    { id: 'rainbow', name: 'Rainbow', component: RainbowSticker },
    { id: 'donut', name: 'Donut', component: DonutSticker },
    { id: 'ice-cream', name: 'Ice Cream', component: IceCreamSticker },
    { id: 'taco', name: 'Taco', component: TacoSticker },
    { id: 'present', name: 'Present', component: PresentSticker },
    { id: 'speech-bubble', name: 'Speech Bubble', component: SpeechBubbleSticker },
    { id: 'lightbulb', name: 'Lightbulb', component: LightbulbSticker },
    { id: 'target', name: 'Target', component: TargetSticker },
    { id: 'paper-plane', name: 'Paper Plane', component: PaperPlaneSticker },
    { id: 'key', name: 'Key', component: KeySticker },
    { id: 'lock', name: 'Lock', component: LockSticker },
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
    cloud: CloudSticker,
    moon: MoonSticker,
    sun: SunSticker,
    pizza: PizzaSticker,
    coffee: CoffeeSticker,
    book: BookSticker,
    rocket: RocketSticker,
    ghost: GhostSticker,
    cat: CatSticker,
    'dog-paw': DogPawSticker,
    tree: TreeSticker,
    flower: FlowerSticker,
    diamond: DiamondSticker,
    crown: CrownSticker,
    'music-note': MusicNoteSticker,
    controller: ControllerSticker,
    planet: PlanetSticker,
    robot: RobotSticker,
    unicorn: UnicornSticker,
    rainbow: RainbowSticker,
    donut: DonutSticker,
    'ice-cream': IceCreamSticker,
    taco: TacoSticker,
    present: PresentSticker,
    'speech-bubble': SpeechBubbleSticker,
    lightbulb: LightbulbSticker,
    target: TargetSticker,
    'paper-plane': PaperPlaneSticker,
    key: KeySticker,
    lock: LockSticker,
};