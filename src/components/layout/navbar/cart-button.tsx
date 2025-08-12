'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { CartButtonProps } from './types';

export function CartButton({ count = 0 }: CartButtonProps) {
  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center rounded-md px-2 py-1 text-neutral-600 hover:text-neutral-900"
    >
      <ShoppingBag size={18} />
      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-semibold text-white">
        {count}
      </span>
    </Link>
  );
}
