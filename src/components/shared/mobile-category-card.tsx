'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MobileCategoryCardProps {
  category: {
    id: string;
    name: string;
    description?: string;
    slug: string;
    imageUrl?: string | null;
    productCount: number;
  };
  className?: string;
  index?: number;
}

export const MobileCategoryCard = ({
  category,
  className,
  index = 0,
}: MobileCategoryCardProps) => {
  const imageUrl =
    typeof category.imageUrl === 'string' && category.imageUrl
      ? category.imageUrl
      : `https://picsum.photos/300/200?random=${category.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn('w-[280px] sm:w-[320px]', className)}
    >
      <Link href={`/products?categoryId=${category.id}`}>
        <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
          {/* Image Container */}
          <div className="relative h-32 sm:h-36 overflow-hidden bg-gray-50">
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 280px, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Product count badge */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Package className="h-3 w-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">
                {category.productCount}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>

            {category.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {category.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {category.productCount}{' '}
                {category.productCount === 1 ? 'product' : 'products'}
              </span>
              <span className="text-xs font-medium text-blue-600 group-hover:text-blue-700">
                Shop now
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
