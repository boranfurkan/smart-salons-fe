'use client';

import { ShoppingBag } from 'lucide-react';

import { CartSheet } from '@/components/pages/cart/cart-sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';

export function CartButton() {
  const { cartItemsCount } = useCart();

  return (
    <div className="relative">
      <CartSheet>
        <Button
          variant="ghost"
          size="sm"
          className="relative flex items-center justify-center rounded-md px-2 py-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
        >
          <ShoppingBag size={18} />
        </Button>
      </CartSheet>
      {cartItemsCount > 0 && (
        <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-indigo-500 px-1 text-[10px] font-semibold text-white hover:bg-indigo-600 animate-in zoom-in-50 duration-200 z-10">
          {cartItemsCount > 99 ? '99+' : cartItemsCount}
        </Badge>
      )}
    </div>
  );
}
