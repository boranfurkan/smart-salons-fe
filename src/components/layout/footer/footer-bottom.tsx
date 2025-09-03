'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart,
  Shield,
  Award,
  Truck,
  CreditCard,
  Wallet,
  Banknote,
} from 'lucide-react';

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Shipping Info', href: '/shipping' },
  { name: 'Returns', href: '/returns' },
];

const features = [
  { icon: Shield, text: 'Secure Payments' },
  { icon: Award, text: 'Quality Guaranteed' },
  { icon: Truck, text: 'Fast Shipping' },
];

export function FooterBottom() {
  return (
    <div className="border-t border-neutral-700 py-8">
      {/* Payment Providers */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-wrap items-center justify-center gap-4 text-neutral-300">
          <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
            <CreditCard className="w-4 h-4 text-blue-300" />
            <span className="text-xs">Mastercard</span>
          </div>
          <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
            <Wallet className="w-4 h-4 text-sky-300" />
            <span className="text-xs">PayPal</span>
          </div>
          <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
            <CreditCard className="w-4 h-4 text-purple-300" />
            <span className="text-xs">American Express</span>
          </div>
          <div className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2">
            <Banknote className="w-4 h-4 text-green-300" />
            <span className="text-xs">Apple Pay</span>
          </div>
        </div>
      </motion.div>
      {/* Features Row */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center justify-center gap-3 p-4 bg-neutral-800 rounded-lg border border-neutral-700"
              >
                <Icon className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-neutral-300">
                  {feature.text}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Copyright and Links */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <motion.div
          className="flex items-center gap-2 text-sm text-neutral-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span>© 2025 Smart Salons. Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span>for salon professionals worldwide.</span>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-6 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {legalLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="text-neutral-400 hover:text-blue-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
