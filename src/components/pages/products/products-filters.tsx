'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProductsContext } from '@/context/products-context';
import { usePublicControllerGetCategories } from '@/lib/api/generated/public/public';

export function ProductsFilters() {
  const {
    filters,
    clearFilters,
    updateSort,
    updateCategory,
    updateSearch,
    toggleFeatured,
  } = useProductsContext();

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    search: true,
    sort: true,
    categories: true,
    features: true,
  });

  // const [searchInput, setSearchInput] = useState(filters.search || '');

  const { data: categoriesData, isLoading: categoriesLoading } =
    usePublicControllerGetCategories();
  const categories = categoriesData || [];

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   updateSearch(searchInput.trim() || undefined);
  // };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      updateCategory(categoryId);
    } else {
      updateCategory(undefined);
    }
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [
      'createdAt' | 'name' | 'price',
      'asc' | 'desc'
    ];
    updateSort(sortBy, sortOrder);
  };

  // Update search input when filters change externally
  // useEffect(() => {
  //   setSearchInput(filters.search || '');
  // }, [filters.search]);

  const getSortValue = () => {
    return `${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`;
  };

  const hasActiveFilters = !!(
    filters.categoryId ||
    filters.featured ||
    filters.search
  );

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Active Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
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
              <Badge variant="secondary" className="flex items-center gap-1">
                Category:{' '}
                {categories.find((c) => c.id === filters.categoryId)?.name ||
                  filters.categoryId}
                <button
                  onClick={() => updateCategory(undefined)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.featured && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Featured
                <button
                  onClick={toggleFeatured}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Sort */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('sort')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-medium text-gray-900">Sort By</h3>
          {expandedSections.sort ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {expandedSections.sort && (
          <Select value={getSortValue()} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="price-asc">Price Low to High</SelectItem>
              <SelectItem value="price-desc">Price High to Low</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-medium text-gray-900">Categories</h3>
          {expandedSections.categories ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="space-y-2">
            {categoriesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.id}
                    checked={filters.categoryId === category.id}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={category.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Features */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('features')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-medium text-gray-900">Features</h3>
          {expandedSections.features ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {expandedSections.features && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={!!filters.featured}
                onCheckedChange={toggleFeatured}
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Featured Products
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
