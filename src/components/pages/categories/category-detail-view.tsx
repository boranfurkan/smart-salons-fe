'use client';

import Link from 'next/link';
import {
  usePublicControllerGetCategoryBySlug,
  usePublicControllerGetProductsByCategory,
} from '@/lib/api/generated/public/public';
import { ProductCardGrid } from '@/components/products/product-card-grid';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryDetailViewProps {
  slug: string;
}

export function CategoryDetailView({ slug }: CategoryDetailViewProps) {
  const {
    data: category,
    isLoading: categoryLoading,
    error: categoryError,
  } = usePublicControllerGetCategoryBySlug(slug, {
    query: {
      enabled: !!slug,
    },
  });

  const { data: productsData, isLoading: productsLoading } =
    usePublicControllerGetProductsByCategory(
      slug,
      {},
      {
        query: {
          enabled: !!slug,
        },
      }
    );

  if (categoryLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (categoryError || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <p className="text-gray-600 mb-6">
            The category you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse All Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link
              href="/categories"
              className="text-gray-500 hover:text-gray-700"
            >
              Categories
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">{category.name}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-lg text-gray-600 max-w-2xl">
            {category.description}
          </p>
        )}
        <div className="mt-4 text-sm text-gray-500">
          {productsData?.total
            ? `${productsData.total} products`
            : 'No products'}
        </div>
      </div>

      {/* Products Grid */}
      {productsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-80 w-full" />
          ))}
        </div>
      ) : productsData?.products && productsData.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsData.products.map((product) => (
            <ProductCardGrid key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            There are currently no products in this category.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      )}
    </div>
  );
}
