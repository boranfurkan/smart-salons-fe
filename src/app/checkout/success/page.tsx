import { Metadata } from 'next';
import { CheckoutSuccessView } from '@/components/pages/checkout/checkout-success-view';

export const metadata: Metadata = {
  title: 'Order Confirmed - Smart Salons',
  description: 'Your order has been successfully placed',
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessView />;
}
