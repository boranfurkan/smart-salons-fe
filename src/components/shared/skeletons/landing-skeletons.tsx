import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-8 h-8 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function CategoryGridCardSkeleton() {
  return (
    <div className="group relative flex h-56 flex-col justify-end overflow-hidden p-6 md:h-80 md:p-9">
      {/* Product Count Badge Skeleton */}
      <div className="absolute left-3 top-5 z-10 flex items-center gap-1.5">
        <Skeleton className="w-4 h-4 bg-neutral-600" />
        <Skeleton className="w-16 h-3 bg-neutral-600" />
      </div>

      {/* Content Container - Fixed positioning from bottom */}
      <div className="relative z-10 space-y-2">
        {/* Category Title Skeleton */}
        <div className="h-16 md:h-20 flex items-end">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32 bg-neutral-600" />
            <Skeleton className="h-6 w-24 bg-neutral-600" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="h-10 md:h-12 space-y-1">
          <Skeleton className="h-3 w-full bg-neutral-700" />
          <Skeleton className="h-3 w-3/4 bg-neutral-700" />
        </div>
      </div>

      {/* Background overlay for dark theme */}
      <div className="absolute inset-0 bg-neutral-800/50" />
    </div>
  );
}

export function CategoryGridTitleCardSkeleton() {
  return (
    <div className="group relative flex h-56 flex-col justify-between bg-neutral-800 p-6 md:h-80 md:p-9">
      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-24 bg-neutral-600" />
        <Skeleton className="h-10 w-32 bg-neutral-600" />
      </div>

      {/* Bottom text skeleton */}
      <div className="flex items-center gap-1.5">
        <Skeleton className="w-4 h-4 bg-neutral-600" />
        <Skeleton className="w-28 h-3 bg-neutral-600" />
      </div>

      {/* Arrow icon skeleton */}
      <div className="absolute right-3 top-4">
        <Skeleton className="w-6 h-6 bg-neutral-600" />
      </div>
    </div>
  );
}

export function SocialPostSkeleton() {
  return (
    <div
      className="shrink-0"
      style={{ width: 280, height: 350, marginRight: 16 }}
    >
      <div className="relative w-full h-full rounded-2xl bg-gray-100 overflow-hidden">
        <Skeleton className="w-full h-full" />

        {/* Platform Badge Skeleton */}
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-20 rounded-full bg-white/20" />
        </div>

        {/* Content Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24 bg-white/20" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-full bg-white/20" />
              <Skeleton className="h-5 w-3/4 bg-white/20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-white/20" />
              <Skeleton className="h-6 w-12 rounded-full bg-white/20" />
            </div>
          </div>
        </div>

        {/* External Link Skeleton */}
        <div className="absolute top-4 right-4">
          <Skeleton className="w-8 h-8 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export function ProductsSectionSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategoriesSectionSkeleton() {
  // Create skeleton data similar to the real component
  const skeletonRows = [
    [null, {}, {}, {}], // First row with title card
    [{}, {}, {}, {}], // Second row
  ];

  return (
    <section className="py-16 bg-neutral-900 text-neutral-50">
      <div className="container mx-auto px-4">
        {/* Section Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4 bg-neutral-700" />
          <Skeleton className="h-5 w-96 mx-auto bg-neutral-700" />
        </div>

        {/* Categories Grid Skeleton */}
        <div className="mx-auto max-w-7xl">
          {skeletonRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`grid grid-cols-1 divide-y divide-neutral-700 border border-neutral-700 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:divide-x sm:divide-y-0 ${
                rowIndex > 0 ? 'border-t-0' : ''
              }`}
            >
              {row.map((item, colIndex) => (
                <div key={`skeleton-${rowIndex}-${colIndex}`}>
                  {item === null ? (
                    <CategoryGridTitleCardSkeleton />
                  ) : (
                    <CategoryGridCardSkeleton />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SocialPostsSectionSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="space-y-4">
            <Skeleton className="h-10 w-80 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
          <Skeleton className="h-5 w-96 mx-auto mt-4" />
        </div>

        {/* Carousel Skeleton */}
        <div className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="flex">
              {[...Array(4)].map((_, i) => (
                <SocialPostSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Navigation Button Skeletons */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2">
            <Skeleton className="w-12 h-12 rounded-r-xl" />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Skeleton className="w-12 h-12 rounded-l-xl" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Skeleton className="h-11 w-44 rounded-md" />
            <Skeleton className="h-11 w-36 rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
}
