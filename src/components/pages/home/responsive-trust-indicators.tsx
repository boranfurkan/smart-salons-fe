'use client';

import React, { useEffect, useRef } from 'react';
import { animate, useInView, motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';
import {
  HorizontalCarousel,
  CarouselItem,
} from '@/components/ui/horizontal-carousel';

const trustStats = [
  {
    num: 4.9,
    suffix: '/5',
    decimals: 1,
    subheading: 'Customer satisfaction rating from verified salon owners',
  },
  {
    num: 15.2,
    suffix: 'K+',
    decimals: 1,
    subheading: 'Professional salons trust our equipment worldwide',
  },
  {
    num: 50,
    suffix: ' States',
    decimals: 0,
    subheading: 'Nationwide delivery with fast shipping options',
  },
  {
    num: 10,
    suffix: '+ Years',
    decimals: 0,
    subheading: 'Industry experience providing quality equipment',
  },
];

const certifications = [
  'Professional Salon Association',
  'Quality Equipment Certified',
  'Secure Payments Protected',
  'Industry Leader Since 2014',
];

interface StatProps {
  num: number;
  suffix: string;
  decimals?: number;
  subheading: string;
  isMobile?: boolean;
}

const Stat = ({
  num,
  suffix,
  decimals = 0,
  subheading,
  isMobile,
}: StatProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, num, {
      duration: 2,
      ease: 'easeOut',
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent = value.toFixed(decimals);
        }
      },
    });

    return () => controls.stop();
  }, [num, decimals, isInView]);

  return (
    <div className={`text-center ${isMobile ? 'min-w-[200px] px-4' : ''}`}>
      <div
        className={`font-bold text-blue-600 ${
          isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'
        }`}
      >
        <span ref={ref}>0</span>
        {suffix}
      </div>
      <div
        className={`text-gray-600 ${
          isMobile ? 'text-xs mt-1' : 'text-sm mt-2'
        }`}
      >
        {subheading}
      </div>
    </div>
  );
};

export function ResponsiveTrustIndicators() {
  const { isMobile, isTablet } = useResponsive();

  if (isMobile) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Trust Stats - Mobile Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-center text-lg font-semibold text-gray-900 mb-4">
              Trusted by Professionals
            </h3>
            <HorizontalCarousel
              showButtons={false}
              options={{
                align: 'center',
                containScroll: 'trimSnaps',
                dragFree: true,
              }}
            >
              {trustStats.map((stat, index) => (
                <CarouselItem key={index}>
                  <Stat {...stat} isMobile />
                </CarouselItem>
              ))}
            </HorizontalCarousel>
          </motion.div>

          {/* Certifications - Mobile Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-3">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 text-center"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  if (isTablet) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Trusted by Professionals Worldwide
            </h3>
            <div className="grid grid-cols-2 gap-8">
              {trustStats.map((stat, index) => (
                <Stat key={index} {...stat} />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {cert}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  // Desktop layout (original)
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-8">
            Trusted by Professionals Worldwide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustStats.map((stat, index) => (
              <Stat key={index} {...stat} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center items-center gap-6"
        >
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100 flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="font-medium text-gray-700">{cert}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
