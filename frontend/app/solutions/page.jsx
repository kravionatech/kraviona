import Solutions from "@/components/Solutions/Solutions";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/app/seoConfig";

const solutionsPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://kraviona.com/solutions#webpage",
  url: "https://kraviona.com/solutions",
  name: "Industry Technology Solutions | Kraviona",
  description:
    "Explore Kraviona's custom software, automation, and digital transformation solutions for finance, e-commerce, healthcare, real estate, education, and logistics.",
  isPartOf: { "@id": "https://kraviona.com/#website" },
  about: [
    "Custom software development",
    "Business process automation",
    "Digital transformation",
  ],
};

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "Industry Technology Solutions & Digital Transformation",
  description:
    "Kraviona builds tailored software, automation, and digital transformation solutions for finance, e-commerce, healthcare, real estate, education, and logistics businesses.",
  path: "/solutions",
  image: "/og-solutions.jpg",
  imageAlt: "Kraviona industry technology solutions",
  keywords: [
    "Industry Technology Solutions",
    "Custom Software Solutions India",
    "Digital Transformation Services",
    "Business Process Automation",
    "FinTech Software Development",
    "E-commerce Development",
    "Healthcare Software Development",
    "EdTech Development Company",
  ],
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd
        data={[
          solutionsPageSchema,
          breadcrumbSchema([
            { name: "Home", url: "https://kraviona.com" },
            { name: "Solutions", url: "https://kraviona.com/solutions" },
          ]),
        ]}
      />
      <Solutions />
    </>
  );
}
