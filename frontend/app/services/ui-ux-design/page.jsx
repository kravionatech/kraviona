import ServiceDetailsPage, { generateMetadata as buildServiceMetadata } from "../[category]/page.jsx";

const SERVICE_SLUG = "ui-ux-design";

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
