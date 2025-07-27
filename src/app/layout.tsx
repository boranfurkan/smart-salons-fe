import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { AuthProvider } from '@/context/auth-context';
import LayoutWrapper from '@/components/layout/layout-wrapper';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Smart Salons - Premium Hair Salon Furniture',
  description:
    'Discover premium hair salon furniture and equipment in the UK. Professional styling chairs, shampoo units, reception desks and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfairDisplay.variable} antialiased`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
