'use client';

import { Mail, Phone, MapPin } from 'lucide-react';

export function CompanyInfo() {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Smart Salons
          </span>
        </h3>
        <p className="text-neutral-300 leading-relaxed">
          Your trusted partner for professional hair care equipment. We provide
          high-quality tools and accessories to help salons deliver exceptional
          results.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
          Contact Information
        </h4>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-neutral-300 hover:text-blue-400 transition-colors">
            <div className="bg-neutral-800 p-2 rounded-lg">
              <Mail className="w-4 h-4" />
            </div>
            <span>contact@smartsalons.com</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-neutral-300 hover:text-blue-400 transition-colors">
            <div className="bg-neutral-800 p-2 rounded-lg">
              <Phone className="w-4 h-4" />
            </div>
            <span>+1 (555) 123-4567</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-neutral-300 hover:text-blue-400 transition-colors">
            <div className="bg-neutral-800 p-2 rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
            <span>123 Business St, City, State 12345</span>
          </div>
        </div>
      </div>
    </div>
  );
}
