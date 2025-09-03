import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductsPageSkeleton } from '@/components/pages/products/products-page-skeleton';
import ProductsPageClient from '@/components/pages/products/products-page-client';

export const metadata: Metadata = {
  title: 'Products - Smart Salons',
  description:
    'Browse our collection of professional salon furniture and equipment',
};

function ProductsLoading() {
  return <ProductsPageSkeleton />;
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsPageClient />
    </Suspense>
  );
}
