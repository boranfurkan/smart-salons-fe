'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({
  className = '',
}: ProductCardSkeletonProps) {
  return (
    <div className={`group h-full ${className}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
        {/* Image Container Skeleton */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Skeleton className="w-full h-full" />

          {/* Discount Badge Skeleton */}
          <div className="absolute top-3 left-3">
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>

          {/* Action Buttons Skeleton */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>

          {/* Color Variants Skeleton */}
          <div className="absolute bottom-3 left-3">
            <div className="flex gap-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Category Badge Skeleton */}
          <Skeleton className="h-5 w-20 rounded-full" />

          {/* Product Name Skeleton */}
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Price and Stock Section Skeleton */}
          <div className="flex items-center justify-between mt-auto">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16" /> {/* Price */}
                <Skeleton className="h-4 w-12" /> {/* Original Price */}
              </div>
              <Skeleton className="h-5 w-20" /> {/* Save badge */}
            </div>

            <div className="text-right space-y-1">
              <Skeleton className="h-4 w-16" /> {/* In Stock */}
              <Skeleton className="h-3 w-12" /> {/* Stock count */}
            </div>
          </div>

          {/* Add to Cart Button Skeleton */}
          <div className="mt-3">
            <Skeleton className="w-full h-9 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProductsGridSkeletonProps {
  count?: number;
}

export function ProductsGridSkeleton({
  count = 12,
}: ProductsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} className="h-full" />
      ))}
    </div>
  );
}
