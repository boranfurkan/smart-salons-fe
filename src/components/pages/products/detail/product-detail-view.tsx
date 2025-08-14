'use client';

import Link from 'next/link';
import { ProductDetailContent } from './product-detail-content';
import { ProductDetailSkeleton } from './product-detail-skeleton';
import { usePublicControllerGetProductBySlug } from '@/lib/api/generated/public/public';

interface ProductDetailViewProps {
  slug: string;
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const {
    data: product,
    isLoading,
    error,
  } = usePublicControllerGetProductBySlug(slug);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetailContent product={product} />;
}
