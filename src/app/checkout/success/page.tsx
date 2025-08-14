import { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutSuccessWrapper } from '@/components/pages/checkout/checkout-success-wrapper';

export const metadata: Metadata = {
  title: 'Order Confirmed - Smart Salons',
  description: 'Your order has been successfully placed',
};

function CheckoutSuccessLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order confirmation...</p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessLoading />}>
      <CheckoutSuccessWrapper />
    </Suspense>
  );
}
