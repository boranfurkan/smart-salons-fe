'use client';

import { useSearchParams } from 'next/navigation';
import { CheckoutSuccessView } from './checkout-success-view';

export function CheckoutSuccessWrapper() {
  const searchParams = useSearchParams();
  const orderNumber =
    searchParams.get('orderNumber') || `SS${Date.now().toString().slice(-6)}`;

  return <CheckoutSuccessView orderNumber={orderNumber} />;
}
