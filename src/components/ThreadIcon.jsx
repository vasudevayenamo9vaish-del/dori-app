import React from 'react';

const ThreadIcon = ({ size = 24, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ filter: 'drop-shadow(0px 0px 6px rgba(217, 119, 106, 0.5))' }}
  >
    <path 
      d="M2 16 C 6 16, 10 5, 14 5 C 19 5, 19 17, 14 17 C 9 17, 9 8, 22 8" 
      stroke="#D4A373" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export default ThreadIcon;
