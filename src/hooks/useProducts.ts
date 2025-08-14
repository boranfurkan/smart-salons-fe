'use client';

import { useState, useMemo, useEffect } from 'react';
import { usePublicControllerGetProducts } from '@/lib/api/generated/public/public';
import type { PublicControllerGetProductsParams } from '@/lib/api/generated/smartSalonsAPI.schemas';

export interface ProductsFilters {
  categoryId?: string;
  sortBy?: 'createdAt' | 'name' | 'price';
  sortOrder?: 'asc' | 'desc';
  featured?: boolean;
  search?: string;
}

export interface UseProductsOptions {
  externalFilters?: ProductsFilters;
  pageSize?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { externalFilters, pageSize = 12 } = options;

  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when external filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [externalFilters]);

  // Calculate API parameters
  const apiParams: PublicControllerGetProductsParams = useMemo(() => {
    const params: PublicControllerGetProductsParams = {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    };

    if (externalFilters?.categoryId) {
      params.categoryId = externalFilters.categoryId;
    }

    if (externalFilters?.sortBy) {
      params.sortBy = externalFilters.sortBy;
    }

    if (externalFilters?.sortOrder) {
      params.sortOrder = externalFilters.sortOrder;
    }

    if (externalFilters?.featured !== undefined) {
      params.featured = externalFilters.featured;
    }

    if (externalFilters?.search) {
      params.search = externalFilters.search;
    }

    return params;
  }, [externalFilters, currentPage, pageSize]); // Use the generated API hook
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
    isFetching,
  } = usePublicControllerGetProducts(apiParams, {
    query: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  });

  const products = productsResponse?.products || [];
  const totalCount = productsResponse?.total || 0;
  const totalPages = Math.ceil(totalCount / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Pagination actions
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return {
    // Data
    products,
    totalCount,
    totalPages,
    currentPage,

    // Loading states
    isLoading,
    isFetching,
    isLoadingMore: false, // Simplified - no infinite scroll for now

    // Error handling
    error,
    refetch,

    // Pagination
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    loadMore: nextPage, // Use nextPage instead of complex loadMore
  };
}
