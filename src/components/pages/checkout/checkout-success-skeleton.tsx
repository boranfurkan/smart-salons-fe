'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export function CheckoutSuccessSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation Skeleton */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Skeleton className="w-12 h-12 rounded-full" />
            </div>
            <Skeleton className="h-9 w-80 mx-auto mb-2" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Order Details Card Skeleton */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-5 w-28 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4" />
                    <Skeleton className="h-4 w-44" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-5 w-28 mb-2" />
                  <div className="text-gray-600 text-sm space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Order Summary Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps Skeleton */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0 mt-0.5">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0 mt-0.5">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0 mt-0.5">
                  <Skeleton className="w-full h-full rounded-full" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Skeleton className="flex-1 h-12 rounded-lg" />
            <Skeleton className="flex-1 h-12 rounded-lg" />
            <Skeleton className="flex-1 h-12 rounded-lg" />
          </div>

          {/* Contact Support Skeleton */}
          <div className="text-center mt-12 p-6 bg-gray-100 rounded-xl">
            <Skeleton className="w-8 h-8 mx-auto mb-3 rounded" />
            <Skeleton className="h-5 w-20 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto mb-1" />
            <Skeleton className="h-4 w-48 mx-auto mb-4" />
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Skeleton className="h-8 w-24" />
              <div className="hidden sm:block text-gray-400">•</div>
              <Skeleton className="h-8 w-16" />
              <div className="hidden sm:block text-gray-400">•</div>
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
