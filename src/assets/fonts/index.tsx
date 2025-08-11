import { Inter, Space_Grotesk } from 'next/font/google';

export const FontInter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const FontSpace = Space_Grotesk({
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  subsets: ['latin'],
  display: 'swap',
});
