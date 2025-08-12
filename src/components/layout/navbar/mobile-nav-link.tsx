'use client';

import Link from 'next/link';
import { MobileNavLinkProps } from './types';

export function MobileNavLink({ href, children, onClick }: MobileNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 rounded-md transition-colors"
    >
      {children}
    </Link>
  );
}
