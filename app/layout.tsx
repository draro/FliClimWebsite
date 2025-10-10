import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { CookieBanner } from "@/components/CookieBanner";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { OrganizationJsonLd, ProductJsonLd, FAQJsonLd } from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "FlyClim | Electronic AIP (eAIP) System & Flight Optimization Solutions",
    template: "%s | FlyClim",
  },
  alternates: {
    canonical: `https://www.flyclim.com`,
  },
  description:
    "Leading eAIP (Electronic Aeronautical Information Publication) system for Civil Aviation Authorities. ICAO Annex 15 compliant digital AIP management platform with automated NOTAM integration, AIRAC cycle management, and AI-powered flight weather optimization.",
  keywords: [
    "eAIP system",
    "electronic AIP",
    "digital AIP",
    "aeronautical information publication",
    "ICAO Annex 15",
    "EUROCONTROL Specification 3.0",
    "civil aviation authority",
    "AIP management",
    "NOTAM integration",
    "AIRAC cycle",
    "aviation information management",
    "AIS automation",
    "aeronautical data quality",
    "aviation weather optimization",
    "flight planning",
    "storm tracking",
    "airline operations",
    "flight delay prevention",
  ],
  authors: [{ name: "FlyClim" }],
  creator: "FlyClim",
  publisher: "FlyClim",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: new URL("https://www.flyclim.com"),
    siteName: "FlyClim",
    title: "FlyClim | Electronic AIP (eAIP) System & Flight Optimization",
    description:
      "ICAO-compliant eAIP system for Civil Aviation Authorities with automated NOTAM integration, AIRAC management, and AI-powered flight weather optimization. Enterprise-grade digital AIP platform.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "FlyClim - Electronic AIP System and Flight Optimization Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlyClim | Electronic AIP (eAIP) System & Flight Optimization",
    description:
      "ICAO-compliant eAIP system for Civil Aviation Authorities with automated NOTAM integration, AIRAC management, and AI-powered flight weather optimization.",
    images: ["/logo.png"],
    creator: "@flyclim",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/logo.png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/logo.png",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#2d89ef",
    "theme-color": "#ffffff",
    "apple-itunes-app": "app-id=6746156044",
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
        {/* Google Tag Manager */}

        {/* <Script type="text/javascript" id="dataLayer" strategy="afterInteractive">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }

        gtag("consent", "default", {
            ad_user_data: "granted",
            ad_personalization: "granted",
            ad_storage: "granted",
            analytics_storage: "granted",
            analytics_storage: "granted",
            functionality_storage: "granted",
            security_storage: "granted",
            personalization_storage: "granted",
            wait_for_update: 2000 // milliseconds to wait for update
        });

        // Enable ads data redaction by default [optional]
        gtag("set", "ads_data_redaction", true); 
        `}
        </Script>

        <Script type="text/javascript" id="google-tag-manager" strategy="afterInteractive">
          {`
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'G-4ZBEPGDW9Z'); //replace GTM-XXXXXX with Google Tag Manager ID
        `}
        </Script> */}

        {/* <Script src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"></Script>
    <Script id="usercentrics-cmp" src="https://web.cmp.usercentrics.eu/ui/loader.js" data-settings-id="0Vn0tKC72pIfR-" async></Script> */}
        {/* HubSpot */}
        {/* <Script
          id="hs-script-loader"
          async
          defer
          src="//js.hs-scripts.com/145986844.js"
        /> */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KRPH2498');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4ZBEPGDW9Z"
          strategy="afterInteractive"
        />

        <Script id="ga-consent" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}

    // Consent Mode v2: Set defaults (denied before user consents)
    gtag('consent', 'default', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      functionality_storage: 'granted',
      security_storage: 'granted',
      personalization_storage: 'granted',
      wait_for_update: 2000
    });

    gtag('set', 'ads_data_redaction', true);

    gtag('js', new Date());
    gtag('config', 'G-4ZBEPGDW9Z');
  `}
        </Script>

        <Script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id="0Vn0tKC72pIfR-"
          async
        ></Script>

        {/* Google Analytics */}
        {/* <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-4ZBEPGDW9Z`}
          strategy="afterInteractive"
        /> */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4ZBEPGDW9Z');
          `}
        </Script>
        <script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id="0Vn0tKC72pIfR-"
          async
        ></script>
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=G-4ZBEPGDW9Z"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <NextAuthProvider>
          <OrganizationJsonLd />
          <ProductJsonLd />
          <FAQJsonLd />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
