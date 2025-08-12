'use client';

import Link from 'next/link';
import { JoinButtonProps } from './types';

export function JoinButton({ href, children }: JoinButtonProps) {
  return (
    <Link
      href={href}
      className="relative z-0 overflow-hidden whitespace-nowrap rounded-lg border border-neutral-300 px-4 py-1.5 font-medium text-neutral-600 transition-all duration-300 before:absolute before:inset-0 before:-z-10 before:translate-y-[200%] before:scale-[2.5] before:rounded-[100%] before:bg-neutral-900 before:transition-transform before:duration-1000 before:content-[''] hover:scale-105 hover:border-neutral-900 hover:text-neutral-50 hover:before:translate-y-[0%] active:scale-100"
    >
      {children}
    </Link>
  );
}
