import React from 'react';

export const LogoIcon: React.FC<React.ComponentProps<'img'>> = ({ className, ...props }) => (
    <img 
        src="https://i.ibb.co/GvWTsPF1/IMG-3744.png" 
        alt="Silo Search Logo" 
        className={`w-10 h-10 ${className || ''}`}
        {...props}
    />
);