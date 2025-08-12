import React from 'react';

import { Toaster } from '../ui/sonner';
import { LandingNavbar } from './navbar';
import BackgroundGrid from './background-grid';
import { Footer } from './footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  return (
    <div className="w-full h-full relative">
      <div className="relative w-full h-full z-10">
        {/* Navigation */}
        <LandingNavbar />
        {children}
        <Footer />
      </div>
      <Toaster />
      <BackgroundGrid />
    </div>
  );
};

export default LayoutWrapper;
