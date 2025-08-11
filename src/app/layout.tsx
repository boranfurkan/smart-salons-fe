import type { Metadata } from 'next';

import LayoutWrapper from '@/components/layout/layout-wrapper';
import ProvidersWrapper from '@/providers';

import { FontInter, FontSpace } from '@/assets/fonts';
import '@/styles/globals.css';

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
        className={`${FontInter.variable} ${FontSpace.variable} antialiased`}
      >
        <ProvidersWrapper>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ProvidersWrapper>
      </body>
    </html>
  );
}
