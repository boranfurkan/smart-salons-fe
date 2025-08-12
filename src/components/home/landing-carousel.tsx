'use client';
import { usePublicControllerGetCarouselItems } from '@/lib/api/generated/public/public';

import { ExpoSlider } from '../shared/expo-slider/expo-slider';
import { ExpoSliderSkeleton } from '../shared/expo-slider/expo-slider-skeleton';

export function LandingCarousel() {
  const {
    data: carouselItems,
    isLoading,
    error,
  } = usePublicControllerGetCarouselItems();
  const slides = carouselItems || [];

  if (isLoading)
    return (
      <div className="w-full">
        <div className="w-full aspect-[9/16] md:aspect-[16/9]">
          <ExpoSliderSkeleton />
        </div>
      </div>
    );
  if (error || !slides.length) return null;

  return (
    <div className="w-full">
      <div className="w-full aspect-[9/16] md:aspect-[16/9]">
        <ExpoSlider slides={slides} />
      </div>
    </div>
  );
}
