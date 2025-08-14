'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

const BackgroundGrid = () => {
  const pathName = usePathname();
  if (pathName.includes('auth')) {
    return null;
  }
  return (
    <div className="absolute inset-0 bg-white pointer-events-none z-0">
      <div className="h-full w-full opacity-50">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="75"
              height="75"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 75 0 L 0 0 0 75"
                fill="none"
                stroke="rgb(209, 213, 219)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
};

export default BackgroundGrid;
