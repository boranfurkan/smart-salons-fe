'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useProductFilters, ProductFilters } from '@/hooks/useProductFilters';

interface ProductsContextType {
  filters: ProductFilters;
  updateFilters: (newFilters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  updateSort: (
    sortBy: ProductFilters['sortBy'],
    sortOrder: ProductFilters['sortOrder']
  ) => void;
  updateCategory: (categoryId: string | undefined) => void;
  updateSearch: (search: string | undefined) => void;
  toggleFeatured: () => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error(
      'useProductsContext must be used within a ProductsProvider'
    );
  }
  return context;
}

interface ProductsProviderProps {
  children: ReactNode;
}

export function ProductsProvider({ children }: ProductsProviderProps) {
  const filtersState = useProductFilters();

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      filters: filtersState.filters,
      updateFilters: filtersState.updateFilters,
      clearFilters: filtersState.clearFilters,
      updateSort: filtersState.updateSort,
      updateCategory: filtersState.updateCategory,
      updateSearch: filtersState.updateSearch,
      toggleFeatured: filtersState.toggleFeatured,
    }),
    [
      filtersState.filters,
      filtersState.updateFilters,
      filtersState.clearFilters,
      filtersState.updateSort,
      filtersState.updateCategory,
      filtersState.updateSearch,
      filtersState.toggleFeatured,
    ]
  );

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}
