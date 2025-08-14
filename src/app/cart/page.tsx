import { Metadata } from 'next';
import { CartView } from '@/components/pages/cart/cart-view';

export const metadata: Metadata = {
  title: 'Shopping Cart - Smart Salons',
  description: 'Review your selected items and proceed to checkout',
};

export default function CartPage() {
  return <CartView />;
}
