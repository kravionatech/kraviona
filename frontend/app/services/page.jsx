import ServicesBanner from "@/components/Services/ServicesBanner";
import FeaturedServices from "@/components/Home/FeaturedServices";
import WhyChooseUs from "@/components/Services/WhyChooseUs";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import Link from "next/link";
import { SERVICE_LINKS } from "./serviceData.js";
import { defaultRobots } from "@/app/seoConfig.js";

// Service sub-pages for internal linking
const servicePages = SERVICE_LINKS;

// JSON-LD: Service Page Schema
const servicesPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://kraviona.com/services#webpage",
  url: "https://kraviona.com/services",
  name: "MERN Stack Development & Technical SEO Services | Kraviona",
  description:
    "Explore Kraviona's full suite of web development, technical SEO, AI automation, digital marketing, e-commerce, marketplace seller, and brand services.",
  isPartOf: { "@id": "https://kraviona.com/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kraviona.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://kraviona.com/services",
      },
    ],
  },
};

export const metadata = {
  title: "Web Development & Technical SEO Services | Kraviona",
  description:
    "Explore Kraviona services for MERN stack development, Next.js websites, technical SEO, AI automation, UI/UX design, performance, APIs, and SaaS.",
  keywords: [
    "Web Development Services India",
    "MERN Stack Development Company",
    "Technical SEO Services India",
    "React.js Development Services",
    "Node.js Backend Development",
    "UI UX Design Services India",
    "Custom Software Development",
    "Digital Marketing Agency India",
    "Web App Development Company",
    "IT Solutions Agency Delhi",
    "Full Stack Development Services",
    "SEO Agency India",
    "Kraviona Services",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: {
    canonical: "https://kraviona.com/services",
  },
  openGraph: {
    title: "MERN Stack Development & Technical SEO Services | Kraviona",
    description:
      "Explore Kraviona's web development, AI automation, digital marketing, marketplace seller, and technical SEO services.",
    url: "https://kraviona.com/services",
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona Tech Solutions – IT Services",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "MERN Stack Development & Technical SEO Services | Kraviona",
    description:
      "Custom MERN stack apps, technical SEO, AI automation, marketing, and seller services. Built to scale.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const MainServices = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesPageSchema) }}
      />
      <ServicesBanner />

      {/* Service Sub-Pages Navigation */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">
            Explore Specific Services:
          </p>
          <div className="flex flex-wrap gap-3">
            {servicePages.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-4 py-2 text-sm font-semibold text-[#295c5e] border border-[#295c5e]/30 rounded-full hover:bg-[#295c5e] hover:text-white transition-all duration-200"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FeaturedServices />
      <WhyChooseUs />
      <ContactFormDetails />
    </>
  );
};

export default MainServices;
