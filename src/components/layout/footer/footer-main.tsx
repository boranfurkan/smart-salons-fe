'use client';

import { FooterHeader } from './footer-header';
import { FooterContent } from './footer-content';
import { FooterBottom } from './footer-bottom';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-50 border-t border-neutral-700">
      <div className="container mx-auto px-4">
        <FooterHeader />
        <FooterContent />
        <FooterBottom />
      </div>
    </footer>
  );
}
