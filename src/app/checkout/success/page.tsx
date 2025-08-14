import { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutSuccessWrapper } from '@/components/pages/checkout/checkout-success-wrapper';
import { CheckoutSuccessSkeleton } from '@/components/pages/checkout/checkout-success-skeleton';

export const metadata: Metadata = {
  title: 'Order Confirmed - Smart Salons',
  description: 'Your order has been successfully placed',
};

function CheckoutSuccessLoading() {
  return <CheckoutSuccessSkeleton />;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessLoading />}>
      <CheckoutSuccessWrapper />
    </Suspense>
  );
}
