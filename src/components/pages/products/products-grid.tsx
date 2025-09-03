'use client';

import { useProducts } from '@/hooks/useProducts';
import { useProductsContext } from '@/context/products-context';
import { ProductCardGrid } from '@/components/products/product-card-grid';
import { ProductsGridSkeleton } from '@/components/shared/product-skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ProductsGridProps {
  className?: string;
}

export function ProductsGrid({ className = '' }: ProductsGridProps) {
  const { filters } = useProductsContext();

  const {
    products,
    isLoading,
    isFetching,
    error,
    hasNextPage,
    loadMore,
    refetch,
    totalCount,
  } = useProducts({
    externalFilters: filters,
    pageSize: 12,
  });

  // Loading state - show skeleton on initial load
  if (isLoading) {
    return (
      <div className={className}>
        <ProductsGridSkeleton count={12} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load products. Please try again.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (!products.length) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="max-w-md mx-auto">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-12 0H4m16 0a2 2 0 00-2-2h-2m-12 0H6a2 2 0 00-2-2H6z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-4">
            {filters.categoryId || filters.featured || filters.search
              ? 'No products match your current filters.'
              : 'No products are available at the moment.'}
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Products count */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {totalCount > 0 && (
            <>
              Showing {products.length} of {totalCount} products
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
        {products.map((product) => (
          <ProductCardGrid
            key={product.id}
            product={product}
            priority={products.indexOf(product) < 4} // Priority for first 4 products
            className="h-full"
          />
        ))}
      </div>

      {/* Pagination */}
      {hasNextPage && (
        <div className="mt-12 text-center">
          <Button
            onClick={loadMore}
            disabled={isFetching}
            variant="outline"
            size="lg"
            className="min-w-[160px]"
          >
            {isFetching ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Next Page'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
