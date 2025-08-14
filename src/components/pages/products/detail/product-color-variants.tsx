'use client';

import { cn } from '@/lib/utils';

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

interface ProductColorVariantsProps {
  variants: ColorVariantData[];
  selectedVariantId: string | null;
  onVariantChange: (variantId: string | null) => void;
}

export function ProductColorVariants({
  variants,
  selectedVariantId,
  onVariantChange,
}: ProductColorVariantsProps) {
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Color Options</h3>
        <span className="text-sm text-gray-600">
          {selectedVariantId === 'default'
            ? 'Default'
            : variants.find((v) => v.id === selectedVariantId)?.name ||
              'Select a color'}
        </span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {/* Default Option */}
        <button
          className={cn(
            'relative w-12 h-12 rounded-full border-2 transition-all duration-200 bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center',
            selectedVariantId === 'default'
              ? 'border-blue-600 ring-2 ring-blue-600/20 scale-110'
              : 'border-gray-300 hover:border-gray-400 hover:scale-105'
          )}
          onClick={() => onVariantChange('default')}
          title="Default"
        >
          <span className="text-xs text-gray-600 font-bold">D</span>
          {selectedVariantId === 'default' && (
            <div className="absolute inset-0 bg-blue-600/20 rounded-full" />
          )}
        </button>

        {/* Color Variants */}
        {variants.map((variant) => (
          <button
            key={variant.id}
            className={cn(
              'relative w-12 h-12 rounded-full border-2 transition-all duration-200',
              selectedVariantId === variant.id
                ? 'border-blue-600 ring-2 ring-blue-600/20 scale-110'
                : 'border-gray-300 hover:border-gray-400 hover:scale-105',
              variant.stock === 0 && 'opacity-50 cursor-not-allowed'
            )}
            style={{ backgroundColor: variant.hexCode }}
            onClick={() => variant.stock > 0 && onVariantChange(variant.id)}
            title={`${variant.name} ${
              variant.stock === 0 ? '(Out of stock)' : ''
            }`}
            disabled={variant.stock === 0}
          >
            {selectedVariantId === variant.id && (
              <div className="absolute inset-0 bg-blue-600/20 rounded-full" />
            )}
            {variant.stock === 0 && (
              <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center">
                <div className="w-6 h-0.5 bg-red-500 rotate-45" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Stock Information for Selected Variant */}
      {selectedVariantId && selectedVariantId !== 'default' && (
        <div className="text-sm text-gray-600">
          {(() => {
            const selectedVariant = variants.find(
              (v) => v.id === selectedVariantId
            );
            if (!selectedVariant) return null;

            if (selectedVariant.stock === 0) {
              return <span className="text-red-600">Out of stock</span>;
            } else if (selectedVariant.stock <= 5) {
              return (
                <span className="text-orange-600">
                  Only {selectedVariant.stock} left!
                </span>
              );
            } else {
              return (
                <span className="text-green-600">
                  {selectedVariant.stock} available
                </span>
              );
            }
          })()}
        </div>
      )}
    </div>
  );
}
