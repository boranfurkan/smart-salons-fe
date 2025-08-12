'use client';

import { motion } from 'framer-motion';
import {
  AnimatedTextWrapper,
  HighlightedText,
} from '@/components/ui/animated-text';

export function FooterHeader() {
  return (
    <div className="pt-16 pb-8 border-b border-neutral-700">
      <div className="text-center">
        <AnimatedTextWrapper className="text-white mb-4">
          Ready to Transform Your Salon?
        </AnimatedTextWrapper>
        <motion.p
          className="text-lg text-neutral-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join thousands of professionals who trust Smart Salons for their
          equipment needs. Get started today and elevate your salon experience.
        </motion.p>
      </div>
    </div>
  );
}
