import LegalDocumentPage from "@/components/Legal/LegalDocumentPage";
import {
  canonicalUrl,
  defaultRobots,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_TWITTER,
  SITE_URL,
} from "@/app/seoConfig.js";

const canonical = canonicalUrl("/privacy-policy");
const title = "Privacy Policy";
const description =
  "Read Kraviona's bilingual Privacy Policy covering data collection, cookies, third-party services, retention, user rights, and privacy contact details.";

export const metadata = {
  title: "Privacy Policy",
  description,
  keywords: [
    "Kraviona privacy policy",
    "Kraviona data protection",
    "IT services privacy policy India",
    "web development company privacy policy",
  ],
  alternates: { canonical },
  robots: defaultRobots,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: canonical,
    title: "Privacy Policy | Kraviona Tech Solutions",
    description,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kraviona Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_TWITTER,
    creator: SITE_TWITTER,
    title: "Privacy Policy | Kraviona Tech Solutions",
    description,
    images: [DEFAULT_OG_IMAGE],
  },
};

const sections = [
  {
    id: "who-we-are",
    title: "Who We Are",
    hindiTitle: "Hum Kaun Hain",
    body: [
      "Kraviona is an IT services and web development company based in India, providing managed IT support, web and mobile application development, cloud solutions, cybersecurity, AI integration, and digital marketing to businesses and individuals across India and internationally.",
      "Kraviona ek IT services aur web development company hai jo India mein sthit hai. Hum businesses aur vyaktiyon ko managed IT support, web aur mobile app development, cloud solutions, cybersecurity, AI integration, aur digital marketing jaise sewaen pradan karte hain.",
    ],
    items: [
      { label: "Company Name", text: "Kraviona" },
      { label: "Website", text: "https://kraviona.com" },
      { label: "Email", text: "contact@kraviona.com" },
      { label: "Location", text: "India" },
    ],
  },
  {
    id: "information-we-collect",
    title: "What Information We Collect",
    hindiTitle: "Hum Kya Jankari Ikattha Karte Hain",
    body: [
      "When you contact us, fill a form, or hire our services, we may collect your full name, email address, phone number, company name, designation, project requirements, payment information through secure gateways, and any other information you voluntarily provide.",
      "When you visit kraviona.com, we may automatically collect technical data including IP address, browser type and version, device type, operating system, pages visited, time spent, referring URL, approximate geographic location, cookies, and similar tracking data.",
      "We may also receive information from third-party sources such as Google Analytics, social media platforms, or referral partners if you interact with our content on those platforms.",
    ],
    items: [
      {
        label: "Direct Information",
        text: "Name, email, phone, company details, project brief, and messages you send to us.",
      },
      {
        label: "Technical Data",
        text: "IP address, browser, device, operating system, page visits, referrer, and approximate location.",
      },
      {
        label: "Third-Party Data",
        text: "Analytics, social media, and referral information connected with your interaction with Kraviona content.",
      },
      {
        label: "Payment Data",
        text: "Payment processing data handled by secure gateways. Kraviona does not store card details.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Your Information",
    hindiTitle: "Aapki Jankari Ka Upyog Kaise Hota Hai",
    body: [
      "We use collected information to provide requested IT services, communicate about projects or inquiries, send invoices and receipts, improve our website and services, send newsletters only with consent, comply with legal obligations, prevent fraud, analyze traffic, and respond to lawful requests.",
      "Hum aapki jankari ka upyog aapki mangi gayi sewaen pradan karne, project updates dene, invoices bhejne, website aur sewaen behtar banane, legal compliance, fraud prevention, aur lawful requests ka jawab dene ke liye karte hain.",
      "We will never sell, rent, or trade your personal information to any third party for their marketing purposes.",
    ],
  },
  {
    id: "data-security",
    title: "How We Store and Protect Your Data",
    hindiTitle: "Aapka Data Kaise Store Aur Surakshit Hota Hai",
    body: [
      "We implement industry-standard safeguards including SSL/HTTPS encryption, secure servers with firewall protection, access controls, regular security audits and updates, encrypted storage for sensitive project files, and two-factor authentication on internal systems.",
      "No method of internet transmission or electronic storage is 100 percent secure. While we use commercially acceptable means to protect personal information, we cannot guarantee absolute security.",
    ],
    items: [
      {
        label: "Encryption",
        text: "SSL/HTTPS protects web communications across kraviona.com.",
      },
      {
        label: "Access Control",
        text: "Only authorized personnel can access relevant client or visitor data.",
      },
      {
        label: "Security Audits",
        text: "Systems are reviewed and updated regularly to reduce security risk.",
      },
      {
        label: "2FA",
        text: "Internal systems use an additional authentication layer where applicable.",
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    hindiTitle: "Cookies Aur Tracking",
    body: [
      "Kraviona uses cookies and similar tracking technologies to enhance browsing experience and analyze website traffic. You can control cookies through your browser settings, though disabling essential cookies may affect website functionality.",
      "We may use essential cookies, analytics cookies such as Google Analytics, preference cookies, and marketing cookies only where you opt in. To opt out of Google Analytics tracking, visit https://tools.google.com/dlpage/gaoptout.",
    ],
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    hindiTitle: "Teesey Paksh Ki Sewaen",
    body: [
      "We may use third-party services that maintain their own privacy policies, including Google Analytics, Google Workspace or Gmail, Razorpay or payment gateways, Vercel, WhatsApp Business, LinkedIn, and Mailchimp if you subscribe.",
      "When you click links to third-party websites, Kraviona has no control over their privacy practices and is not responsible for external privacy policies.",
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    hindiTitle: "Aapke Adhikar",
    body: [
      "Under applicable Indian data protection laws and internationally recognized privacy principles, you may request access, correction, deletion, objection to processing, data portability, consent withdrawal, or lodge a complaint with relevant authorities.",
      "To exercise these rights, contact privacy@kraviona.com or contact@kraviona.com. We will respond within 30 days.",
    ],
    items: [
      {
        label: "Access",
        text: "Request a copy of the personal data we hold about you.",
      },
      {
        label: "Correction",
        text: "Ask us to correct inaccurate or incomplete personal data.",
      },
      {
        label: "Deletion",
        text: "Request deletion where retention is not legally required.",
      },
      {
        label: "Consent Withdrawal",
        text: "Withdraw marketing consent or unsubscribe at any time.",
      },
    ],
  },
  {
    id: "children-privacy",
    title: "Children's Privacy",
    hindiTitle: "Bachchon Ki Privacy",
    body: [
      "Our services are not directed to individuals under 18. We do not knowingly collect personal information from children under 18. If a parent or guardian believes a child has provided personal information, please contact contact@kraviona.com and we will delete such information from our records.",
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    hindiTitle: "Data Kitne Samay Tak Rakhte Hain",
    body: [
      "We retain personal information only as long as necessary for the purposes described in this policy or as required by law. Client project data and payment records may be retained for 7 years for GST, tax, and accounting compliance.",
      "Contact form submissions may be retained for 2 years, website analytics data for 26 months via Google Analytics, marketing email list data until unsubscribe, and cookies according to their session or persistent expiration periods. After retention expires, data is securely deleted or anonymized.",
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    hindiTitle: "Niti Mein Badlaw",
    body: [
      "We may update this Privacy Policy from time to time for legal, regulatory, operational, or practice-related reasons. Significant changes may be communicated by posting the updated policy, emailing registered clients, or displaying a prominent notice on the website.",
      "Your continued use of kraviona.com after changes are posted constitutes acceptance of the updated policy.",
    ],
  },
  {
    id: "privacy-contact",
    title: "Contact Us for Privacy",
    hindiTitle: "Privacy Ke Liye Sampark",
    body: [
      "For privacy-related questions, concerns, data access requests, or complaints, contact the Privacy Officer at privacy@kraviona.com. General contact is contact@kraviona.com and the website contact page is https://kraviona.com/contact.",
      "We are committed to resolving privacy concerns promptly and transparently.",
    ],
  },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: "Privacy Policy | Kraviona",
    description,
    inLanguage: ["en-IN", "hi-Latn"],
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    datePublished: "2025-06-01",
    dateModified: "2025-06-01",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Policy",
        item: canonical,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    email: "contact@kraviona.com",
    logo: `${SITE_URL}/logo.png`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      title={title}
      hindiTitle="Gopaneeyata Niti"
      eyebrow="Legal Documents / Privacy"
      description={description}
      canonical={canonical}
      sections={sections}
      structuredData={structuredData}
      relatedHref="/terms"
      relatedLabel="View Terms"
    />
  );
}
