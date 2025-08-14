'use client';

import React, { createContext, useContext } from 'react';
import { useAuth } from './auth-context';
import {
  useCartControllerGetCart,
  useCartControllerAddToCart,
  useCartControllerUpdateCartItem,
  useCartControllerRemoveFromCart,
  useCartControllerClearCart,
} from '@/lib/api/generated/cart/cart';
import { CartDto } from '@/lib/api/generated/smartSalonsAPI.schemas';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CartContextType {
  cart: CartDto | null;
  isLoading: boolean;
  addToCart: (
    productId: string,
    colorVariantId?: string,
    quantity?: number
  ) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartItemsCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useCartControllerGetCart(
    {},
    {
      query: {
        enabled: !!user,
      },
    }
  );

  const addToCartMutation = useCartControllerAddToCart();
  const updateCartItemMutation = useCartControllerUpdateCartItem();
  const removeFromCartMutation = useCartControllerRemoveFromCart();
  const clearCartMutation = useCartControllerClearCart();

  const invalidateCart = () => {
    queryClient.invalidateQueries({ queryKey: ['/cart'] });
  };

  const addToCart = async (
    productId: string,
    colorVariantId?: string,
    quantity: number = 1
  ) => {
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      return;
    }

    try {
      await addToCartMutation.mutateAsync({
        data: {
          productId,
          colorVariantId,
          quantity,
        },
      });

      toast.success('Item added to cart successfully!');
      invalidateCart();
    } catch (error: any) {
      console.error('Failed to add to cart:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to add item to cart. Please try again.';

      toast.error(errorMessage);
      throw error;
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    if (!user) {
      toast.error('Please sign in to update your cart');
      return;
    }

    try {
      await updateCartItemMutation.mutateAsync({
        cartItemId,
        data: { quantity },
      });

      invalidateCart();
    } catch (error: any) {
      console.error('Failed to update cart item:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to update cart item. Please try again.';

      toast.error(errorMessage);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) {
      toast.error('Please sign in to remove items from your cart');
      return;
    }

    try {
      await removeFromCartMutation.mutateAsync({
        cartItemId,
      });

      toast.success('Item removed from cart');
      invalidateCart();
    } catch (error: any) {
      console.error('Failed to remove from cart:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to remove item from cart. Please try again.';

      toast.error(errorMessage);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user) {
      toast.error('Please sign in to clear your cart');
      return;
    }

    try {
      await clearCartMutation.mutateAsync({});

      toast.success('Cart cleared');
      invalidateCart();
    } catch (error: any) {
      console.error('Failed to clear cart:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to clear cart. Please try again.';

      toast.error(errorMessage);
      throw error;
    }
  };

  const cartItemsCount =
    user && cart?.cartItems
      ? cart.cartItems.reduce(
          (total: number, item: any) => total + item.quantity,
          0
        )
      : 0;

  const cartTotal =
    user && cart?.cartItems
      ? cart.cartItems.reduce(
          (total: number, item: any) => total + parseFloat(item.totalPrice),
          0
        )
      : 0;

  const value: CartContextType = {
    cart: user ? cart || null : null,
    isLoading: user ? isLoading : false,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartItemsCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
