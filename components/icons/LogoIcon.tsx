import React from 'react';

export const LogoIcon: React.FC<React.ComponentProps<'img'>> = ({ className, ...props }) => (
    <img 
        src="https://i.ibb.co/TxVDcRV7/Google-AI-Studio-2025-09-11-T02-02-38-121-Z-modified.png" 
        alt="Kyndra AI Logo" 
        className={`w-10 h-10 ${className || ''}`}
        {...props}
    />
);