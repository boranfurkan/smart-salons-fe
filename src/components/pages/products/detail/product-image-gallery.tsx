'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageData {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  order: number;
}

interface ProductImageGalleryProps {
  images: ImageData[];
  productName: string;
  priority?: boolean;
}

export function ProductImageGallery({
  images,
  productName,
  priority = false,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fallback image if no images provided
  const displayImages =
    images?.length > 0
      ? images.sort((a, b) => a.order - b.order)
      : [
          {
            id: 'fallback',
            url: 'https://picsum.photos/800/800?random=product',
            altText: productName,
            isPrimary: true,
            order: 1,
          },
        ];

  const currentImage = displayImages[selectedImageIndex];

  const goToPrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative group">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={currentImage.url}
            alt={currentImage.altText || productName}
            fill
            className={cn(
              'object-cover transition-transform duration-300',
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            )}
            priority={priority}
            onClick={() => setIsZoomed(!isZoomed)}
          />

          {/* Navigation Arrows - only show if multiple images */}
          {displayImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={goToPrevious}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={goToNext}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Zoom indicator */}
          <div className="absolute top-2 right-2 bg-white/80 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Expand className="w-4 h-4 text-gray-600" />
          </div>

          {/* Image counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {selectedImageIndex + 1} / {displayImages.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery - only show if multiple images */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={image.id}
              className={cn(
                'relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0',
                selectedImageIndex === index
                  ? 'border-blue-600 ring-2 ring-blue-600/20'
                  : 'border-gray-200 hover:border-gray-300'
              )}
              onClick={() => setSelectedImageIndex(index)}
            >
              <Image
                src={image.url}
                alt={image.altText || `${productName} ${index + 1}`}
                fill
                className="object-cover"
              />
              {selectedImageIndex === index && (
                <div className="absolute inset-0 bg-blue-600/20" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
