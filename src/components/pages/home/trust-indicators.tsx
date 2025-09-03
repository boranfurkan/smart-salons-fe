'use client';

import React, { useEffect, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

const trustStats = [
  {
    num: 4.7,
    suffix: '/5',
    decimals: 1,
    subheading: 'Average rating from verified salon customers',
  },
  {
    num: 2500,
    suffix: '+',
    decimals: 0,
    subheading: 'Salons and professionals served in the past 24 months',
  },
  {
    num: 48,
    suffix: 'h',
    decimals: 0,
    subheading: 'Typical dispatch time for in‑stock items',
  },
  {
    num: 7,
    suffix: '+ Years',
    decimals: 0,
    subheading: 'Experience supplying professional salon equipment',
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
    <section className="py-10 sm:py-14 bg-green-50 border-y border-green-100 mt-8 md:mt-14">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 sm:mb-10 text-center text-sm sm:text-base text-gray-700 font-medium tracking-wide uppercase">
          Trusted by Professionals
        </h2>

        {/* Stats Grid - compact 2-col on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {trustStats.map((stat, index) => (
            <div key={index} className="relative flex justify-center">
              <Stat
                num={stat.num}
                suffix={stat.suffix}
                decimals={stat.decimals}
                subheading={stat.subheading}
              />
            </div>
          ))}
        </div>

        {/* Certifications - compact badges */}
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {certifications.map((cert) => (
            <span
              key={cert}
              className="text-[11px] sm:text-xs text-gray-700 bg-white border border-green-200 rounded-full px-3 py-1"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
