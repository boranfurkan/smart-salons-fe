'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModernAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  backgroundImage: string;
  imageAlt: string;
}

export function ModernAuthLayout({
  children,
  title,
  subtitle,
  footer,
  className,
  backgroundImage,
  imageAlt,
}: ModernAuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={backgroundImage}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />

        {/* Logo overlay on image */}
        <motion.div
          className="absolute top-8 left-8 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <Image
              src="/logo-white.svg"
              alt="Smart Salons Logo"
              width={120}
              height={40}
              className="h-4 w-auto"
            />
          </Link>
        </motion.div>

        {/* Quote/Feature text on image */}
        <motion.div
          className="absolute bottom-8 left-8 right-8 z-10 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <blockquote className="text-xl font-semibold mb-4">
            &ldquo;Transform your salon with premium furniture and equipment
            from Smart Salons&rdquo;
          </blockquote>
          <p className="text-white/80">
            Join thousands of salon owners who trust us for their business
            needs.
          </p>
        </motion.div>
      </motion.div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Mobile logo - only shown on small screens */}
        <motion.div
          className="lg:hidden p-6 border-b border-gray-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <Image
              src="/logo-2.svg"
              alt="Smart Salons Logo"
              width={120}
              height={40}
              className="h-4 w-auto"
            />
          </Link>
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Header */}
            <motion.div
              className="text-center lg:text-left mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
            </motion.div>

            {/* Form content */}
            <motion.div
              className={cn('space-y-6', className)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {children}
            </motion.div>

            {/* Footer */}
            {footer && (
              <motion.div
                className="mt-8 pt-6 border-t border-gray-200 text-center lg:text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                {footer}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Bottom text */}
        <motion.div
          className="p-6 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-center text-sm text-gray-500">
            © 2025 Smart Salons. All rights reserved. By continuing, you agree
            to our{' '}
            <Link
              href="/terms"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
