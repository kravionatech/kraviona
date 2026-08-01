import {
  buildMetadata,
  canonicalUrl,
  cleanExcerpt,
  SITE_URL,
} from "@/app/seoConfig.js";
import { SERVICE_PAGES } from "./serviceData.js";

const SERVICE_OG_IMAGE = "/og-web-development.jpg";

function getService(slug) {
  const service = SERVICE_PAGES[slug];

  if (!service) {
    throw new Error(`Unknown static service slug: ${slug}`);
  }

  return service;
}

function conciseDescription(value) {
  const text = cleanExcerpt(value, 160);
  if (text.length < 160) return text;

  const lastWord = text.lastIndexOf(" ");
  return lastWord > 90 ? text.slice(0, lastWord) : text;
}

/**
 * Shared metadata for static service routes. Keeping it here ensures these
 * routes match the dynamic service pages that use the same service catalogue.
 */
export function staticServiceMetadata(slug) {
  const service = getService(slug);
  const description = conciseDescription(
    `Expert ${service.name} services in Delhi NCR from Kraviona. ${service.description}`,
  );

  return buildMetadata({
    title: `${service.name} Services in Delhi NCR`,
    description,
    path: `/services/${slug}`,
    image: SERVICE_OG_IMAGE,
    imageAlt: `${service.name} services by Kraviona Tech Solutions`,
    keywords: [
      `${service.name} services Delhi NCR`,
      `${service.name} company Delhi NCR`,
      service.name,
      service.category,
      "Kraviona Tech Solutions",
    ],
  });
}

/**
 * Normalise the hand-authored Service markup already present on the legacy
 * static pages without discarding useful page-specific fields such as a MERN
 * offer catalogue. It also supplies missing Service/Breadcrumb markup.
 */
export function staticServiceSchemas(
  slug,
  sourceServiceSchema,
  sourceBreadcrumbSchema,
) {
  const service = getService(slug);
  const url = canonicalUrl(`/services/${slug}`);
  const serviceSchema = {
    ...(sourceServiceSchema || {}),
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: sourceServiceSchema?.name || service.name,
    description: sourceServiceSchema?.description || service.description,
    url,
    provider: { "@id": `${SITE_URL}/#organization` },
    serviceType: sourceServiceSchema?.serviceType || service.name,
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 28.6139,
        longitude: 77.209,
      },
      geoRadius: 100000,
    },
    offers: sourceServiceSchema?.offers || {
      "@type": "Offer",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbSchema = sourceBreadcrumbSchema || {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: canonicalUrl("/services"),
      },
      { "@type": "ListItem", position: 3, name: service.name, item: url },
    ],
  };

  return [serviceSchema, breadcrumbSchema];
}
