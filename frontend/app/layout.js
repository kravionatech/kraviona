import "./globals.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

import { Suspense } from "react";
import Script from "next/script";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import GAPageTracker from "@/components/GAPageTracker";
import { JsonLd } from "@/components/JsonLd";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/schema";

import {
  SITE_URL,
  SITE_NAME,
  SITE_TWITTER,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  defaultRobots,
} from "./seoConfig.js";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f5960" },
    { media: "(prefers-color-scheme: dark)", color: "#0a454b" },
  ],
};

/* SEO Metadata */
export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Kraviona Tech Solutions — Web Dev & SEO Agency Delhi NCR",
    template: "%s | Kraviona Tech Solutions",
  },

  description:
    "Kraviona is a Delhi NCR agency for Next.js, MERN stack web development, backend APIs, and technical SEO services built for speed and search visibility.",

  keywords: [
    "web development Delhi NCR",
    "Next.js development India",
    "technical SEO agency",
    "MERN stack developer",
    "React.js company Delhi",
    "SEO services Noida",
    "Kraviona",
  ],

  authors: [
    {
      name: "Kraviona Tech Solutions",
      url: SITE_URL,
    },
  ],

  creator: SITE_NAME,

  publisher: SITE_NAME,

  robots: defaultRobots,

  openGraph: {
    type: "website",

    locale: "en_IN",

    url: SITE_URL,

    title: "Kraviona Tech Solutions | Web Dev & SEO Agency Delhi NCR",

    description:
      "Top MERN Stack, Next.js and Technical SEO agency in Delhi NCR. Building fast, scalable websites that rank on Google.",

    siteName: SITE_NAME,

    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    site: SITE_TWITTER,

    creator: SITE_TWITTER,

    title: "Kraviona Tech Solutions | Web Dev & SEO Delhi NCR",

    description:
      "Expert Next.js development and Technical SEO for growth-focused businesses in Delhi NCR.",

    images: [DEFAULT_OG_IMAGE],
  },

  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-IN": SITE_URL,
    },
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
      "text/plain": `${SITE_URL}/llms.txt`,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",

  verification: {
    google: "yYmrp2HizDB-EGRruieHxpCxHFLCqmFsQblkGULJHtc",
  },

  other: {
    "google-adsense-account": "ca-pub-2639855770462648",
  },

  category: "technology",
  classification: "Web Development & SEO Services",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://api.kraviona.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://api.kraviona.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://pagead2.googlesyndication.com"
        />
        <Script
          id="google-adsense"
          async
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2639855770462648"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WKDGR26N2Q"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WKDGR26N2Q', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </Script>
      </head>

      <body className="font-sans antialiased bg-surface">
        <Suspense fallback={null}>
          <GAPageTracker />
        </Suspense>
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-primary px-4 py-3 font-bold text-white focus:not-sr-only focus:outline-none focus:ring-4 focus:ring-accent/40"
        >
          Skip to main content
        </a>
        <JsonLd
          data={[organizationSchema, localBusinessSchema, websiteSchema]}
        />

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5LX2JWGD"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        <Header />

        <main id="main-content">{children}</main>

        <Footer />

        <WhatsAppFloat />
        <ThirdPartyScripts />

      </body>
    </html>
  );
}
