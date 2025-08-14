'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Lock,
  Plus,
  Minus,
  X,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useOrdersControllerCreateOrder } from '@/lib/api/generated/orders/orders';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    discount?: string;
    images: any[];
  };
  colorVariant?: {
    id: string;
    name: string;
    hexCode: string;
  };
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentMethod {
  type: 'card' | 'paypal' | 'apple_pay';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
}

export function CheckoutView() {
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>(
    'shipping'
  );

  // Order creation mutation
  const createOrderMutation = useOrdersControllerCreateOrder();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  // Mock cart items - replace with actual data from API
  const cartItems: CartItem[] = [
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
            url: '/api/placeholder/80/80',
            altText: 'Hair Dryer',
            isPrimary: true,
            order: 1,
          },
        ],
      },
      colorVariant: {
        id: 'var1',
        name: 'Matte Black',
        hexCode: '#2D2D2D',
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
            url: '/api/placeholder/80/80',
            altText: 'Styling Set',
            isPrimary: true,
            order: 1,
          },
        ],
      },
      quantity: 1,
      unitPrice: '89.99',
      totalPrice: '89.99',
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.totalPrice),
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    // TODO: Implement quantity update
    console.log('Updating quantity:', itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    // TODO: Implement item removal
    console.log('Removing item:', itemId);
  };

  const handlePlaceOrder = async () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsProcessing(true);
    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          colorVariantId: item.colorVariant?.id || undefined,
          quantity: item.quantity,
          unitPrice: parseFloat(item.unitPrice),
        })),
        shippingAddress: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          email: shippingAddress.email,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          apartment: shippingAddress.apartment || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
        },
      };

      // Create the order
      const result = await createOrderMutation.mutateAsync({
        data: orderData,
      });

      toast.success('Order placed successfully!');

      // Redirect to success page with order info
      router.push(`/checkout/success?orderNumber=${result.orderNumber}`);
    } catch (error: any) {
      console.error('Order placement failed:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to place order. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sign in to checkout
          </h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to complete your purchase.
          </p>
          <div className="space-y-3">
            <Link href="/auth/signin?redirect=/checkout">
              <Button className="w-full">Sign In</Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="w-full">
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          </div>

          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-4">
            {(['shipping', 'payment', 'review'] as const).map(
              (stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === stepName
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="ml-2 text-sm capitalize">{stepName}</span>
                  {index < 2 && <div className="w-8 h-0.5 bg-gray-200 mx-4" />}
                </div>
              )
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={shippingAddress.firstName}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={shippingAddress.lastName}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="apartment">
                    Apartment, suite, etc. (optional)
                  </Label>
                  <Input
                    id="apartment"
                    value={shippingAddress.apartment}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        apartment: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={shippingAddress.city}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="save-address"
                  checked={saveAddress}
                  onCheckedChange={(checked) =>
                    setSaveAddress(checked as boolean)
                  }
                />
                <Label htmlFor="save-address" className="text-sm">
                  Save this information for next time
                </Label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentMethod.cardNumber}
                        onChange={(e) =>
                          setPaymentMethod((prev) => ({
                            ...prev,
                            cardNumber: e.target.value,
                          }))
                        }
                        required
                      />
                      <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      value={paymentMethod.cardholderName}
                      onChange={(e) =>
                        setPaymentMethod((prev) => ({
                          ...prev,
                          cardholderName: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentMethod.expiryDate}
                      onChange={(e) =>
                        setPaymentMethod((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentMethod.cvv}
                      onChange={(e) =>
                        setPaymentMethod((prev) => ({
                          ...prev,
                          cvv: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                      setAgreedToTerms(checked as boolean)
                    }
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={
                          item.product.images[0]?.url ||
                          '/api/placeholder/64/64'
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                        {item.product.name}
                      </h4>
                      {item.colorVariant && (
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{
                              backgroundColor: item.colorVariant.hexCode,
                            }}
                          />
                          <span className="text-xs text-gray-600">
                            {item.colorVariant.name}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            ${parseFloat(item.totalPrice).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-6" />

              {/* Order Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={!agreedToTerms || isProcessing}
                className="w-full mb-4"
                size="lg"
              >
                {isProcessing
                  ? 'Processing...'
                  : `Place Order - $${total.toFixed(2)}`}
              </Button>

              {/* Security Badges */}
              <div className="space-y-3 pt-4 border-t text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure SSL encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-purple-600" />
                  <span>30-day money back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
