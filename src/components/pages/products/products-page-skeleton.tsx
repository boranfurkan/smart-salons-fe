'use client';

import { ProductsGridSkeleton } from '@/components/shared/product-skeleton';
import { ProductsFiltersSkeleton } from '@/components/shared/filters-skeleton';
import { ProductsHeaderSkeleton } from './products-header-skeleton';

export function ProductsPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Products Header Skeleton */}
        <ProductsHeaderSkeleton />

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Sidebar - Filters */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-4">
              <ProductsFiltersSkeleton />
            </div>
          </aside>

          {/* Main Content - Products Grid */}
          <main className="flex-1">
            <ProductsGridSkeleton count={12} />
          </main>
        </div>
      </div>
    </div>
  );
}
