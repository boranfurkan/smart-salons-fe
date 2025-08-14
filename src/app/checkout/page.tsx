import { Metadata } from 'next';
import { CheckoutView } from '@/components/pages/checkout/checkout-view';

export const metadata: Metadata = {
  title: 'Checkout - Smart Salons',
  description: 'Complete your purchase securely',
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
