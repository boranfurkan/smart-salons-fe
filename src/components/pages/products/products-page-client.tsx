'use client';

import { useState } from 'react';
import { Sheet } from 'react-modal-sheet';
import { ProductsProvider } from '@/context/products-context';
import { ProductsHeader } from './products-header';
import { ProductsFilters } from './products-filters';
import { ProductsGrid } from './products-grid';

export function ProductsPageClient() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <ProductsProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ProductsHeader
            onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          />

          <div className="flex flex-col lg:flex-row gap-8 mt-4 lg:mt-8">
            <aside className="hidden lg:block w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <ProductsFilters />
              </div>
            </aside>
            <main className="flex-1">
              <ProductsGrid />
            </main>
          </div>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h3 className="text-base font-semibold">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-sm text-gray-600"
              >
                Done
              </button>
            </div>
            <div className="px-4 pb-8">
              <ProductsFilters />
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </ProductsProvider>
  );
}

export default ProductsPageClient;
