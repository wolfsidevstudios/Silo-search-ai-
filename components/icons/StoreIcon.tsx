import React from 'react';

export const StoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 22h16" />
        <path d="M18 6H6" />
        <path d="M18 6l-2 10H8L6 6" />
        <path d="M12 6V2" />
        <path d="M12 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
        <path d="M20 22V10" />
        <path d="M4 22V10" />
    </svg>
);
