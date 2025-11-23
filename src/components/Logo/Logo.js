import React from 'react';

const Logo = ({ className, width = '80px', height = '80px' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Company Logo"
  >
    <g fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 15 85 L 50 15 L 85 85" />
      <path d="M 30 85 L 50 45 L 70 85" />
      <path d="M 40 85 L 50 65 L 60 85" />
    </g>
  </svg>
);

export default Logo;