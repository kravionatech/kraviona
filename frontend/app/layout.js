import "./globals.css";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import LeadGenerationPopup from "@/components/Lead/LeadGenerationPopup";
import { JsonLd } from "@/components/JsonLd";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import {
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/schema";

import { Poppins } from "next/font/google";



import {
  SITE_URL,
  SITE_NAME,
  SITE_TWITTER,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  defaultRobots,
} from "./seoConfig.js";

/* Fonts */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

/* SEO Metadata */
export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "MERN Stack, Next.js & Technical SEO Agency | Kraviona",
    template: `%s | Kraviona`,
  },

  description:
    "Kraviona builds MERN stack products, Next.js websites, backend APIs, and technical SEO systems for businesses that need speed, clarity, and search visibility.",

  keywords: [
    "Kraviona",
    "MERN Stack Development",
    "Technical SEO",
    "React.js Development",
    "Node.js Backend",
    "Next.js Development",
  ],

  authors: [
    {
      name: "Kraviona Tech",
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

    title: "MERN Stack, Next.js & Technical SEO Agency | Kraviona",

    description:
      "Kraviona builds MERN stack products, Next.js websites, backend APIs, and technical SEO systems for businesses that need speed and search visibility.",

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

    title: "MERN Stack, Next.js & Technical SEO Agency | Kraviona",

    description:
      "MERN stack products, Next.js websites, backend APIs, and technical SEO systems for cleaner digital growth.",

    images: [DEFAULT_OG_IMAGE],
  },

  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
      "text/plain": `${SITE_URL}/llms.txt`,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },

  manifest: "/site.webmanifest",

  verification: {
    google: "yYmrp2HizDB-EGRruieHxpCxHFLCqmFsQblkGULJHtc",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="google-site-verification" content="yYmrp2HizDB-EGRruieHxpCxHFLCqmFsQblkGULJHtc" />
        <meta name="google-adsense-account" content="ca-pub-9100707044750397"></meta>
      </head>

      <body className={`${poppins.variable} font-sans antialiased bg-gray-100`}>
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

        <main>{children}</main>

        <Footer />

        <LeadGenerationPopup />
        <WhatsAppFloat />
        <ThirdPartyScripts />

      </body>
    </html>
  );
}
