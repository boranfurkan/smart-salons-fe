import React from 'react';
import BackgroundGrid from './background-grid';
import { Toaster } from '../ui/sonner';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  return (
    <div className="w-full h-full relative">
      <div className="relative w-full h-full z-10">{children}</div>
      <Toaster />
      {/*    <BackgroundGrid /> */}
    </div>
  );
};

export default LayoutWrapper;
