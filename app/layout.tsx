import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { CookieBanner } from '@/components/CookieBanner';
import { NextAuthProvider } from '@/components/NextAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'FlyClim Storm Viewer | AI-Powered Weather Optimization',
    template: '%s | FlyClim Storm Viewer'
  },
  description: 'FlyClim helps airlines reduce costly weather-related delays with predictive routing intelligence—saving time, fuel, and operational costs.',
  keywords: ['aviation weather', 'flight planning', 'storm tracking', 'airline operations', 'weather optimization', 'flight delay prevention'],
  authors: [{ name: 'FlyClim' }],
  creator: 'FlyClim',
  publisher: 'FlyClim',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.flyclim.com',
    siteName: 'FlyClim Storm Viewer',
    title: 'FlyClim Storm Viewer | AI-Powered Weather Optimization',
    description: 'FlyClim helps airlines reduce costly weather-related delays with predictive routing intelligence—saving time, fuel, and operational costs.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'FlyClim Storm Viewer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlyClim Storm Viewer | AI-Powered Weather Optimization',
    description: 'FlyClim helps airlines reduce costly weather-related delays with predictive routing intelligence—saving time, fuel, and operational costs.',
    images: ['/logo.png'],
    creator: '@flyclim',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: '/logo.png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/logo.png',
        color: '#5bbad5'
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#2d89ef',
    'theme-color': '#ffffff',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://cesium.com/downloads/cesiumjs/releases/1.113/Build/Cesium/Cesium.js"
          strategy="afterInteractive"
        />
        <link
          href="https://cesium.com/downloads/cesiumjs/releases/1.113/Build/Cesium/Widgets/widgets.css"
          rel="stylesheet"
        />
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX');
          `}
        </Script>

        {/* HubSpot */}
        <Script id="hs-script-loader" async defer src="//js.hs-scripts.com/145986844.js" />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-4ZBEPGDW9Z`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4ZBEPGDW9Z');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=G-4ZBEPGDW9Z"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <CookieBanner />
      </body>
    </html>
  );
}