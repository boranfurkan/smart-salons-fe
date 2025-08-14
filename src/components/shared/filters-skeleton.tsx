'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export function ProductsFiltersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>

      <Separator />

      {/* Sort Section */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Separator />

      {/* Categories Section */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Features Section */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-20" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
