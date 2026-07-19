import LegalDocumentPage from "@/components/Legal/LegalDocumentPage";
import {
  canonicalUrl,
  defaultRobots,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_TWITTER,
  SITE_URL,
} from "@/app/seoConfig.js";

const canonical = canonicalUrl("/terms");
const title = "Terms and Conditions";
const description =
  "Read Kraviona's bilingual Terms and Conditions for website use, IT services, payments, intellectual property, delivery, confidentiality, liability, and dispute resolution.";

export const metadata = {
  title: "Terms and Conditions | Kraviona",
  description,
  keywords: [
    "Kraviona terms and conditions",
    "Kraviona terms of service",
    "IT services terms India",
    "web development service agreement",
  ],
  alternates: { canonical },
  robots: defaultRobots,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: canonical,
    title: "Terms and Conditions | Kraviona",
    description,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kraviona Terms and Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_TWITTER,
    creator: SITE_TWITTER,
    title: "Terms and Conditions | Kraviona",
    description,
    images: [DEFAULT_OG_IMAGE],
  },
};

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    hindiTitle: "Sharten Sweekar Karna",
    body: [
      "By using kraviona.com, filling our contact form, engaging us via email, phone, or WhatsApp, signing a project agreement, or making a payment to Kraviona, you confirm that you are at least 18 years old, have read and understood these Terms, and agree to comply with applicable laws.",
      "If you act on behalf of a company, you confirm that you have authority to bind that company. If you do not agree to these Terms, please do not use our website or services.",
    ],
    items: [
      {
        label: "Minimum Age",
        text: "You must be at least 18 years old and legally capable of entering a contract.",
      },
      {
        label: "Authority",
        text: "Company representatives must have authority to accept terms on behalf of the company.",
      },
      {
        label: "Compliance",
        text: "You agree to follow Indian law and laws applicable in your jurisdiction.",
      },
      {
        label: "Full Acceptance",
        text: "Using our website or services confirms acceptance of these Terms.",
      },
    ],
  },
  {
    id: "services",
    title: "Services Offered",
    hindiTitle: "Di Jaane Wali Sewaen",
    body: [
      "Kraviona provides IT and technology services. Specific deliverables, timelines, and scope are defined in the project agreement, proposal, quotation, or service order between Kraviona and the Client.",
      "Kraviona may modify, suspend, discontinue, or add services with reasonable notice where applicable.",
    ],
    items: [
      {
        label: "Web Development",
        text: "Custom websites, web apps, Next.js, React, and full-stack development.",
      },
      {
        label: "Mobile App Development",
        text: "Android, iOS, React Native, Flutter, and cross-platform applications.",
      },
      {
        label: "Managed IT Support",
        text: "Helpdesk, network, infrastructure management, and AMC support.",
      },
      {
        label: "Cloud Services",
        text: "AWS, Azure, GCP setup, migration, and management.",
      },
      {
        label: "Cybersecurity",
        text: "Security audits, firewall configuration, data protection, and VAPT.",
      },
      {
        label: "SEO and Marketing",
        text: "Technical SEO, content, social media, PPC, and digital growth services.",
      },
      {
        label: "AI and Automation",
        text: "Chatbots, workflow automation, RPA, and AI integrations.",
      },
      {
        label: "IT Consulting",
        text: "CTO-as-a-Service, digital transformation, and technology strategy.",
      },
    ],
  },
  {
    id: "user-obligations",
    title: "User Obligations",
    hindiTitle: "Upyogkarta Ki Zimmedariyan",
    body: [
      "You must provide accurate, complete, and up-to-date information when contacting us or during a project. False or misleading information may result in termination of services without refund.",
      "You agree to cooperate with Kraviona by providing content, approvals, feedback, credentials, and required access in a timely manner. Delays caused by the Client may result in revised timelines and additional charges.",
      "You must not use Kraviona services for illegal purposes, hacking, unauthorized access, malware distribution, intellectual property infringement, reverse engineering, harassment, defamation, or violation of any applicable law or court order.",
    ],
  },
  {
    id: "payment-terms",
    title: "Payment Terms",
    hindiTitle: "Bhugtan Sharten",
    body: [
      "Service fees are as agreed in the individual proposal, quotation, or service agreement. All prices are in Indian Rupees unless otherwise stated and are exclusive of applicable taxes including GST.",
      "Standard project milestones may include 30-50 percent advance before commencement, 30-40 percent at design, prototype, or mid-milestone delivery, and remaining balance before final delivery or live deployment.",
      "Monthly retainer payments for managed IT, SEO, and digital marketing are due on or before the 5th of each month. Late payments may attract a penalty of 2 percent per month on the outstanding amount.",
      "Advance payments are non-refundable once work has commenced unless Kraviona fails to deliver as per the agreed scope. Refund requests must be raised within 7 days of the disputed event and approved refunds are processed within 15 business days.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    hindiTitle: "Bauddhik Sampada",
    body: [
      "All content on kraviona.com, including text, graphics, logos, images, icons, source code, software, and overall design, is the intellectual property of Kraviona and is protected under Indian copyright law and applicable international IP laws.",
      "Upon full payment of all project fees, Kraviona assigns to the Client ownership of final deliverables created specifically for the Client, including website code, designs, and content developed exclusively for the project.",
      "Kraviona retains the right to use open-source libraries, third-party tools, and proprietary internal frameworks as part of project development. Kraviona may showcase completed work in its portfolio unless restricted by a written NDA.",
    ],
  },
  {
    id: "project-delivery",
    title: "Project Delivery and Timelines",
    hindiTitle: "Pariyojana Delivery Aur Samay-Seema",
    body: [
      "Project timelines are estimates provided in the project agreement. Kraviona will make reasonable efforts to meet agreed deadlines, but timelines may be affected by client feedback delays, approval delays, content delays, scope changes, technical issues beyond reasonable control, force majeure events, and third-party dependencies.",
      "Kraviona will notify the Client of significant delays as soon as reasonably possible. The Client acknowledges that software development timelines are estimates, not guarantees.",
    ],
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    hindiTitle: "Gopaniyata",
    body: [
      "Kraviona and the Client agree to maintain confidentiality regarding each other's proprietary information, business data, project details, source code, client lists, pricing, and information marked or reasonably understood as confidential.",
      "This confidentiality obligation survives termination of the service agreement for 3 years. A separate Non-Disclosure Agreement can be signed upon request.",
      "Confidentiality does not apply to information already publicly known, independently developed, or required to be disclosed by law or court order.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    hindiTitle: "Dayitwa Ki Seema",
    body: [
      "To the maximum extent permitted by Indian law, Kraviona's total liability for claims arising from these Terms or services shall not exceed the total amount paid to Kraviona in the 3 months preceding the claim.",
      "Kraviona is not liable for indirect, incidental, special, or consequential damages; loss of business, revenue, profits, or data; force majeure events; third-party service, hosting, or API failures; unauthorized access caused by Client negligence; or losses caused by Client misuse of delivered software or services.",
    ],
  },
  {
    id: "warranty",
    title: "Warranty Disclaimer",
    hindiTitle: "Warranty Ka Asteekar",
    body: [
      "Kraviona provides services on an AS IS and AS AVAILABLE basis. We do not warrant that services will be uninterrupted, error-free, completely secure, that websites will always rank on search engines, that all bugs will be resolved within a specific timeframe, or that digital marketing results are guaranteed.",
      "Kraviona provides a 30-day bug-fix warranty on completed website and app development projects for issues directly attributable to Kraviona's code. This warranty does not cover issues caused by client modifications, hosting changes, or third-party plugin updates.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    hindiTitle: "Samaapti",
    body: [
      "The Client may terminate a project or service with 15 days written notice to contact@kraviona.com. The Client shall pay for all work completed up to the termination date, and advance payments already made are non-refundable.",
      "Kraviona may immediately terminate services for non-payment, violation of these Terms, illegal activity, or conduct that damages Kraviona's reputation. Deliverables not yet handed over remain Kraviona property until all outstanding payments are cleared.",
    ],
  },
  {
    id: "disputes",
    title: "Dispute Resolution",
    hindiTitle: "Vivad Samadhan",
    body: [
      "If a dispute, controversy, or claim arises from these Terms or services, the parties agree to first attempt direct negotiation through written notice with 15 days to resolve.",
      "If negotiation fails, the dispute may proceed to mediation through a mutually agreed mediator within 30 days. If mediation fails, the dispute may proceed to binding arbitration under the Arbitration and Conciliation Act, 1996, India.",
      "The venue for arbitration or legal proceedings shall be India. Each party bears its own legal costs unless the arbitrator or court orders otherwise.",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law",
    hindiTitle: "Lagoo Kanoon",
    body: [
      "These Terms are governed by the laws of India, including the Information Technology Act, 2000 and amendments, Indian Contract Act, 1872, Consumer Protection Act, 2019, Copyright Act, 1957, and Goods and Services Tax laws.",
      "Courts of competent jurisdiction in India shall have exclusive jurisdiction over disputes not resolved through arbitration.",
    ],
  },
  {
    id: "amendments",
    title: "Amendments",
    hindiTitle: "Sanshodhan",
    body: [
      "Kraviona may modify these Terms at any time. Material changes may be communicated by posting updated Terms on the website with a new effective date or by email notification to active service clients.",
      "Continued use of kraviona.com or Kraviona services after modifications constitutes acceptance of the updated Terms. You are responsible for reviewing these Terms periodically.",
    ],
  },
  {
    id: "terms-contact",
    title: "Contact Us for Terms",
    hindiTitle: "Sharten Ke Liye Sampark",
    body: [
      "For questions, clarifications, or concerns about these Terms and Conditions, contact legal@kraviona.com. General contact is contact@kraviona.com, Privacy Policy is available at https://kraviona.com/privacy-policy, and Contact Us is available at https://kraviona.com/contact.",
      "By using kraviona.com or engaging Kraviona's services, you acknowledge that you have read, understood, and agree to the Privacy Policy and Terms and Conditions.",
    ],
  },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: "Terms and Conditions | Kraviona",
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
        name: "Terms and Conditions",
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

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title={title}
      hindiTitle="Niyam Evam Sharten"
      eyebrow="Legal Documents / Terms"
      description={description}
      canonical={canonical}
      sections={sections}
      structuredData={structuredData}
      relatedHref="/privacy-policy"
      relatedLabel="View Privacy Policy"
      pdfPath="/pdf/PRIVACY_POLICY_KRAVIONA.pdf"
    />
  );
}
