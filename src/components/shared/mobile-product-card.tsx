'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

interface ImageData {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  order: number;
}

interface ColorVariantData {
  id: string;
  name: string;
  hexCode: string;
  stock: number;
  price?: string;
  discount?: string;
  sku?: string;
  isActive: boolean;
  images: ImageData[];
}

interface MobileProductCardProps {
  product: ProductDto;
  className?: string;
  priority?: boolean;
  index?: number;
}

export function MobileProductCard({
  product,
  className = '',
  priority = false,
  index = 0,
}: MobileProductCardProps) {
  const colorVariants = product.colorVariants as unknown as ColorVariantData[];
  const productImages = product.images as unknown as ImageData[];
  const [imageLoading, setImageLoading] = useState(true);

  const hasColorVariants = colorVariants && colorVariants.length > 0;
  const primaryImage =
    productImages?.find((img) => img.isPrimary) || productImages?.[0];

  const basePrice = parseFloat(product.price);
  const baseDiscount = parseFloat(product.discount);
  const finalPrice = basePrice - baseDiscount;
  const hasDiscount = baseDiscount > 0;
  const discountPercentage = hasDiscount ? (baseDiscount / basePrice) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn('w-[200px] sm:w-[240px]', className)}
    >
      <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Link href={`/products/${product.slug}`}>
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.name}
                fill
                className={cn(
                  'object-cover transition-all duration-300 group-hover:scale-105',
                  imageLoading ? 'blur-sm' : 'blur-0'
                )}
                onLoad={() => setImageLoading(false)}
                priority={priority}
                sizes="(max-width: 640px) 200px, 240px"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{Math.round(discountPercentage)}%
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col gap-1">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick add to cart for mobile */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" className="w-full text-xs h-8">
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm group-hover:text-blue-600 transition-colors mb-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating (if available) */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-3 w-3 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">(24)</span>
          </div>

          {/* Color variants */}
          {hasColorVariants && (
            <div className="flex gap-1 mb-2">
              {colorVariants.slice(0, 4).map((variant) => (
                <div
                  key={variant.id}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: variant.hexCode }}
                  title={variant.name}
                />
              ))}
              {colorVariants.length > 4 && (
                <div className="w-4 h-4 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    +{colorVariants.length - 4}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-sm">
              ${finalPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-500 line-through">
                ${basePrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          <div className="mt-1">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-green-500 h-1 rounded-full"
                style={{ width: '70%' }}
              />
            </div>
            <span className="text-xs text-gray-500 mt-1">Only few left</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
