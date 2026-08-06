// Central schema definitions for Kraviona.com
import { CONTACT_FAQS } from "./contactFaqs";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://kraviona.com/#organization",
  name: "Kraviona Tech Solutions",
  url: "https://kraviona.com",
  logo: {
    "@type": "ImageObject",
    url: "https://kraviona.com/full-logo.webp",
    width: 384,
    height: 144,
  },
  image: "https://kraviona.com/opengraph-image",
  description:
    "Kraviona Tech Solutions is a Delhi NCR web development and technical SEO agency building MERN stack products, Next.js websites, and backend APIs for businesses across India.",
  foundingDate: "2022",
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    value: 10,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "East Delhi",
    addressLocality: "Delhi",
    addressRegion: "Delhi",
    postalCode: "110092",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-96085-53167",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "19:00",
      },
    },
  ],
  email: "kravionatech@gmail.com",
  sameAs: [
    "https://www.linkedin.com/company/kravionai",
    "https://www.facebook.com/profile.php?id=61570716181916",
  ],
  knowsAbout: [
    "Web Development",
    "Technical SEO",
    "MERN Stack",
    "Next.js",
    "React.js",
    "UI/UX Design",
  ],
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://kraviona.com/#localbusiness",
  name: "Kraviona Tech Solutions",
  image: "https://kraviona.com/opengraph-image",
  url: "https://kraviona.com",
  telephone: "+91-96085-53167",
  email: "kravionatech@gmail.com",
  priceRange: "₹₹",
  parentOrganization: { "@id": "https://kraviona.com/#organization" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "East Delhi",
    addressLocality: "Delhi",
    addressRegion: "Delhi",
    postalCode: "110092",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.6139,
    longitude: 77.209,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  hasMap: "https://maps.google.com/?q=East+Delhi+110092",
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://kraviona.com/#website",
  url: "https://kraviona.com",
  name: "Kraviona Tech Solutions",
  description: "MERN Stack, Next.js and Technical SEO Company India",
  inLanguage: "en-IN",
  publisher: {
    "@id": "https://kraviona.com/#organization",
  },
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://kraviona.com/about#founder",
  name: "Amar Kumar",
  jobTitle: "Founder & Lead Developer",
  worksFor: {
    "@id": "https://kraviona.com/#organization",
  },
  url: "https://kraviona.com/about",
  sameAs: [
    "https://www.linkedin.com/in/amarkumar96085/",
  ],
};

export const contactFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CONTACT_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export function serviceSchema(params: {
  name: string;
  description: string;
  url: string;
  price?: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${params.url}#service`,
    name: params.name,
    description: params.description,
    url: params.url,
    provider: {
      "@id": "https://kraviona.com/#organization",
    },
    serviceType: params.serviceType || params.name,
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 28.6139,
        longitude: 77.209,
      },
      geoRadius: 100000,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: params.name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      ...(params.price && {
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "INR",
          description: params.price,
        },
      }),
    },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function webPageSchema(params: {
  type?: string;
  url: string;
  name: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": params.type || "WebPage",
    "@id": `${params.url}#webpage`,
    url: params.url,
    name: params.name,
    description: params.description,
    isPartOf: { "@id": "https://kraviona.com/#website" },
    about: { "@id": "https://kraviona.com/#organization" },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://kraviona.com/og-image.jpg",
      width: 1200,
      height: 630,
    },
    ...(params.datePublished && { datePublished: params.datePublished }),
    ...(params.dateModified && { dateModified: params.dateModified }),
  };
}

export function faqSchema(
  items: Array<{ question?: string; answer?: string }> = [],
) {
  const mainEntity = items
    .filter((item) => item.question && item.answer)
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));

  if (!mainEntity.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
