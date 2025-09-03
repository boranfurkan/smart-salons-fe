import { Metadata } from 'next';
import { Suspense } from 'react';
import { ResponsiveProductsGrid } from '@/components/pages/products/responsive-products-grid';
import { ProductsFilters } from '@/components/pages/products/products-filters';
import { ResponsiveProductsHeader } from '@/components/pages/products/responsive-products-header';
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
            <ResponsiveProductsHeader />
            <div className="flex flex-col lg:flex-row gap-8 mt-8">
              <aside className="hidden lg:block w-80 shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
                  <ProductsFilters />
                </div>
              </aside>
              <main className="flex-1">
                <ResponsiveProductsGrid />
              </main>
            </div>
          </div>
        </div>
      </ProductsProvider>
    </Suspense>
  );
}
