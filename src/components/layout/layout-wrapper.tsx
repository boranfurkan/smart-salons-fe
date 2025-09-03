'use client';
import React from 'react';

import { Toaster } from '../ui/sonner';
import { LandingNavbar } from './navbar';
import BackgroundGrid from './background-grid';
import { Footer } from './footer';
import { MobileBottomNav } from './mobile-bottom-nav';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { WhatsAppButton } from '@/components/shared/whatsapp-button';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const pathName = usePathname();
  const pagesToAddPaddingTop = ['/products', '/auth'];
  const shouldAddPaddingTop = pagesToAddPaddingTop.some((path) =>
    pathName?.startsWith(path)
  );

  return (
    <div
      className={cn(
        'w-full h-full relative',
        shouldAddPaddingTop && 'max-md:pt-20'
      )}
    >
      <div className="relative w-full h-full z-10">
        {/* Navigation */}
        <LandingNavbar />
        {children}
        <Footer />
        <MobileBottomNav />
        <WhatsAppButton phone={process.env.NEXT_PUBLIC_WHATSAPP_PHONE || ''} />
      </div>
      <Toaster />
      <BackgroundGrid />
    </div>
  );
};

export default LayoutWrapper;
