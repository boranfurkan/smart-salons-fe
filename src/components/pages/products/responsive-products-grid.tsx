'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useProductsContext } from '@/context/products-context';
import { useResponsive } from '@/hooks/useResponsive';
import { MobileProductCard } from '@/components/shared/mobile-product-card';
import { ProductCardGrid } from '@/components/products/product-card-grid';
import { ProductsGridSkeleton } from '@/components/shared/product-skeleton';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, Grid3X3, List, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { usePublicControllerGetCategories } from '@/lib/api/generated/public/public';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface ResponsiveProductsGridProps {
  className?: string;
}

export function ResponsiveProductsGrid({
  className = '',
}: ResponsiveProductsGridProps) {
  const { filters, updateCategory, updateSearch, clearFilters } =
    useProductsContext();
  const { isMobile, isTablet } = useResponsive();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    pageSize: isMobile ? 8 : 12,
  });

  const { data: categoriesData } = usePublicControllerGetCategories();
  const categories = categoriesData || [];

  // Loading state - show skeleton on initial load
  if (isLoading) {
    return (
      <div className={className}>
        <ProductsGridSkeleton count={isMobile ? 8 : 12} />
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
            {filters.categoryId || filters.search
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

  // Calculate active filters count
  const activeFiltersCount = [filters.search, filters.categoryId].filter(
    Boolean
  ).length;

  const selectedCategory = categories.find(
    (cat) => cat.id === filters.categoryId
  );

  return (
    <div className={className}>
      {/* Mobile Header */}
      {(isMobile || isTablet) && (
        <div className="mb-6">
          {/* Results count and view toggle */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">
                {totalCount > 0 && (
                  <>
                    {products.length} of {totalCount} products
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-md border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1.5 rounded text-sm',
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded text-sm',
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters button and active filters */}
          <div className="flex items-center gap-2 mb-4">
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Categories
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="category"
                          checked={!filters.categoryId}
                          onChange={() => updateCategory('')}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">All Categories</span>
                      </label>
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name="category"
                            checked={filters.categoryId === category.id}
                            onChange={() => updateCategory(category.id)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{category.name}</span>
                          <span className="text-xs text-gray-500">
                            ({category.productCount})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Clear filters */}
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        clearFilters();
                        setShowMobileFilters(false);
                      }}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Active filters */}
            {selectedCategory && (
              <Badge variant="secondary" className="text-xs">
                {selectedCategory.name}
                <button
                  onClick={() => updateCategory('')}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Desktop products count */}
      {!isMobile && !isTablet && (
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {totalCount > 0 && (
              <>
                Showing {products.length} of {totalCount} products
              </>
            )}
          </p>
        </div>
      )}

      {/* Products Grid */}
      {(isMobile || isTablet) && viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {products.map((product, index) => (
            <MobileProductCard
              key={product.id}
              product={product}
              priority={index < 4}
              index={index}
            />
          ))}
        </div>
      ) : (isMobile || isTablet) && viewMode === 'list' ? (
        <div className="space-y-4 mb-8">
          {products.map((product, index) => (
            <ProductCardGrid
              key={product.id}
              product={product}
              priority={index < 4}
              className="w-full"
            />
          ))}
        </div>
      ) : (
        // Desktop grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr mb-8">
          {products.map((product) => (
            <ProductCardGrid
              key={product.id}
              product={product}
              priority={products.indexOf(product) < 4}
              className="h-full"
            />
          ))}
        </div>
      )}

      {/* Load more button */}
      {hasNextPage && (
        <div className="text-center">
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
              'Load More Products'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
