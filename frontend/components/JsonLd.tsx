// DO NOT add any UI - this server component injects schema markup.

import { normalizeStructuredData } from "@/app/seoConfig.js";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

function schemaId(data: JsonLdProps["data"]) {
  const items = Array.isArray(data) ? data : [data];
  const typeLabel = items
    .map((item) => item["@type"])
    .flat()
    .filter(Boolean)
    .join("-");

  return `json-ld-${typeLabel || "schema"}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");
}

export function JsonLd({ data }: JsonLdProps) {
  const normalizedData = normalizeStructuredData(data);

  return (
    <script
      id={schemaId(normalizedData)}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(normalizedData) }}
    />
  );
}
