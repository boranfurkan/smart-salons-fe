'use client';

import { Search, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useProductsContext } from '@/context/products-context';
import { useProducts } from '@/hooks/useProducts';
import { usePublicControllerGetCategories } from '@/lib/api/generated/public/public';

export function ProductsHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const {
    filters,
    updateSearch,
    updateCategory,
    toggleFeatured,
    clearFilters,
  } = useProductsContext();
  const { totalCount } = useProducts({
    externalFilters: filters,
    pageSize: 12,
  });
  const { data: categoriesData } = usePublicControllerGetCategories();
  const categories = categoriesData || [];

  // Calculate active filters count
  const activeFiltersCount = [
    filters.search,
    filters.categoryId,
    filters.featured,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600 mt-2">
          Discover our professional salon furniture and equipment collection
        </p>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateSearch(searchQuery.trim() || undefined);
              }
            }}
            className="pl-10"
          />
        </div>

        {/* View Mode and Filters */}
        <div className="flex gap-2">
          {/* Mobile Filters Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* View Mode Toggles */}
          <div className="hidden sm:flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {totalCount || 0} products found
          </span>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-gray-500">Filters:</span>

              {filters.search && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  Search: {filters.search}
                  <button
                    onClick={() => updateSearch(undefined)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {filters.categoryId && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  {categories.find((c) => c.id === filters.categoryId)?.name ||
                    'Category'}
                  <button
                    onClick={() => updateCategory(undefined)}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {filters.featured && (
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-1"
                >
                  Featured
                  <button
                    onClick={toggleFeatured}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={clearFilters}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button
                variant="ghost"
                onClick={() => setShowMobileFilters(false)}
              >
                Done
              </Button>
            </div>
            {/* Mobile filters content would go here */}
            <p className="text-gray-600">Mobile filters panel</p>
          </div>
        </div>
      )}
    </div>
  );
}
