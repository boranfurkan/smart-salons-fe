'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { usePublicControllerGetCarouselItems } from '@/lib/api/generated/public/public';
import { CarouselSkeleton } from '@/components/shared/skeletons/landing-skeletons';

export function LandingCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    data: carouselItems,
    isLoading,
    error,
  } = usePublicControllerGetCarouselItems();

  const slides = carouselItems || [];

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  if (isLoading) {
    return <CarouselSkeleton />;
  }

  if (error || !slides.length) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">Smart Salons</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Professional Hair Care Equipment
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7 }}
              >
                {/* Background Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.description || slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white space-y-6 max-w-4xl px-4">
                    <motion.h1
                      className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      {slide.title}
                    </motion.h1>

                    {slide.description && (
                      <motion.p
                        className="text-lg md:text-xl lg:text-2xl opacity-90 max-w-2xl mx-auto"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                      >
                        {slide.description}
                      </motion.p>
                    )}

                    {slide.buttonText && slide.buttonLink && (
                      <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                      >
                        <Button
                          size="lg"
                          className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                          asChild
                        >
                          <Link href={slide.buttonLink}>
                            {slide.buttonText}
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
            onClick={goToPrevSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 w-12 h-12"
            onClick={goToNextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1,
          duration: 0.6,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm opacity-70">Scroll to explore</span>
          <div className="w-px h-8 bg-white/50" />
        </div>
      </motion.div>
    </div>
  );
}
