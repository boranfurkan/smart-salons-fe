'use client';

import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  options?: any;
  showButtons?: boolean;
}

export const HorizontalCarousel: React.FC<CarouselProps> = ({
  children,
  className,
  options = { loop: false, dragFree: true, containScroll: 'trimSnaps' },
  showButtons = true,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">{children}</div>
      </div>

      {showButtons && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/90 shadow-lg hover:bg-white"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-white/90 shadow-lg hover:bg-white"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};

interface CarouselItemProps {
  children: React.ReactNode;
  className?: string;
}

export const CarouselItem: React.FC<CarouselItemProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('flex-[0_0_auto] min-w-0', className)}>{children}</div>
  );
};
