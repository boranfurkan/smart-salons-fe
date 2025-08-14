import { Skeleton } from '@/components/ui/skeleton';

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back button skeleton */}
        <Skeleton className="h-10 w-32 mb-6" />

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Product Information Skeleton */}
            <div className="space-y-6">
              {/* Breadcrumb */}
              <Skeleton className="h-4 w-48" />

              {/* Title and Rating */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-32" />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Color Variants */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="w-8 h-8 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Quantity and Buttons */}
              <div className="space-y-3">
                <Skeleton className="h-12 w-32" />
                <div className="flex gap-3">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-12" />
                  <Skeleton className="h-12 w-12" />
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
