'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import WhatsAppIcon from '@/assets/icons/WhatsappIcon';

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
}

export function WhatsAppButton({
  phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '',
  message = 'Hello! I need help with a product on Smart Salons.',
}: WhatsAppButtonProps) {
  if (!phone) return null;
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed z-50 bottom-24 right-6 sm:bottom-8 sm:right-8"
    >
      <div className="group flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors max-md:aspect-square">
        <WhatsAppIcon className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
      </div>
    </Link>
  );
}
