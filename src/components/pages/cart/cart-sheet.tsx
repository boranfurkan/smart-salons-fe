'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  ArrowRight,
  ShoppingBag,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CartSheetProps {
  children?: React.ReactNode;
}

interface ProductImage {
  url: string;
  altText?: string;
}

export function CartSheet({ children }: CartSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const {
    cart,
    isLoading,
    updateCartItem,
    removeFromCart,
    cartItemsCount,
    cartTotal,
  } = useCart();

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      if (newQuantity < 1) {
        await removeFromCart(itemId);
        toast.success('Item removed from cart');
        return;
      }

      await updateCartItem(itemId, newQuantity);
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error('Failed to update cart. Please try again.');
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));

    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item. Please try again.');
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const subtotal = cartTotal;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const cartItems = cart?.cartItems || [];

  const CartItemSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 rounded-md" />
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CartTrigger = children || (
    <Button
      variant="outline"
      size="sm"
      className="relative p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <ShoppingCart className="h-5 w-5" />
      <AnimatePresence>
        {cartItemsCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2"
          >
            <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground font-medium">
              {cartItemsCount > 99 ? '99+' : cartItemsCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{CartTrigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-left">
            <ShoppingCart className="h-5 w-5" />
            <span>Shopping Cart</span>
            {cartItemsCount > 0 && (
              <Badge variant="secondary" className="ml-auto mr-10">
                {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          {isLoading && cartItems.length === 0 ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <CartItemSkeleton key={i} />
              ))}
            </div>
          ) : cartItemsCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                    Discover our amazing products and add your favorites to get
                    started
                  </p>
                </div>
                <Link href="/products" className="w-full">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                    size="lg"
                  >
                    Browse Products
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-6 space-y-4">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, index) => {
                    const isUpdating = updatingItems.has(item.id);

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 ${
                          isUpdating ? 'opacity-70 pointer-events-none' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative h-20 w-20 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <Image
                              src={
                                (
                                  item.product
                                    .images?.[0] as unknown as ProductImage
                                )?.url || '/api/placeholder/80/80'
                              }
                              alt={
                                (
                                  item.product
                                    .images?.[0] as unknown as ProductImage
                                )?.altText || item.product.name
                              }
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                              fill
                              sizes="80px"
                            />
                            {isUpdating && (
                              <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 leading-5">
                                  {item.product.name}
                                </h4>
                                {item.colorVariant && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      Color:
                                    </span>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                      {item.colorVariant.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                onClick={() => handleRemoveItem(item.id)}
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-white dark:hover:bg-gray-700"
                                  onClick={() =>
                                    handleQuantityUpdate(
                                      item.id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={isUpdating || item.quantity <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-12 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-white dark:hover:bg-gray-700"
                                  onClick={() =>
                                    handleQuantityUpdate(
                                      item.id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={isUpdating}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>

                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  ${parseFloat(item.totalPrice).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  ${parseFloat(item.unitPrice).toFixed(2)} each
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping
                    </span>
                    <span
                      className={`font-medium ${
                        shipping === 0
                          ? 'text-green-600 dark:text-green-500'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Free shipping on orders over $100
                    </p>
                  )}
                  <Separator className="bg-gray-200 dark:bg-gray-600" />
                  <div className="flex items-center justify-between font-semibold text-base">
                    <span className="text-gray-900 dark:text-gray-100">
                      Total
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <div className="space-y-3">
                  <Link href="/checkout" className="block">
                    <Button
                      className="w-full h-12 text-base font-medium"
                      onClick={() => {
                        setIsOpen(false);
                        toast.success('Redirecting to checkout...');
                      }}
                      disabled={isLoading || updatingItems.size > 0}
                    >
                      {isLoading || updatingItems.size > 0 ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {updatingItems.size > 0
                            ? 'Updating cart...'
                            : 'Processing...'}
                        </>
                      ) : (
                        <>
                          Proceed to Checkout
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </Link>
                  <Link href="/products" className="block">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
