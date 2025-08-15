'use client';
import React, { useEffect, useRef, useState } from 'react';
import SwiperCore from 'swiper';
import type { Swiper as SwiperType, SwiperOptions } from 'swiper';
import { Autoplay } from 'swiper/modules';
import EffectExpo from './effect-expo';
import { Skeleton } from '@/components/ui/skeleton';
import './expo-slider-base.css';
import './effect-expo.css';
import './expo-slider-skeleton.css';

type ExpoDirection = 'horizontal' | 'vertical';

interface ExpoSliderSkeletonProps {
  className?: string;
  direction?: ExpoDirection; // if omitted, auto from window width
  slides?: number; // number of placeholder slides
}

export function ExpoSliderSkeleton({
  className,
  direction: directionProp,
  slides = 3,
}: ExpoSliderSkeletonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [direction, setDirection] = useState<ExpoDirection>(
    directionProp || 'horizontal'
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const calcDir = (): ExpoDirection => {
      if (directionProp) return directionProp;
      return 'horizontal'; // Always horizontal for better mobile experience
    };

    const initialDir = calcDir();
    setDirection(initialDir);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: SwiperOptions & { [key: string]: any } = {
      direction: initialDir,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      modules: [EffectExpo as any, Autoplay],
      effect: 'expo',
      slidesPerView: 1.2, // Better mobile view
      initialSlide: 1,
      autoplay: false, // no auto move while loading
      expoEffect: {
        imageScale: 1.125,
        imageOffset: 1.25,
        scale: 1.25,
        rotate: 0,
        grayscale: true,
      },
      grabCursor: false,
      spaceBetween: 12, // Smaller gap for mobile
      breakpoints: {
        640: {
          slidesPerView: 1.3,
          spaceBetween: 16,
        },
        768: {
          slidesPerView: 1.5,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 1.5,
          spaceBetween: 32,
        },
      },
      on: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        init: (sw: any) => {
          sw.updateSlides();
          sw.updateProgress();
          sw.updateSlidesClasses();
          requestAnimationFrame(() => {
            sw.update();
            sw.emit('resize');
          });
          setTimeout(() => {
            sw.update();
            sw.emit('resize');
          }, 120);
          setReady(true);
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    swiperRef.current = new (SwiperCore as any)(containerRef.current, options);

    const handleResize = () => {
      if (directionProp) return; // fixed direction externally
      // Since we're always horizontal now, just update the swiper
      if (swiperRef.current) {
        swiperRef.current.update();
        swiperRef.current.updateProgress();
        swiperRef.current.updateSlidesClasses();
      }
      requestAnimationFrame(() => {
        if (!swiperRef.current) return;
        const root = swiperRef.current.el as HTMLElement;
        const active = root.querySelector(
          '.swiper-slide-active .expo-container'
        ) as HTMLElement | null;
        if (active) {
          const rect = active.getBoundingClientRect();
          const rootRect = root.getBoundingClientRect();
          const centerDiff =
            (rootRect.left + rootRect.right) / 2 - (rect.left + rect.right) / 2;
          root.style.setProperty(
            '--expo-image-center-shift',
            `${centerDiff}px`
          );
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      swiperRef.current?.destroy(true, true);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // After mount, ensure center shift is computed at least once
  useEffect(() => {
    if (!swiperRef.current) return;
    requestAnimationFrame(() => {
      const root = swiperRef.current?.el as HTMLElement | undefined;
      if (!root) return;
      const active = root.querySelector(
        '.swiper-slide-active .expo-container'
      ) as HTMLElement | null;
      if (active) {
        const rect = active.getBoundingClientRect();
        const rootRect = root.getBoundingClientRect();
        const centerDiff =
          (rootRect.left + rootRect.right) / 2 - (rect.left + rect.right) / 2;
        root.style.setProperty('--expo-image-center-shift', `${centerDiff}px`);
      }
    });
  }, [ready]);

  return (
    <div className={className} aria-busy aria-live="polite">
      <div className="expo-slider-wrapper">
        <div
          ref={containerRef}
          className={`swiper swiper-expo ${
            direction === 'vertical' ? 'swiper-vertical' : 'swiper-horizontal'
          } ${
            ready ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 expo-show-content`}
        >
          <div className="swiper-wrapper">
            {Array.from({ length: Math.max(3, slides) }).map((_, i) => (
              <div key={i} className="swiper-slide">
                <div className="expo-container">
                  <div className="expo-image">
                    <Skeleton className="w-full h-full" />
                  </div>
                  <div className="expo-content text-white">
                    <div className="expo-content-inner">
                      <Skeleton className="h-8 w-3/5 max-w-[520px]" />
                      <div className="space-y-2 max-w-[52ch]">
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-9/12" />
                      </div>
                      <div className="expo-content-cta-wrap">
                        <Skeleton className="h-9 w-28 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpoSliderSkeleton;
