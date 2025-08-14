'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  productId: string;
  selectedVariantId?: string | null;
  quantity?: number;
  price?: number;
  discount?: number;
  stock?: number;
  disabled?: boolean;
  className?: string;
  showPrice?: boolean;
}

export function AddToCartButton({
  productId,
  selectedVariantId,
  quantity = 1,
  price,
  discount,
  stock = 0,
  disabled = false,
  className,
  showPrice = true,
}: AddToCartButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { addToCart } = useCart();

  const finalPrice = discount && price ? price - discount : price;
  const totalPrice = finalPrice && quantity ? finalPrice * quantity : 0;

  const handleAddToCart = async () => {
    if (!user || stock === 0 || disabled) {
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(
        productId,
        selectedVariantId === 'default' || !selectedVariantId
          ? undefined
          : selectedVariantId,
        quantity
      );
    } catch (error) {
      // Error is already handled in the cart context
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleSignInRedirect = () => {
    router.push('/auth/signin');
    setIsPopoverOpen(false); // Close popover after redirect
  };

  const handleButtonClick = () => {
    if (user) {
      handleAddToCart();
    } else {
      setIsPopoverOpen(true);
    }
  };

  const isOutOfStock = stock === 0;
  const isDisabled = disabled || isOutOfStock || isAddingToCart;

  const buttonContent = (
    <>
      {isAddingToCart ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      {isOutOfStock
        ? 'Out of Stock'
        : isAddingToCart
        ? 'Adding...'
        : showPrice && totalPrice > 0
        ? `Add to Cart - $${totalPrice.toFixed(2)}`
        : 'Add to Cart'}
    </>
  );

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={handleButtonClick}
          disabled={isDisabled}
          variant="green"
          className={cn(
            'flex-1',
            isOutOfStock && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          {buttonContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="center" side="top">
        <div className="space-y-3">
          <p className="text-sm text-center">
            Please sign in to add items to your cart
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSignInRedirect} className="flex-1">
              Sign In
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPopoverOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
