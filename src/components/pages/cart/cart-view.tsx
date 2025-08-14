'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

interface ImageData {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  order: number;
}

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    discount?: string;
    images: ImageData[];
    category: {
      name: string;
      slug: string;
    };
  };
  colorVariant?: {
    id: string;
    name: string;
    hexCode: string;
    images: ImageData[];
  };
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export function CartView() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Replace with actual cart data from API
  const mockCartItems: CartItem[] = [
    {
      id: '1',
      product: {
        id: 'prod1',
        name: 'Professional Hair Dryer Pro Max 3000W',
        slug: 'professional-hair-dryer',
        price: '149.99',
        discount: '20.00',
        images: [
          {
            id: '1',
            url: '/api/placeholder/300/300',
            altText: 'Hair Dryer',
            isPrimary: true,
            order: 1,
          },
        ],
        category: { name: 'Hair Care', slug: 'hair-care' },
      },
      colorVariant: {
        id: 'var1',
        name: 'Matte Black',
        hexCode: '#2D2D2D',
        images: [],
      },
      quantity: 2,
      unitPrice: '129.99',
      totalPrice: '259.98',
    },
    {
      id: '2',
      product: {
        id: 'prod2',
        name: 'Premium Hair Styling Set',
        slug: 'premium-styling-set',
        price: '89.99',
        images: [
          {
            id: '2',
            url: '/api/placeholder/300/300',
            altText: 'Styling Set',
            isPrimary: true,
            order: 1,
          },
        ],
        category: { name: 'Styling Tools', slug: 'styling-tools' },
      },
      quantity: 1,
      unitPrice: '89.99',
      totalPrice: '89.99',
    },
  ];

  const cartItemsCount = mockCartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const subtotal = mockCartItems.reduce(
    (total, item) => total + parseFloat(item.totalPrice),
    0
  );
  const deliveryFee = subtotal > 100 ? 0 : 9.99;
  const totalSavings = mockCartItems.reduce((total, item) => {
    if (item.product.discount) {
      return total + parseFloat(item.product.discount) * item.quantity;
    }
    return total;
  }, 0);
  const total = subtotal + deliveryFee;

  if (authLoading) {
    return <CartPageSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to view your cart
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view and manage your shopping cart.
          </p>
          <div className="space-y-3">
            <Link href="/auth/signin">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="w-full">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return handleRemoveItem(itemId);
    }

    setIsLoading(true);
    try {
      // TODO: Implement update cart item API call
      console.log('Updating cart item:', itemId, 'to quantity:', newQuantity);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to update cart item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement remove cart item API call
      console.log('Removing cart item:', itemId);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItemsCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="max-w-md mx-auto text-center py-12">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
              Start shopping to fill it up!
            </p>
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Shopping Cart ({cartItemsCount}{' '}
                  {cartItemsCount === 1 ? 'item' : 'items'})
                </h1>
                <Link href="/products">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>

              <div className="space-y-6">
                {mockCartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={
                            item.product.images[0]?.url ||
                            '/api/placeholder/96/96'
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="hover:text-blue-600"
                            >
                              <h3 className="font-semibold text-gray-900 line-clamp-2">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.product.category.name}
                            </p>

                            {item.colorVariant && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm text-gray-500">
                                  Color:
                                </span>
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor: item.colorVariant.hexCode,
                                  }}
                                />
                                <span className="text-sm text-gray-600">
                                  {item.colorVariant.name}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={isLoading}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-12 text-center font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    disabled={isLoading}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  disabled={isLoading}
                                  className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="text-right">
                                <div className="font-bold text-lg">
                                  ${parseFloat(item.totalPrice).toFixed(2)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  ${parseFloat(item.unitPrice).toFixed(2)} each
                                </div>
                                {item.product.discount && (
                                  <div className="text-sm text-green-600">
                                    Save $
                                    {(
                                      parseFloat(item.product.discount) *
                                      item.quantity
                                    ).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {index < mockCartItems.length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItemsCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Savings</span>
                    <span>-${totalSavings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                {deliveryFee > 0 && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    Add ${(100 - subtotal).toFixed(2)} more for free delivery
                  </div>
                )}
              </div>

              <Separator className="mb-6" />

              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full mb-4" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Delivery Information */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span>Free delivery on orders over $100</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                  <span>30-day free returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-24 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <Skeleton className="h-8 w-64 mb-6" />

              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-24 h-24 rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <Skeleton className="h-6 w-32 mb-6" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-full mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
