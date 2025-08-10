'use client';
import { usePublicControllerGetCarouselItems } from '@/lib/api/generated/public/public';
import { CarouselSkeleton } from '@/components/shared/skeletons/landing-skeletons';
import { ExpoSlider } from './expo-slider/expo-slider';

export function LandingCarousel() {
  const {
    data: carouselItems,
    isLoading,
    error,
  } = usePublicControllerGetCarouselItems();
  const slides = carouselItems || [];

  if (isLoading) return <CarouselSkeleton />;
  if (error || !slides.length) return null;

  return (
    <div className="w-full">
      {/* Use responsive aspect ratio: 9/16 on small (vertical) and 16/9 on md+ */}
      <div className="w-full aspect-[9/16] md:aspect-[16/9]">
        <ExpoSlider slides={slides} />
      </div>
    </div>
  );
}
