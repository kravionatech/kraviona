import ServiceDetailsPage, { generateMetadata as buildServiceMetadata } from "../[category]/page.jsx";

const SERVICE_SLUG = "ai-automation";

export function generateMetadata() {
  return buildServiceMetadata({
    params: Promise.resolve({ category: SERVICE_SLUG }),
  });
}

export default function ServicePage() {
  return (
    <ServiceDetailsPage
      params={Promise.resolve({ category: SERVICE_SLUG })}
    />
  );
}
