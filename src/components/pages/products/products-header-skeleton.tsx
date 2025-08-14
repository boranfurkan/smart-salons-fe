'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ProductsHeaderSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Filter Button and View Toggle */}
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <div className="hidden sm:flex border border-gray-200 rounded-lg p-1">
            <Skeleton className="w-8 h-8 rounded" />
            <Skeleton className="w-8 h-8 rounded" />
          </div>
        </div>
      </div>

      {/* Results Summary and Active Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />

          {/* Active Filters */}
          <div className="hidden sm:flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-18 rounded-full" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
