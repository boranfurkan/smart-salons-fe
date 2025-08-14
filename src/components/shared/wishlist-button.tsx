'use client';

import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useRouter } from 'next/navigation';
import { useFavoritesControllerAddToFavorites } from '@/lib/api/generated/favorites/favorites';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const addToFavoritesMutation = useFavoritesControllerAddToFavorites();

  const handleAddToWishlist = async () => {
    if (!user) {
      return;
    }

    setIsAddingToWishlist(true);
    try {
      await addToFavoritesMutation.mutateAsync({
        data: {
          productId,
        },
      });

      toast.success('Item added to favorites!');
      setIsPopoverOpen(false); // Close popover after successful addition
    } catch (error: unknown) {
      console.error('Failed to add to wishlist:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to add item to favorites. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleSignInRedirect = () => {
    router.push('/auth/signin');
    setIsPopoverOpen(false); // Close popover after redirect
  };

  const handleButtonClick = () => {
    if (user) {
      handleAddToWishlist();
    } else {
      setIsPopoverOpen(true);
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={handleButtonClick}
          disabled={isAddingToWishlist}
          variant="outline"
          size="icon"
          className={cn(
            'border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50',
            className
          )}
        >
          {isAddingToWishlist ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Heart className="w-5 h-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="center" side="top">
        <div className="space-y-3">
          <p className="text-sm text-center">
            Please sign in to add items to your wishlist
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
