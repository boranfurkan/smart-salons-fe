import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductsGrid } from '@/components/pages/products/products-grid';
import { ProductsFilters } from '@/components/pages/products/products-filters';
import { ProductsHeader } from '@/components/pages/products/products-header';
import { ProductsProvider } from '@/context/products-context';
import { ProductsPageSkeleton } from '@/components/pages/products/products-page-skeleton';

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
      <ProductsProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <ProductsHeader />
            <div className="flex flex-col lg:flex-row gap-8 mt-8">
              <aside className="w-full lg:w-80 shrink-0">
                <ProductsFilters />
              </aside>
              <main className="flex-1">
                <ProductsGrid />
              </main>
            </div>
          </div>
        </div>
      </ProductsProvider>
    </Suspense>
  );
}
