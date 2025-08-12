import { effectInit } from 'swiper/effect-utils';
import type { Swiper } from 'swiper';

interface ExpoEffectParams {
  imageScale: number;
  imageOffset: number;
  scale: number;
  rotate: number;
  grayscale: boolean;
}

export default function EffectExpo({ swiper, on, extendParams }: any) {
  extendParams({
    expoEffect: {
      imageScale: 1.125,
      imageOffset: 1.25,
      scale: 1.25,
      rotate: 0,
      grayscale: true,
    } as ExpoEffectParams,
  });

  const setTranslate = () => {
    const { slides, rtlTranslate: rtl } = swiper as Swiper & {
      rtlTranslate: boolean;
    };
    const spv = swiper.params.slidesPerView as number;
    const isHorizontal = swiper.isHorizontal();
    let translateOffset = 0.5;
    const params: ExpoEffectParams = swiper.params.expoEffect;
    const imageOffset = Math.max(1.25, params.imageOffset);
    if (spv > 1.5) {
      const minTranslateOffset = (imageOffset - 1) / 2 / imageOffset;
      translateOffset = Math.max(minTranslateOffset, 0.5 - (spv - 1.5));
    }
    const imageScale = Math.max(1.125, params.imageScale);
    const scale = Math.max(1.25, params.scale);
    const rtlMultiplier = rtl ? -1 : 1;

    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i] as HTMLElement;
      const contentWrapEl = slideEl.querySelector(
        '.expo-container'
      ) as HTMLElement | null;
      const contentEl = slideEl.querySelector(
        '.expo-content'
      ) as HTMLElement | null;
      const imageEl = slideEl.querySelector(
        '.expo-image'
      ) as HTMLElement | null;
      const progress = (slideEl as any).progress as number;
      const progressLimited = Math.max(Math.min(progress, 1), -1);

      if (imageEl) {
        imageEl.style.transform = `translate${isHorizontal ? 'X' : 'Y'}(${
          progressLimited * translateOffset * 100 * rtlMultiplier
        }%) scale(${1 + (imageScale - 1) * Math.abs(progressLimited)})`;
        if (params.grayscale) {
          imageEl.style.filter = `grayscale(${Math.abs(progressLimited)})`;
        }
      }
      const sides = isHorizontal
        ? rtl
          ? ['right', 'left']
          : ['left', 'right']
        : ['top', 'bottom'];
      if (Math.abs(progress) > 0.01) {
        if (imageEl) {
          imageEl.style.transformOrigin = progress > 0 ? sides[0] : sides[1];
        }
        if (contentWrapEl) {
          contentWrapEl.style.transformOrigin =
            progress > 0 ? sides[1] : sides[0];
        }
      }
      if (contentWrapEl) {
        contentWrapEl.style.transform = `scale(${
          1 + (scale - 1) * Math.abs(progressLimited)
        }) rotate${isHorizontal ? 'Y' : 'X'}(${
          params.rotate *
          progressLimited *
          (isHorizontal ? 1 : -1) *
          rtlMultiplier
        }deg)`;
      }
      if (contentEl) {
        contentEl.style.transform = `translate${isHorizontal ? 'X' : 'Y'}(${
          progressLimited * 100 * rtlMultiplier
        }%)`;
        contentEl.style.opacity = String(1 - Math.abs(progressLimited) * 2);
      }
    }
  };

  const setTransition = (duration: number) => {
    const { slides } = swiper as Swiper;
    for (let i = 0; i < slides.length; i += 1) {
      const slideEl = slides[i] as HTMLElement;
      [
        ...slideEl.querySelectorAll(
          '.expo-container, .expo-image, .expo-content'
        ),
      ].forEach((el: any) => {
        (el as HTMLElement).style.transitionDuration = `${duration}ms`;
      });
    }
  };
  const setSize = () => {
    const box = (swiper.el as HTMLElement).getBoundingClientRect();
    const size = swiper.isHorizontal() ? box.height : box.width;
    const { rotate, scale, imageOffset } = swiper.params
      .expoEffect as ExpoEffectParams;
    (swiper.el as HTMLElement).style.setProperty(
      '--expo-image-offset',
      String(imageOffset)
    );
    const currentValue = (swiper.el as HTMLElement).style.getPropertyValue(
      '--expo-padding'
    );
    const currentValueNumber = parseInt(currentValue, 10) || 0;

    const activeSlideSize = size / scale;
    let newValue = (size - activeSlideSize) / 2;
    if (rotate) {
      newValue = newValue * 1.35;
    }
    newValue = Math.round(newValue);

    if (currentValue && !Number.isNaN(currentValueNumber)) {
      if (Math.abs(newValue - currentValueNumber) < 5) return;
    }

    (swiper.el as HTMLElement).style.setProperty(
      '--expo-padding',
      `${newValue}px`
    );
  };

  on('init', setSize);
  on('resize', setSize);
  on('update', setSize);

  effectInit({
    effect: 'expo',
    swiper,
    on,
    setTranslate,
    setTransition,
    perspective: () => true,
    overwriteParams: () => ({
      centeredSlides: true,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
    }),
  });
}
