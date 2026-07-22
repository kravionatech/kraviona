// Central schema definitions for Kraviona.com

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://kraviona.com/#organization",
  name: "Kraviona Tech Solutions",
  url: "https://kraviona.com",
  logo: {
    "@type": "ImageObject",
    url: "https://kraviona.com/logo.png",
    width: 200,
    height: 60,
  },
  description:
    "Kraviona Tech Solutions builds MERN stack products, Next.js websites, backend APIs, and technical SEO systems for businesses across India.",
  foundingDate: "2019",
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
    "https://twitter.com/KravionaTech",
    "https://www.facebook.com/profile.php?id=61570716181916",
  ],
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://kraviona.com/#localbusiness",
  name: "Kraviona Tech Solutions",
  image: "https://kraviona.com/og-image.jpg",
  url: "https://kraviona.com",
  telephone: "+91-96085-53167",
  email: "kravionatech@gmail.com",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    streetAddress: "East Delhi",
    addressLocality: "Delhi",
    addressRegion: "DL",
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
  description: "MERN Stack, Next.js and Technical SEO Agency India",
  publisher: {
    "@id": "https://kraviona.com/#organization",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://kraviona.com/blog?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
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
    "https://twitter.com/KravionaTech",
  ],
};

export const contactFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does a MERN Stack project take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A typical MERN Stack web application takes 4-12 weeks depending on complexity. MVPs can be delivered in 3-4 weeks. Enterprise platforms with custom APIs may take 3+ months.",
      },
    },
    {
      "@type": "Question",
      name: "Do you sign NDAs for client projects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Kraviona signs Non-Disclosure Agreements (NDAs) for all client projects. We treat your business information with complete confidentiality. Contact us to request our standard NDA.",
      },
    },
    {
      "@type": "Question",
      name: "What is your development process?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We follow an Agile development process with weekly sprints, transparent communication via Slack or WhatsApp, and regular demo sessions. Every project includes a discovery phase, design approval, development, testing, and post-launch support.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer post-launch support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all projects include 30 days of free post-launch support. We also offer monthly retainer plans for ongoing maintenance, updates, and monitoring.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get a free consultation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer a free 30-minute consultation call where we discuss your project requirements, timeline, and budget. Book via our contact page or WhatsApp at +91 96085 53167.",
      },
    },
  ],
};

export function serviceSchema(params: {
  name: string;
  description: string;
  url: string;
  price?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    url: params.url,
    provider: {
      "@id": "https://kraviona.com/#organization",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: params.name,
    },
    ...(params.price && {
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "INR",
          description: params.price,
        },
      },
    }),
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
