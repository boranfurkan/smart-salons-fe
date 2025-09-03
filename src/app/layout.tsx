import type { Metadata } from 'next';

import LayoutWrapper from '@/components/layout/layout-wrapper';
import ProvidersWrapper from '@/providers';
import { JsonLd } from '@/components/shared/json-ld';
import { generateOrganizationJsonLd } from '@/lib/utils/seo';

import { FontInter, FontSpace } from '@/assets/fonts';
import '@/styles/globals.css';

const SITE_NAME = 'Smart Salons';
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.salonssmart.uk';

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - Premium Hair Salon Furniture`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Discover premium hair salon furniture and equipment in the UK. Professional styling chairs, shampoo units, reception desks and more.',
  keywords:
    'hair salon furniture, salon equipment, styling chairs, shampoo units, reception desks, UK salon furniture',
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Premium Hair Salon Furniture`,
    description:
      'Discover premium hair salon furniture and equipment in the UK. Professional styling chairs, shampoo units, reception desks and more.',
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Premium Hair Salon Furniture`,
    description:
      'Discover premium hair salon furniture and equipment in the UK. Professional styling chairs, shampoo units, reception desks and more.',
    images: [`${SITE_URL}/twitter-image.jpg`],
    creator: '@smartsalons',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={generateOrganizationJsonLd()} />
      </head>
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
