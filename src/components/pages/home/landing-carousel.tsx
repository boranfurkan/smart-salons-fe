'use client';
import { usePublicControllerGetCarouselItems } from '@/lib/api/generated/public/public';

import { ExpoSlider } from '../../shared/expo-slider/expo-slider';
import { ExpoSliderSkeleton } from '../../shared/expo-slider/expo-slider-skeleton';

export function LandingCarousel() {
  const {
    data: carouselItems,
    isLoading,
    error,
  } = usePublicControllerGetCarouselItems();
  const slides = carouselItems || [];

  if (isLoading)
    return (
      <div className="w-full  max-md:mt-20">
        <ExpoSliderSkeleton />
      </div>
    );
  if (error || !slides.length) return null;

  return (
    <div className="w-full max-md:mt-20">
      <ExpoSlider slides={slides} />
    </div>
  );
}
