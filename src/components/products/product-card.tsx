'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const colorVariants = product.colorVariants as unknown as ColorVariantData[];
  const productImages = product.images as unknown as ImageData[];

  // If there are color variants, include a "default" option along with variants
  // If no color variants, just show the product images
  const hasColorVariants = colorVariants && colorVariants.length > 0;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    hasColorVariants ? 'default' : null
  );
  const [imageLoading, setImageLoading] = useState(true);

  const selectedVariant =
    selectedVariantId && selectedVariantId !== 'default'
      ? colorVariants?.find((variant) => variant.id === selectedVariantId)
      : null;

  const primaryImage: string =
    selectedVariant?.images?.find((img) => img.isPrimary)?.url ||
    selectedVariant?.images?.[0]?.url ||
    productImages?.find((img) => img.isPrimary)?.url ||
    productImages?.[0]?.url ||
    `https://picsum.photos/400/400?random=${product.id}`;

  const basePrice = parseFloat(product.price);
  const discount = parseFloat(product.discount);

  // Use variant price/discount if a specific variant is selected, otherwise use base price
  const variantPrice = selectedVariant?.price
    ? parseFloat(selectedVariant.price)
    : basePrice;
  const variantDiscount = selectedVariant?.discount
    ? parseFloat(selectedVariant.discount)
    : discount;

  // Discount is an amount, not a percentage
  const finalPrice = variantPrice - variantDiscount;
  const hasDiscount = variantDiscount > 0;
  const discountPercentage =
    variantPrice > 0 ? (variantDiscount / variantPrice) * 100 : 0;

  // Use variant stock if a specific variant is selected, otherwise use base stock
  const currentStock = selectedVariant?.stock ?? product.stock;

  return (
    <motion.div
      className={`group cursor-pointer h-full ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${product.slug}`} className="h-full">
        <div className="relative h-full flex flex-col">
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
                -${variantDiscount.toFixed(2)}
              </Badge>
            )}

            {/* Color Variants */}
            {hasColorVariants && (
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex gap-2 flex-wrap">
                  {/* Default option - show product's main image */}
                  <button
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-200 bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center ${
                      selectedVariantId === 'default'
                        ? 'border-white shadow-lg scale-110'
                        : 'border-white/60 hover:border-white hover:scale-105'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedVariantId('default');
                    }}
                    title="Default"
                  >
                    <span className="text-[8px] text-gray-600 font-bold">
                      D
                    </span>
                  </button>

                  {/* Color variants */}
                  {colorVariants.slice(0, 4).map((variant) => (
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
                  {colorVariants.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-gray-600 border-2 border-white/60 flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">
                        +{colorVariants.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {currentStock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="bg-red-500 text-white">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-4 space-y-3 flex-1 flex flex-col">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {product.name}
              </h3>
            </div>

            <p className="text-sm text-gray-600 w-full h-9 leading-5 overflow-hidden line-clamp-2">
              {product.description}
            </p>

            <div className="space-y-3 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">
                      ${finalPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-lg text-gray-500 line-through">
                        ${variantPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="destructive" className="text-xs">
                        Save ${variantDiscount.toFixed(2)}
                      </Badge>
                      <span className="text-xs text-gray-600">
                        ({Math.round(discountPercentage)}% off)
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  {currentStock > 0 ? (
                    <div className="text-xs">
                      <span className="text-green-600 font-semibold">
                        ✓ In Stock
                      </span>
                      <div className="text-gray-500">
                        {currentStock} available
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-red-600 font-semibold">
                      Out of stock
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                variant="green"
                className="w-full font-semibold"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  // TODO: Add to cart functionality
                }}
                disabled={currentStock === 0}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                {currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              {/* Category and Variant */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {product.category.name}
                </Badge>
                {selectedVariant && (
                  <span className="text-xs text-gray-500">
                    {selectedVariant.name}
                  </span>
                )}
                {selectedVariantId === 'default' && hasColorVariants && (
                  <span className="text-xs text-gray-500">Default</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
