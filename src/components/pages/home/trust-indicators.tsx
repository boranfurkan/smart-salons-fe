'use client';

import React, { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

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
}

const Stat = ({ num, suffix, decimals = 0, subheading }: StatProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    animate(0, num, {
      duration: 2.5,
      onUpdate(value) {
        if (!ref.current) return;

        ref.current.textContent = value.toFixed(decimals);
      },
    });
  }, [num, decimals, isInView]);

  return (
    <div className="flex flex-col items-center text-center py-8">
      <p className="mb-4 text-5xl sm:text-6xl lg:text-7xl font-bold text-green-600 leading-none">
        <span ref={ref}></span>
        {suffix}
      </p>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-48">
        {subheading}
      </p>
    </div>
  );
};

export function TrustIndicators() {
  return (
    <section className="py-16 bg-green-50 border-y border-green-100 mt-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 text-center text-base text-gray-700 sm:text-lg md:mb-16 font-medium tracking-wide uppercase">
            TRUSTED BY SALON PROFESSIONALS WITH
            <span className="text-green-600 font-bold"> PROVEN RESULTS</span>
          </h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {trustStats.map((stat, index) => (
              <div key={index} className="relative flex justify-center">
                <Stat
                  num={stat.num}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  subheading={stat.subheading}
                />
                {/* Divider for desktop */}
                {index < trustStats.length - 1 && (
                  <div className="hidden xl:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-px h-24 bg-green-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Row */}
        <div className="border-t border-green-200 pt-8">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-sm text-gray-600">
            {certifications.map((cert) => (
              <div key={cert} className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0" />
                <span className="whitespace-nowrap">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
