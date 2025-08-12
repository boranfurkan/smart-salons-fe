'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ProductDto } from '@/lib/api/generated/smartSalonsAPI.schemas';

// Type helpers for the images until API generation is fixed
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

interface ProductCardProps {
  product: ProductDto;
  className?: string;
  priority?: boolean;
}

export function ProductCard({
  product,
  className = '',
  priority = false,
}: ProductCardProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    (product.colorVariants as unknown as ColorVariantData[])?.[0]?.id || null
  );
  const [imageLoading, setImageLoading] = useState(true);

  const colorVariants = product.colorVariants as unknown as ColorVariantData[];
  const productImages = product.images as unknown as ImageData[];

  const selectedVariant = colorVariants?.find(
    (variant) => variant.id === selectedVariantId
  );

  // Get the primary image for the selected variant or fallback to product images
  const primaryImage: string =
    selectedVariant?.images?.find((img) => img.isPrimary)?.url ||
    selectedVariant?.images?.[0]?.url ||
    productImages?.find((img) => img.isPrimary)?.url ||
    productImages?.[0]?.url ||
    `https://picsum.photos/400/400?random=${product.id}`;

  // Calculate prices
  const basePrice = parseFloat(product.price);
  const discount = parseFloat(product.discount);
  const variantPrice = selectedVariant?.price
    ? parseFloat(selectedVariant.price)
    : basePrice;
  const variantDiscount = selectedVariant?.discount
    ? parseFloat(selectedVariant.discount)
    : discount;

  const finalPrice = variantPrice * (1 - variantDiscount / 100);
  const hasDiscount = variantDiscount > 0;

  return (
    <motion.div
      className={`group cursor-pointer ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              priority={priority}
            />

            {/* Loading skeleton */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <Badge
                variant="destructive"
                className="absolute top-3 left-3 z-10"
              >
                -{Math.round(variantDiscount)}%
              </Badge>
            )}

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
              <Button
                size="icon"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Add to cart functionality
                }}
              >
                <ShoppingBag className="w-4 h-4" />
              </Button>
            </div>

            {/* Color Variants */}
            {colorVariants && colorVariants.length > 1 && (
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex gap-2 flex-wrap">
                  {colorVariants.slice(0, 5).map((variant) => (
                    <button
                      key={variant.id}
                      className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                        selectedVariantId === variant.id
                          ? 'border-white shadow-lg scale-110'
                          : 'border-white/60 hover:border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: variant.hexCode }}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedVariantId(variant.id);
                      }}
                      title={variant.name}
                    />
                  ))}
                  {colorVariants.length > 5 && (
                    <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-white/60 flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">
                        +{colorVariants.length - 5}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {selectedVariant && selectedVariant.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="bg-red-500 text-white">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  ${finalPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    ${variantPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {selectedVariant && (
                <div className="text-xs text-gray-500">
                  {selectedVariant.stock > 0 ? (
                    <span className="text-green-600">
                      {selectedVariant.stock} in stock
                    </span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {product.category.name}
              </Badge>
              {selectedVariant && (
                <span className="text-xs text-gray-500">
                  {selectedVariant.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
