'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Plus,
  Minus,
  X,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';

interface CartSheetProps {
  children?: React.ReactNode;
}

interface ProductImage {
  url: string;
  altText?: string;
}

export function CartSheet({ children }: CartSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    cart,
    isLoading,
    updateCartItem,
    removeFromCart,
    cartItemsCount,
    cartTotal,
  } = useCart();

  const handleQuantityUpdate = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  const subtotal = cartTotal;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const cartItems = cart?.cartItems || [];

  const CartTrigger = children || (
    <Button variant="outline" size="sm" className="relative p-2">
      <ShoppingCart className="h-5 w-5" />
      {cartItemsCount > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {cartItemsCount > 99 ? '99+' : cartItemsCount}
        </Badge>
      )}
    </Button>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{CartTrigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <div className="flex items-center justify-between py-4">
          <h2 className="text-lg font-semibold">
            Shopping Cart ({cartItemsCount}{' '}
            {cartItemsCount === 1 ? 'item' : 'items'})
          </h2>
        </div>

        <Separator />

        <div className="flex-1 overflow-auto py-4">
          {cartItemsCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-gray-300" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Add some items to get started
                </p>
                <Link href="/products">
                  <Button onClick={() => setIsOpen(false)}>
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                      <Image
                        src={
                          (item.product.images?.[0] as unknown as ProductImage)
                            ?.url || '/api/placeholder/80/80'
                        }
                        alt={
                          (item.product.images?.[0] as unknown as ProductImage)
                            ?.altText || item.product.name
                        }
                        className="h-full w-full object-cover"
                        fill
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium line-clamp-2">
                            {item.product.name}
                          </h4>
                          {item.colorVariant && (
                            <p className="text-sm text-gray-500">
                              Color: {item.colorVariant.name}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              handleQuantityUpdate(item.id, item.quantity - 1)
                            }
                            disabled={isLoading}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              handleQuantityUpdate(item.id, item.quantity + 1)
                            }
                            disabled={isLoading}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium">
                            ${parseFloat(item.totalPrice).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${parseFloat(item.unitPrice).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Cart Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Free shipping on orders over $100
                  </p>
                )}
                <Separator />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-6 space-y-4">
                <Link href="/checkout">
                  <Button className="w-full" onClick={() => setIsOpen(false)}>
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
