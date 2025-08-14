import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductsGrid } from '@/components/pages/products/products-grid';
import { ProductsFilters } from '@/components/pages/products/products-filters';
import { ProductsHeader } from '@/components/pages/products/products-header';
import { ProductsProvider } from '@/context/products-context';

export const metadata: Metadata = {
  title: 'Products - Smart Salons',
  description:
    'Browse our collection of professional salon furniture and equipment',
};

function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-80 shrink-0">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </aside>
            <main className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
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
