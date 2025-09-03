'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/shared/add-to-cart-button';
import { WishlistButton } from '@/components/shared/wishlist-button';
import { ShareProductButton } from '@/components/shared/share-product-button';
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

interface ProductCardGridProps {
  product: ProductDto;
  className?: string;
  priority?: boolean;
}

export function ProductCardGrid({
  product,
  className = '',
  priority = false,
}: ProductCardGridProps) {
  const colorVariants = product.colorVariants as unknown as ColorVariantData[];
  const productImages = product.images as unknown as ImageData[];

  const hasColorVariants = colorVariants && colorVariants.length > 0;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    hasColorVariants ? 'default' : null
  );
  const [imageLoading, setImageLoading] = useState(true);

  const selectedVariant = colorVariants?.find(
    (v) => v.id === selectedVariantId
  );
  const isDefaultSelected = selectedVariantId === 'default';

  const currentImages =
    isDefaultSelected || !selectedVariant
      ? productImages
      : selectedVariant.images;

  const primaryImage =
    currentImages?.find((img) => img.isPrimary) || currentImages?.[0];

  const basePrice = parseFloat(product.price);
  const baseDiscount = parseFloat(product.discount);

  const variantPrice = selectedVariant?.price
    ? parseFloat(selectedVariant.price)
    : basePrice;
  const variantDiscount = selectedVariant?.discount
    ? parseFloat(selectedVariant.discount)
    : baseDiscount;

  const finalPrice = variantPrice - variantDiscount;
  const hasDiscount = variantDiscount > 0;
  const discountPercentage = hasDiscount
    ? (variantDiscount / variantPrice) * 100
    : 0;

  const currentStock = selectedVariant?.stock || 100;

  return (
    <motion.div
      className={`group relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/products/${product.slug}`} className="block h-full">
        <div className="bg-white rounded-md sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-50">
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`object-cover transition-all duration-300 group-hover:scale-105 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setImageLoading(false)}
                priority={priority}
              />
            )}

            {/* Loading skeleton */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <Badge
                variant="destructive"
                className="absolute top-3 left-3 z-10 text-xs"
              >
                -{Math.round(discountPercentage)}%
              </Badge>
            )}

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div onClick={(e) => e.preventDefault()}>
                <WishlistButton productId={product.id} />
              </div>
              <div onClick={(e) => e.preventDefault()}>
                <ShareProductButton />
              </div>
            </div>

            {/* Color Variants - Simplified for grid */}
            {hasColorVariants && (
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex gap-1 justify-center">
                  {/* Default option */}
                  <button
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 bg-gray-200 ${
                      selectedVariantId === 'default'
                        ? 'border-white shadow-md scale-110'
                        : 'border-white/60 hover:border-white'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVariantId('default');
                    }}
                    title="Default"
                  />

                  {/* Color variants - show only first 3 to save space */}
                  {colorVariants.slice(0, 3).map((variant) => (
                    <button
                      key={variant.id}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        selectedVariantId === variant.id
                          ? 'border-white shadow-md scale-110'
                          : 'border-white/60 hover:border-white'
                      }`}
                      style={{ backgroundColor: variant.hexCode }}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedVariantId(variant.id);
                      }}
                      title={variant.name}
                    />
                  ))}

                  {/* Show count if more variants */}
                  {colorVariants.length > 3 && (
                    <div className="w-4 h-4 rounded-full bg-gray-600 border-2 border-white/60 flex items-center justify-center">
                      <span className="text-[7px] text-white font-bold">
                        +{colorVariants.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-3 flex-1 flex flex-col">
            {/* Category */}
            <Badge
              variant="outline"
              className="hidden sm:inline-flex text-[10px] sm:text-xs w-fit"
            >
              {product.category.name}
            </Badge>

            {/* Product Name */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-[13px] sm:text-sm leading-snug sm:leading-tight flex-1">
              {product.name}
            </h3>

            {/* Price and Stock */}
            <div className="flex items-center justify-between mt-auto">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[15px] sm:text-lg font-bold text-gray-900">
                    ${finalPrice.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] sm:text-sm text-gray-500 line-through">
                      ${variantPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <Badge
                    variant="destructive"
                    className="hidden sm:inline-flex text-[10px] sm:text-xs"
                  >
                    Save ${variantDiscount.toFixed(2)}
                  </Badge>
                )}
              </div>

              <div className="text-right">
                {currentStock > 0 ? (
                  <div className="text-[10px] sm:text-xs">
                    <span className="text-green-600 font-semibold">
                      ✓ In Stock
                    </span>
                    <div className="hidden sm:block text-gray-500">
                      {currentStock} left
                    </div>
                  </div>
                ) : (
                  <span className="text-[10px] sm:text-xs text-red-600 font-semibold">
                    Out of stock
                  </span>
                )}
              </div>
            </div>

            <div onClick={(e) => e.preventDefault()} className="mt-2 sm:mt-3">
              <AddToCartButton
                productId={product.id}
                selectedVariantId={selectedVariantId}
                quantity={1}
                price={variantPrice}
                discount={variantDiscount}
                stock={currentStock}
                showPrice={false}
                className="w-full font-semibold text-[11px] sm:text-sm h-8 sm:h-9"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
