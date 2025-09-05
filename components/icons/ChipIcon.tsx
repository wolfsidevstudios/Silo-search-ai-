import React from 'react';

export const ChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="M12 2v5"></path>
        <path d="M12 17v5"></path>
        <path d="M7 12h2"></path>
        <path d="M15 12h2"></path>
    </svg>
);
