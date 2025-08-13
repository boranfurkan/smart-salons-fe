'use client';

import Logo from '@/assets/icons/Logo';
import Image from 'next/image';
import Link from 'next/link';

export function LogoNavbar() {
  return (
    <Link
      href="/"
      aria-label="Smart Salons"
      className="ml-1 mr-1 block overflow-hidden"
    >
      <Image
        src="/logo-2.svg"
        alt="Smart Salons Logo"
        width={120}
        height={40}
        className="h-4 w-auto"
      />
    </Link>
  );
}
