'use client';

import { useState } from 'react';
import { ArrowLeft, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProductImageGallery } from './product-image-gallery';
import { ProductColorVariants } from './product-color-variants';
import { ProductQuantitySelector } from './product-quantity-selector';
import { AddToCartButton } from '@/components/shared/add-to-cart-button';
import { WishlistButton } from '@/components/shared/wishlist-button';
import { ShareProductButton } from '@/components/shared/share-product-button';
import type { ProductDto } from '@/lib/api/generated/smartSalonsAPI.schemas';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface ProductDetailContentProps {
  product: ProductDto;
}

export function ProductDetailContent({ product }: ProductDetailContentProps) {
  const router = useRouter();
  // const { user } = useAuth(); // Uncomment when needed
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    'default'
  );
  const [quantity, setQuantity] = useState(1);

  const colorVariants = product.colorVariants as unknown as ColorVariantData[];
  const productImages = product.images as unknown as ImageData[];
  const hasColorVariants = colorVariants && colorVariants.length > 0;

  const selectedVariant =
    selectedVariantId && selectedVariantId !== 'default'
      ? colorVariants?.find((variant) => variant.id === selectedVariantId)
      : null;

  // Price calculations
  const basePrice = parseFloat(product.price);
  const discount = parseFloat(product.discount);
  const variantPrice = selectedVariant?.price
    ? parseFloat(selectedVariant.price)
    : basePrice;
  const variantDiscount = selectedVariant?.discount
    ? parseFloat(selectedVariant.discount)
    : discount;
  const finalPrice = variantPrice - variantDiscount;
  const hasDiscount = variantDiscount > 0;
  const discountPercentage =
    variantPrice > 0 ? (variantDiscount / variantPrice) * 100 : 0;

  // Stock information
  const currentStock = selectedVariant?.stock ?? product.stock;
  const isInStock = currentStock > 0;

  // Images for gallery
  const galleryImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : productImages || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <ProductImageGallery
                images={galleryImages}
                productName={product.name}
                priority
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-500">
                <Link href="/products" className="hover:text-gray-700">
                  Products
                </Link>
                <span className="mx-2">/</span>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="hover:text-gray-700"
                >
                  {product.category.name}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{product.name}</span>
              </div>

              {/* Product Title and Rating */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      (4.2 • 156 reviews)
                    </span>
                  </div>
                  <Badge variant={isInStock ? 'default' : 'destructive'}>
                    {isInStock ? `${currentStock} in stock` : 'Out of stock'}
                  </Badge>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-600">
                    £{finalPrice.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        £{variantPrice.toFixed(2)}
                      </span>
                      <Badge variant="destructive">
                        {Math.round(discountPercentage)}% OFF
                      </Badge>
                    </>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-sm text-green-600 font-medium">
                    You save £{variantDiscount.toFixed(2)}
                  </p>
                )}
              </div>

              <Separator />

              {/* Color Variants */}
              {hasColorVariants && (
                <ProductColorVariants
                  variants={colorVariants}
                  selectedVariantId={selectedVariantId}
                  onVariantChange={setSelectedVariantId}
                />
              )}

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {product.dimensions && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Dimensions
                    </h3>
                    <p className="text-gray-600">{product.dimensions}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <ProductQuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  maxQuantity={currentStock}
                  disabled={!isInStock}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <AddToCartButton
                    productId={product.id}
                    selectedVariantId={selectedVariantId}
                    quantity={quantity}
                    price={variantPrice}
                    discount={variantDiscount}
                    stock={currentStock}
                    disabled={!isInStock}
                    className="flex-1"
                  />

                  <WishlistButton productId={product.id} />

                  <ShareProductButton productName={product.name} />
                </div>
              </div>

              <Separator />

              {/* Delivery Information */}
              {product.deliveryDescription && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">
                    Delivery & Returns
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Free Delivery</p>
                        <p className="text-sm text-gray-600">
                          {product.deliveryDescription}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">30-Day Returns</p>
                        <p className="text-sm text-gray-600">
                          Free returns on all items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">2-Year Warranty</p>
                        <p className="text-sm text-gray-600">
                          Comprehensive coverage included
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
