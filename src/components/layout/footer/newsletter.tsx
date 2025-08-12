'use client';

import { useState } from 'react';
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Send,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const socialLinks = [
  {
    icon: Instagram,
    href: 'https://instagram.com/smartsalons',
    label: 'Instagram',
  },
  {
    icon: Facebook,
    href: 'https://facebook.com/smartsalons',
    label: 'Facebook',
  },
  { icon: Twitter, href: 'https://twitter.com/smartsalons', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/smartsalons', label: 'YouTube' },
];

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
    setEmail('');
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-6">
        Stay Connected
      </h4>

      <div className="space-y-6">
        {/* Newsletter */}
        <div>
          <h5 className="text-lg font-semibold text-white mb-3">Newsletter</h5>
          <p className="text-sm text-neutral-400 mb-4">
            Get the latest updates on new products, exclusive offers, and
            industry insights.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 focus:border-blue-500 pr-12"
                required
                disabled={isSubscribed}
              />
              {isSubscribed && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubscribed}
            >
              {isSubscribed ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Subscribed!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Social Links */}
        <div>
          <h5 className="text-sm font-medium text-white mb-4">Follow Us</h5>
          <div className="grid grid-cols-2 gap-2">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 p-3 rounded-lg transition-colors border border-neutral-700 hover:border-neutral-600"
                >
                  <Icon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                  <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">
                    {social.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
