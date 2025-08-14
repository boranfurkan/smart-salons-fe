'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export interface ProductFilters {
  categoryId?: string;
  sortBy?: 'createdAt' | 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  search?: string;
}

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial filters from URL
  const getFiltersFromURL = useCallback((): ProductFilters => {
    return {
      categoryId: searchParams.get('categoryId') || undefined,
      sortBy:
        (searchParams.get('sortBy') as 'createdAt' | 'name' | 'price') ||
        'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
      featured: searchParams.get('featured') === 'true' || undefined,
      search: searchParams.get('search') || undefined,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<ProductFilters>(getFiltersFromURL);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [filters]);

  // Update URL when filters change
  const updateFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);

      // Create new URLSearchParams
      const params = new URLSearchParams(searchParams);

      // Update or remove parameters
      Object.entries(updatedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== false) {
          params.set(key, value.toString());
        } else {
          params.delete(key);
        }
      });

      // Remove undefined filters
      Object.keys(newFilters).forEach((key) => {
        if (newFilters[key as keyof ProductFilters] === undefined) {
          params.delete(key);
        }
      });

      // Update URL
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [filters, router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const updateSort = useCallback(
    (
      sortBy: ProductFilters['sortBy'],
      sortOrder: ProductFilters['sortOrder']
    ) => {
      updateFilters({ sortBy, sortOrder });
    },
    [updateFilters]
  );

  const updateCategory = useCallback(
    (categoryId: string | undefined) => {
      updateFilters({ categoryId });
    },
    [updateFilters]
  );

  const updateSearch = useCallback(
    (search: string | undefined) => {
      updateFilters({ search });
    },
    [updateFilters]
  );

  const toggleFeatured = useCallback(() => {
    updateFilters({ featured: !filters.featured ? true : undefined });
  }, [filters.featured, updateFilters]);

  return {
    filters: memoizedFilters,
    updateFilters,
    clearFilters,
    updateSort,
    updateCategory,
    updateSearch,
    toggleFeatured,
  };
}
