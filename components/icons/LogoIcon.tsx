import React from 'react';

export const LogoIcon: React.FC<React.ComponentProps<'img'>> = ({ className, ...props }) => (
    <img 
        src="https://i.ibb.co/ZRJtLTQ8/IMG-4154.png" 
        alt="Kyndra AI Logo" 
        className={`w-10 h-10 ${className || ''}`}
        {...props}
    />
);