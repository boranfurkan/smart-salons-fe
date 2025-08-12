'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'All Products', href: '/products' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Sign In', href: '/auth/signin' },
  { name: 'Support', href: '/support' },
];

export function QuickLinks() {
  return (
    <div>
      <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-6">
        Quick Links
      </h4>

      <ul className="space-y-3">
        {quickLinks.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="group flex items-center justify-between text-neutral-300 hover:text-white transition-colors py-1"
            >
              <span>{link.name}</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
        <h5 className="text-sm font-medium text-white mb-2">Need Help?</h5>
        <p className="text-xs text-neutral-400 mb-3">
          Our support team is here to assist you with any questions.
        </p>
        <Link
          href="/support"
          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          Contact Support
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
