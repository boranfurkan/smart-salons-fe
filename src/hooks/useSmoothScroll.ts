'use client';

import { useEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

export const useSmoothScroll = (enabled: boolean = true) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  const raf = useCallback((time: number) => {
    if (lenisRef.current) {
      lenisRef.current.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      duration: 1.0, // Slightly faster for better responsiveness
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Start animation loop
    rafRef.current = requestAnimationFrame(raf);

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled, raf]);

  return lenisRef.current;
};
