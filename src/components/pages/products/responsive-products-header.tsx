'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProductsContext } from '@/context/products-context';
import { useProducts } from '@/hooks/useProducts';
import { useResponsive } from '@/hooks/useResponsive';
import { usePublicControllerGetCategories } from '@/lib/api/generated/public/public';

export function ResponsiveProductsHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isMobile, isTablet } = useResponsive();

  const { filters, updateSearch, clearFilters } = useProductsContext();

  const { totalCount } = useProducts({
    externalFilters: filters,
    pageSize: 12,
  });

  const { data: categoriesData } = usePublicControllerGetCategories();
  const categories = categoriesData || [];

  // Calculate active filters count
  const activeFiltersCount = [filters.search, filters.categoryId].filter(
    Boolean
  ).length;

  const selectedCategory = categories.find(
    (cat) => cat.id === filters.categoryId
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    updateSearch('');
  };

  return (
    <div className="space-y-4">
      {/* Page Title */}
      <div>
        <h1
          className={`font-bold text-gray-900 ${
            isMobile ? 'text-2xl' : 'text-3xl'
          }`}
        >
          Products
        </h1>
        <p
          className={`text-gray-600 mt-2 ${isMobile ? 'text-sm' : 'text-base'}`}
        >
          {selectedCategory
            ? `${selectedCategory.name} - ${selectedCategory.productCount} products`
            : `Discover our professional salon furniture and equipment collection ${
                totalCount > 0 ? `(${totalCount} products)` : ''
              }`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={
                isMobile
                  ? 'Search products...'
                  : 'Search products, categories, or brands...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {(searchQuery || filters.search) && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" size={isMobile ? 'default' : 'lg'}>
            Search
          </Button>
        </form>
      </div>

      {/* Active search/filters indicator */}
      {filters.search && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Searching for:</span>
          <span className="font-medium">"{filters.search}"</span>
          <button
            onClick={() => updateSearch('')}
            className="text-blue-600 hover:text-blue-700"
          >
            Clear
          </button>
        </div>
      )}

      {/* Clear all filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm text-blue-800">
            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}{' '}
            applied
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-700 hover:text-blue-800"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
