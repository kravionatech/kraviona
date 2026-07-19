import ContactBanner from "@/components/Contact/ContactBanner";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import ContactMap from "@/components/Contact/ContactMap";
import BlogCTA from "@/components/Blog/BlogCTA";
import ContactFAQ from "@/components/Contact/ContactFAQ";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, contactFaqSchema } from "@/lib/schema";
import { defaultRobots } from "@/app/seoConfig.js";

// JSON-LD: ContactPage + LocalBusiness
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://kraviona.com/contact#webpage",
  url: "https://kraviona.com/contact",
  name: "Contact Kraviona – Let's Build Something Great",
  description:
    "Get in touch with Kraviona for high-performance web development, custom IT solutions, and digital scaling.",
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
        name: "Contact",
        item: "https://kraviona.com/contact",
      },
    ],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "@id": "https://kraviona.com/#organization",
  name: "Kraviona Tech Solutions",
  url: "https://kraviona.com",
  logo: "https://kraviona.com/logo.png",
  image: "https://kraviona.com/og-image.jpg",
  description:
    "High-performance MERN stack development, technical SEO, and scalable IT solutions for businesses across India.",
  email: "kravionatech@gmail.com",
  telephone: "+91-96085-53167",
  priceRange: "$$",
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
    latitude: 28.628,
    longitude: 77.3141,
  },
  openingHoursSpecification: {
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
  sameAs: [
    "https://www.linkedin.com/company/kravionai",
    "https://twitter.com/KravionaTech",
    "https://www.facebook.com/profile.php?id=61570716181916",
  ],
};

export const metadata = {
  title: "Contact Kraviona for Web Development & SEO Help India",
  description:
    "Book a free consultation with Kraviona for MERN stack development, technical SEO, AI automation, web performance, and custom software projects.",
  keywords: [
    "Contact Kraviona",
    "Hire Web Developers India",
    "IT Consulting Contact",
    "Get a Quote Web Development",
    "MERN Stack Agency Contact",
    "Web Development Inquiry",
    "Kraviona Contact Details",
    "Hire Next.js Developer",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical: "https://kraviona.com/contact" },
  openGraph: {
    title: "Contact Kraviona – Let's Build Something Great",
    description:
      "Get in touch with Kraviona for high-performance web development and custom IT solutions. Start your project today.",
    url: "https://kraviona.com/contact",
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Kraviona Tech Solutions",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Contact Kraviona – Let's Build Something Great",
    description:
      "Get in touch for high-performance web development. Start your project with Kraviona today.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const Contact = () => {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd
        data={[
          contactPageSchema,
          localBusinessSchema,
          contactFaqSchema,
          breadcrumbSchema([
            { name: "Home", url: "https://kraviona.com" },
            { name: "Contact", url: "https://kraviona.com/contact" },
          ]),
        ]}
      />
      <ContactBanner />
      <ContactFormDetails />
      <ContactMap />
      <BlogCTA />
      <ContactFAQ />
    </main>
  );
};

export default Contact;
