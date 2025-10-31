
import React from 'react';

export const BrowserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <line x1="2" y1="9" x2="22" y2="9"></line>
        <line x1="6" y1="6" x2="6.01" y2="6"></line>
        <line x1="10" y1="6" x2="10.01" y2="6"></line>
    </svg>
);
