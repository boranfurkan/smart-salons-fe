'use client';

import { ShoppingBag } from 'lucide-react';
import { CartButtonProps } from './types';
import { CartSheet } from '@/components/pages/cart/cart-sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function CartButton({ count = 0 }: CartButtonProps) {
  return (
    <CartSheet>
      <Button
        variant="ghost"
        size="sm"
        className="relative flex items-center justify-center rounded-md px-2 py-1 text-neutral-600 hover:text-neutral-900"
      >
        <ShoppingBag size={18} />
        {count > 0 && (
          <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-indigo-500 px-1 text-[10px] font-semibold text-white hover:bg-indigo-600">
            {count > 99 ? '99+' : count}
          </Badge>
        )}
      </Button>
    </CartSheet>
  );
}
