'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Users } from 'lucide-react';

export function HomeWrapper() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
      <motion.div
        className="max-w-2xl w-full text-center space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo and Title */}
        <motion.div className="space-y-6" variants={itemVariants}>
          <motion.div
            className="flex justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Smart Salons
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              Premium Hair Salon Furniture & Equipment
            </p>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              Discover professional styling chairs, shampoo units, reception
              desks, and cutting-edge equipment designed to elevate your salon
              experience.
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-center justify-center gap-2 text-gray-600"
            whileHover={{ scale: 1.05 }}
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Premium Quality</span>
          </motion.div>
          <motion.div
            className="flex items-center justify-center gap-2 text-gray-600"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-5 h-5 text-yellow-500" />
            <span>5-Star Reviews</span>
          </motion.div>
          <motion.div
            className="flex items-center justify-center gap-2 text-gray-600"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="w-5 h-5 text-blue-600" />
            <span>Trusted by 1000+ Salons</span>
          </motion.div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="space-y-4 max-w-sm mx-auto"
          variants={itemVariants}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild size="lg" className="w-full gap-2 shadow-lg">
              <Link href="/auth/signup">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer text */}
        <motion.div
          className="text-sm text-gray-500 space-y-2"
          variants={itemVariants}
        >
          <p>
            New to Smart Salons? Create an account to explore our premium
            collection.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs">
            <Link
              href="/terms"
              className="hover:text-gray-700 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="hover:text-gray-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
