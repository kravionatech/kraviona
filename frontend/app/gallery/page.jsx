import GalleryPage from "@/components/Gallery/GalleryPage";
import {
  absoluteImageUrl,
  defaultRobots,
  DEFAULT_OG_IMAGE,
} from "@/app/seoConfig.js";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { API_URL } from "@/utils/api";

const canonical = "https://kraviona.com/gallery";
const title = "Portfolio & Project Gallery | Kraviona Tech Solutions";
const description =
  "Explore Kraviona projects, portfolio samples, and digital product work covering MERN stack development, performance, UX, security, and scalable web apps.";

export const metadata = {
  title,
  description,
  keywords: [
    "Kraviona Portfolio",
    "Web Development Portfolio India",
    "Web Design Gallery",
    "Project Showcase",
    "MERN Stack Portfolio",
    "Custom Software Projects",
    "Kraviona Work Samples",
    "Digital Product Design Examples",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical },
  openGraph: {
    title: "Gallery & Portfolio | Kraviona",
    description:
      "Browse our portfolio of successful web development and IT projects — built for scale, performance, and real-world results.",
    url: canonical,
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kraviona Tech Solutions Portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Gallery & Portfolio | Kraviona",
    description:
      "Browse our portfolio of successful web development and IT projects.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: defaultRobots,
};

export const revalidate = 300;

function extractProjectImage(project) {
  return project?.image || project?.thumbnail || project?.coverImage || null;
}

async function getPublicProjects() {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];

    const payload = await response.json();
    return Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];
  } catch {
    return [];
  }
}

const Gallery = async () => {
  const projects = await getPublicProjects();
  const galleryImages = projects
    .map((project) => {
      const url = extractProjectImage(project);
      if (!url) return null;

      const projectName = project.title || project.name || "Kraviona project";
      const serviceType = project.category || project.type || "digital product";

      return {
        "@type": "ImageObject",
        url: absoluteImageUrl(url),
        name: projectName,
        caption: `${projectName} — ${serviceType} project by Kraviona Tech Solutions`,
      };
    })
    .filter(Boolean);
  const imageGallerySchema = galleryImages.length
    ? {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "@id": `${canonical}#image-gallery`,
        name: "Kraviona Portfolio & Work Gallery",
        url: canonical,
        image: galleryImages,
      }
    : null;

  return (
    <div>
      <JsonLd
        data={[
          webPageSchema({
            type: "CollectionPage",
            url: canonical,
            name: title,
            description,
          }),
          imageGallerySchema,
          breadcrumbSchema([
            { name: "Home", url: "https://kraviona.com" },
            { name: "Gallery", url: canonical },
          ]),
        ].filter(Boolean)}
      />
      <GalleryPage initialProjects={projects} />
    </div>
  );
};

export default Gallery;
