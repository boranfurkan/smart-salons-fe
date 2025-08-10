'use client';
import React, { useEffect, useRef, useState } from 'react';
import SwiperCore from 'swiper';
import type { Swiper as SwiperType, SwiperOptions } from 'swiper';
import EffectExpo from './effect-expo';
// global Swiper CSS imported in globals.css
import './expo-slider-base.css';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

// Augment Swiper types for expoEffect (local effect)
declare module 'swiper' {
  interface SwiperOptions {
    expoEffect?: {
      imageScale?: number;
      imageOffset?: number;
      scale?: number;
      rotate?: number;
      grayscale?: boolean;
    };
  }
}

interface ExpoSlide {
  id: string | number;
  imageUrl: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface ExpoSliderProps {
  slides: ExpoSlide[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export const ExpoSlider: React.FC<ExpoSliderProps> = ({
  slides,
  direction: directionProp,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>(
    directionProp || 'horizontal'
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const calcDir = (): 'horizontal' | 'vertical' => {
      if (directionProp) return directionProp;
      return window.innerWidth < 768 ? 'vertical' : 'horizontal';
    };

    const initialDir = calcDir();
    setDirection(initialDir);

    const options: SwiperOptions & { [key: string]: any } = {
      direction: initialDir,
      modules: [EffectExpo as any],
      effect: 'expo',
      slidesPerView: 1.5,
      expoEffect: {
        imageScale: 1.125,
        imageOffset: 1.25,
        scale: 1.25,
        rotate: 0,
        grayscale: true,
      },
      grabCursor: true,
      spaceBetween: 16,
      breakpoints: {
        768: {
          spaceBetween: 32,
        },
      },
      on: {
        init: (sw: any) => {
          sw.updateSlides();
          sw.updateProgress();
          sw.updateSlidesClasses();
          // force re-measure after first paint to ensure correct --expo-padding
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
    } as any; // custom effect not in official types

    swiperRef.current = new (SwiperCore as any)(containerRef.current, options);

    const handleResize = () => {
      if (directionProp) return; // fixed direction externally
      const newDir = calcDir();
      if (
        swiperRef.current &&
        swiperRef.current.params &&
        swiperRef.current.params.direction !== newDir
      ) {
        setDirection(newDir);
        swiperRef.current.changeDirection(newDir, false);
        swiperRef.current.update();
        swiperRef.current.slideTo(swiperRef.current.activeIndex || 0, 0);
      } else if (swiperRef.current) {
        swiperRef.current.update();
        swiperRef.current.updateProgress();
        swiperRef.current.updateSlidesClasses();
      }
      // After updates, adjust center shift
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

  // Update swiper when slides change length (e.g., after data fetch)
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.update();
      swiperRef.current.updateProgress();
      swiperRef.current.updateSlidesClasses();
      swiperRef.current.slideTo(swiperRef.current.activeIndex || 0, 0);
      swiperRef.current.emit('resize');
      // compute shift after layout
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
          root.style.setProperty(
            '--expo-image-center-shift',
            `${centerDiff}px`
          );
        }
      });
    }
  }, [slides.length]);

  return (
    <div className={className}>
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
            {slides.map((slide) => (
              <div key={slide.id} className="swiper-slide">
                <div className="expo-container">
                  <img
                    src={slide.imageUrl}
                    className="expo-image object-fill"
                    alt={slide.title || 'slide'}
                  />
                  {(slide.title ||
                    slide.description ||
                    (slide.buttonText && slide.buttonLink)) && (
                    <div className="expo-content text-white">
                      <div className="expo-content-inner">
                        {slide.title && (
                          <h2 className="expo-content-title">{slide.title}</h2>
                        )}
                        {slide.description && (
                          <p className="expo-content-desc">
                            {slide.description}
                          </p>
                        )}
                        {slide.buttonText && slide.buttonLink && (
                          <div className="expo-content-cta-wrap">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-black"
                            >
                              <Link
                                href={slide.buttonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                              >
                                {slide.buttonText}
                                <ExternalLink className="ml-2 w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
