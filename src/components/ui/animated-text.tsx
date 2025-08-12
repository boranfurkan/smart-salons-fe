'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  highlightedText?: string;
  highlightColor?: string;
  animationDelay?: number;
  duration?: number;
}

export const AnimatedText = ({
  children,
  className,
  highlightedText,
  highlightColor = '#FACC15', // Default yellow color
  animationDelay = 0,
  duration = 1.25,
}: AnimatedTextProps) => {
  // Function to render text with highlighted word
  const renderTextWithHighlight = () => {
    if (!highlightedText) {
      return children;
    }

    const text = children?.toString() || '';
    const parts = text.split(highlightedText);

    if (parts.length === 1) {
      return children;
    }

    return (
      <>
        {parts[0]}
        <span className="relative">
          {highlightedText}
          <svg
            viewBox="0 0 286 73"
            fill="none"
            className="absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{
                duration,
                ease: 'easeInOut',
                delay: animationDelay,
              }}
              d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
              stroke={highlightColor}
              strokeWidth="3"
            />
          </svg>
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <motion.h2
      className={cn('text-3xl md:text-4xl font-bold text-gray-900', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: animationDelay }}
    >
      {renderTextWithHighlight()}
    </motion.h2>
  );
};

// Alternative version for more complex text structures
interface AnimatedTextWithChildrenProps {
  className?: string;
  animationDelay?: number;
  children: React.ReactNode;
}

export const AnimatedTextWrapper = ({
  className,
  animationDelay = 0,
  children,
}: AnimatedTextWithChildrenProps) => {
  return (
    <motion.div
      className={cn('text-3xl md:text-4xl font-bold text-gray-900', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: animationDelay }}
    >
      {children}
    </motion.div>
  );
};

// Highlighted text component for use within AnimatedTextWrapper
interface HighlightedTextProps {
  children: React.ReactNode;
  color?: string;
  animationDelay?: number;
  duration?: number;
}

export const HighlightedText = ({
  children,
  color = '#FACC15',
  animationDelay = 0.3,
  duration = 1.25,
}: HighlightedTextProps) => {
  return (
    <span className="relative">
      {children}
      <svg
        viewBox="0 0 286 73"
        fill="none"
        className="absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1"
      >
        <motion.path
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{
            duration,
            ease: 'easeInOut',
            delay: animationDelay,
          }}
          d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
          stroke={color}
          strokeWidth="3"
        />
      </svg>
    </span>
  );
};
