import { useMemo } from 'react';
import useWindowSize from './useWindowSize';

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const useResponsive = () => {
  const { width } = useWindowSize();

  const currentBreakpoint = useMemo((): BreakpointKey => {
    if (!width) return 'lg'; // Default fallback

    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  }, [width]);

  const isMobile = useMemo(
    () => (width ? width < breakpoints.md : false),
    [width]
  );
  const isTablet = useMemo(
    () => (width ? width >= breakpoints.md && width < breakpoints.lg : false),
    [width]
  );
  const isDesktop = useMemo(
    () => (width ? width >= breakpoints.lg : true),
    [width]
  ); // Default to desktop
  const isLargeScreen = useMemo(
    () => (width ? width >= breakpoints.xl : false),
    [width]
  );

  const isAtLeast = (breakpoint: BreakpointKey) => {
    if (!width) return false;
    return width >= breakpoints[breakpoint];
  };

  const isBelow = (breakpoint: BreakpointKey) => {
    if (!width) return false;
    return width < breakpoints[breakpoint];
  };

  return {
    width,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    isAtLeast,
    isBelow,
    breakpoints,
  };
};

// Export the hook as default as well for convenience
export default useResponsive;
