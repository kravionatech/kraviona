import { SOCIAL_LINKS } from "@/lib/social";

export const SERVICE_EXPERT = {
  name: "Amar Kumar",
  jobTitle: "Founder & Lead Engineer",
  email: SOCIAL_LINKS.email,
  phone: "+91 96085 53167",
  phoneHref: `tel:${SOCIAL_LINKS.phone}`,
  whatsapp: SOCIAL_LINKS.whatsapp,
  linkedin: "https://www.linkedin.com/in/amarkumar96085/",
  companyLinkedin: SOCIAL_LINKS.linkedin,
  facebook: SOCIAL_LINKS.facebook,
  website: "https://kraviona.com",
  address: "East Delhi, Delhi 110092, India",
  availability: "Monday to Saturday, 9:00 AM - 7:00 PM IST",
  responseTime: "Usually replies within 1 business day",
  consultation: "Free 30-minute discovery call",
  image: "/amar.jpeg",
  bio: "Full-stack developer and founder of Kraviona Tech Solutions, focused on MERN stack engineering, technical SEO, marketplace growth, and performance-first digital systems.",
  credentials: [
    "Founder-led technical discovery",
    "MERN stack and Next.js delivery experience",
    "Technical SEO and Core Web Vitals implementation",
    "Marketplace seller growth and automation support",
  ],
  knowsAbout: [
    "MERN stack development",
    "Technical SEO",
    "Marketplace account growth",
    "Digital marketing automation",
    "SaaS architecture",
  ],
};

export const CATEGORY_DETAILS = {
  "Web Development": {
    intro:
      "Built for teams that need reliable software, clean user experiences, and a website or application that can keep growing after launch.",
    deliverables: [
      "Responsive page and application UI",
      "Frontend and backend implementation",
      "Authentication, forms, dashboards, and integrations",
      "SEO-ready structure, performance cleanup, and deployment support",
    ],
    process: [
      "Requirement mapping and technical scope",
      "Wireframe or component structure planning",
      "Development with review checkpoints",
      "Testing, launch, and post-launch improvements",
    ],
    idealFor: [
      "Startups building MVPs",
      "Businesses modernizing old websites",
      "Teams needing dashboards or custom portals",
      "Brands that need SEO-friendly web foundations",
    ],
    faqs: [
      {
        question: "Will the website be mobile-friendly?",
        answer:
          "Yes. Every service page and project is planned around responsive layouts, performance, and clean user journeys across mobile, tablet, and desktop.",
      },
      {
        question: "Can Kraviona handle both frontend and backend?",
        answer:
          "Yes. Kraviona works across React, Next.js, Node.js, APIs, databases, integrations, and deployment workflows.",
      },
    ],
  },
  "Backend & Architecture": {
    intro:
      "For products that need stable APIs, secure data flows, clean backend logic, and architecture that does not collapse as usage grows.",
    deliverables: [
      "API architecture and endpoint development",
      "Database modeling, validation, and access control",
      "Authentication, authorization, and integration workflows",
      "Deployment guidance, logging, and maintainability notes",
    ],
    process: [
      "System audit and data flow mapping",
      "API and database schema planning",
      "Secure backend implementation",
      "Testing, documentation, and release support",
    ],
    idealFor: [
      "SaaS founders",
      "Mobile app teams needing APIs",
      "Businesses replacing manual workflows",
      "Products with scaling or security concerns",
    ],
    faqs: [
      {
        question: "Do you document APIs?",
        answer:
          "Yes. API projects can include clear endpoint documentation, request examples, validation notes, and integration guidance.",
      },
      {
        question: "Can you improve an existing backend?",
        answer:
          "Yes. Kraviona can audit existing APIs, database queries, auth flows, and deployment setup before recommending focused improvements.",
      },
    ],
  },
  "Performance & AI": {
    intro:
      "Focused on speed, search visibility, automation, and AI workflows that help teams save time while improving technical quality.",
    deliverables: [
      "Core Web Vitals and performance fixes",
      "Technical SEO and schema improvements",
      "AI chatbot, LLM, and automation workflow setup",
      "Measurement, tracking, and improvement reports",
    ],
    process: [
      "Audit current performance, SEO, or workflow gaps",
      "Prioritize high-impact fixes and automation opportunities",
      "Implement changes with measurable checkpoints",
      "Review results and improve the next iteration",
    ],
    idealFor: [
      "Websites losing rankings due to technical issues",
      "Teams spending too much time on repetitive work",
      "Businesses wanting AI-powered lead or support flows",
      "Brands preparing for AI search and fast page experiences",
    ],
    faqs: [
      {
        question: "Can AI automation connect with existing tools?",
        answer:
          "Yes. The workflow can be planned around your current website, forms, CRM, spreadsheets, email tools, or internal process.",
      },
      {
        question: "Do you only provide an audit?",
        answer:
          "No. Kraviona can provide the audit, implementation, and follow-up measurement so improvements actually reach production.",
      },
    ],
  },
  "Branding & Marketing": {
    intro:
      "For businesses that need clearer positioning, stronger campaign execution, and marketing systems that turn attention into qualified leads.",
    deliverables: [
      "Marketing strategy and channel planning",
      "Landing page, content, and campaign direction",
      "Social, email, SEO, and paid campaign support",
      "Reporting on leads, engagement, traffic, and conversions",
    ],
    process: [
      "Brand, audience, and offer discovery",
      "Campaign and content roadmap",
      "Creative, copy, and tracking setup",
      "Performance review and campaign refinement",
    ],
    idealFor: [
      "Local service businesses",
      "New brands building market presence",
      "Companies needing consistent content systems",
      "Teams that want measurable campaign reporting",
    ],
    faqs: [
      {
        question: "Do you support both organic and paid marketing?",
        answer:
          "Yes. Kraviona can plan SEO, social content, email campaigns, landing pages, and paid campaigns depending on the growth goal.",
      },
      {
        question: "Will campaign performance be tracked?",
        answer:
          "Yes. Tracking and reporting can include leads, traffic, engagement, conversion events, and channel-level learnings.",
      },
    ],
  },
  "Marketplace & Seller": {
    intro:
      "Built for online sellers who need cleaner listings, stronger account operations, better advertising, and practical visibility into profitability.",
    deliverables: [
      "Marketplace account setup and optimization",
      "Catalog, listings, variations, and product content cleanup",
      "Advertising, pricing, reporting, and account health support",
      "Seller training and repeatable operating processes",
    ],
    process: [
      "Account, catalog, and performance review",
      "Issue list and growth opportunity mapping",
      "Implementation across listings, ads, and operations",
      "Weekly or monthly review with next actions",
    ],
    idealFor: [
      "New marketplace sellers",
      "Existing sellers with catalog or ad issues",
      "E-commerce brands expanding to marketplaces",
      "Teams needing training and operational clarity",
    ],
    faqs: [
      {
        question: "Can you help with catalog errors?",
        answer:
          "Yes. Kraviona can help clean listing data, variations, titles, descriptions, images, and marketplace-specific catalog issues.",
      },
      {
        question: "Do you provide seller training?",
        answer:
          "Yes. Training can cover account workflows, catalog handling, order processes, advertising basics, and reporting routines.",
      },
    ],
  },
};

export const SERVICE_PAGES = {
  "mern-stack-development": {
    name: "MERN Stack Development",
    shortName: "MERN Stack",
    category: "Web Development",
    description:
      "MongoDB, Express.js, React.js, and Node.js applications built for speed, clean architecture, and long-term scale.",
    outcomes: [
      "Production-ready MERN architecture",
      "Secure APIs and role-based access",
      "Fast React and Next.js user experiences",
      "Deployment, monitoring, and launch support",
    ],
  },
  "full-stack-development": {
    name: "Full-Stack Development",
    category: "Web Development",
    description:
      "End-to-end frontend, backend, database, and deployment work for business-critical web products.",
    outcomes: [
      "Complete product planning and delivery",
      "Frontend, backend, and database implementation",
      "Third-party integrations",
      "Performance and SEO-ready foundations",
    ],
  },
  "react-development": {
    name: "React.js Development",
    category: "Web Development",
    description:
      "Interactive React and Next.js interfaces with reusable components, clean state management, and fast page experiences.",
    outcomes: [
      "Reusable component systems",
      "Next.js routing and optimization",
      "Dashboard and SPA development",
      "Responsive, accessible UI delivery",
    ],
  },
  "nodejs-development": {
    name: "Node.js Development",
    category: "Web Development",
    description:
      "Scalable Node.js backends, Express APIs, real-time systems, and production-grade server infrastructure.",
    outcomes: [
      "REST and GraphQL API development",
      "Authentication and authorization",
      "Real-time WebSocket features",
      "Cloud-ready backend deployment",
    ],
  },
  "backend-development": {
    name: "Backend Development",
    category: "Backend & Architecture",
    description:
      "Robust server-side systems, business logic, integrations, and API layers designed for maintainability.",
    outcomes: [
      "Secure backend architecture",
      "Microservices and modular APIs",
      "Database and cache integration",
      "Logging, testing, and deployment support",
    ],
  },
  "api-development": {
    name: "API Development",
    category: "Backend & Architecture",
    description:
      "Custom RESTful and GraphQL APIs for web apps, mobile apps, admin panels, and third-party integrations.",
    outcomes: [
      "Versioned API architecture",
      "OpenAPI and Postman documentation",
      "Rate limiting and validation",
      "Payment, email, CRM, and external API integrations",
    ],
  },
  "database-architecture": {
    name: "Database Architecture",
    category: "Backend & Architecture",
    description:
      "Optimized database design for reliability, reporting, scalability, and clean application development.",
    outcomes: [
      "MongoDB and SQL schema planning",
      "Indexing and query optimization",
      "Data migration support",
      "Backup, security, and access strategy",
    ],
  },
  "saas-development": {
    name: "SaaS Development",
    category: "Backend & Architecture",
    description:
      "Cloud-based SaaS platforms with multi-tenant logic, subscriptions, dashboards, and scalable product foundations.",
    outcomes: [
      "MVP and SaaS product architecture",
      "Subscription and billing workflows",
      "Tenant-aware dashboards",
      "Admin panels and analytics",
    ],
  },
  "technical-seo": {
    name: "Technical SEO",
    category: "Performance & AI",
    description:
      "Core Web Vitals, crawlability, structured data, indexing, and technical fixes that make websites easier to rank.",
    outcomes: [
      "Technical SEO audit and roadmap",
      "Schema markup and metadata cleanup",
      "Crawl, indexation, and canonical fixes",
      "Core Web Vitals improvements",
    ],
  },
  "web-performance-optimization": {
    name: "Web Performance Optimization",
    category: "Performance & AI",
    description:
      "Speed improvements for websites and apps through image optimization, code splitting, caching, and frontend cleanup.",
    outcomes: [
      "Lighthouse and Core Web Vitals improvements",
      "Image, font, and asset optimization",
      "Bundle and render performance cleanup",
      "Caching and CDN guidance",
    ],
  },
  "ai-automation": {
    name: "AI Automation",
    category: "Performance & AI",
    description:
      "LLM-powered workflows, AI assistants, document automation, and internal tools that reduce repetitive work.",
    outcomes: [
      "LLM and ChatGPT integrations",
      "Workflow automation design",
      "Internal AI tools and assistants",
      "Data extraction and smart routing",
    ],
  },
  "ai-chatbot-development": {
    name: "AI Chatbot Development",
    category: "Performance & AI",
    description:
      "Custom AI assistants and chatbots for websites, support teams, lead capture, and internal knowledge workflows.",
    outcomes: [
      "Website chatbot setup",
      "Lead qualification flows",
      "Knowledge base and FAQ training",
      "Human handoff and analytics",
    ],
  },
  "digital-marketing": {
    name: "Digital Marketing",
    category: "Branding & Marketing",
    description:
      "SEO, paid campaigns, conversion strategy, analytics, and content planning for measurable business growth.",
    outcomes: [
      "SEO and paid campaign strategy",
      "Landing page and funnel planning",
      "Analytics and conversion tracking",
      "Monthly growth reporting",
    ],
  },
  "social-media-marketing": {
    name: "Social Media Marketing",
    category: "Branding & Marketing",
    description:
      "Content strategy, social media calendars, paid social campaigns, and brand communication for active channels.",
    outcomes: [
      "Platform-specific content planning",
      "Creative direction and campaign calendars",
      "Paid social campaign setup",
      "Engagement and performance reporting",
    ],
  },
  "email-marketing": {
    name: "Email Marketing",
    category: "Branding & Marketing",
    description:
      "Lifecycle email campaigns, newsletters, automation flows, and retention journeys for leads and customers.",
    outcomes: [
      "Welcome and nurture sequences",
      "Newsletter campaign planning",
      "Segmentation and automation",
      "Open, click, and conversion reporting",
    ],
  },
  "brand-identity": {
    name: "Brand Identity & Design",
    category: "Branding & Marketing",
    description:
      "Logo direction, brand systems, visual guidelines, and digital identity design for consistent business presence.",
    outcomes: [
      "Logo and visual identity direction",
      "Typography and color system",
      "Social and website brand assets",
      "Brand guideline documentation",
    ],
  },
  "ecommerce-development-marketing": {
    name: "E-Commerce Dev & Marketing",
    category: "Marketplace & Seller",
    description:
      "E-commerce storefronts, product pages, checkout flows, and growth marketing built around real sales outcomes.",
    outcomes: [
      "Storefront development and optimization",
      "Product page and checkout improvements",
      "SEO and performance marketing",
      "Analytics, tracking, and reporting",
    ],
  },
  "account-management": {
    name: "Account Management",
    category: "Marketplace & Seller",
    description:
      "End-to-end marketplace account handling for sellers who need catalog, operations, advertising, and growth support.",
    outcomes: [
      "Marketplace account setup and hygiene",
      "Listing, pricing, and promotion support",
      "Issue handling and performance tracking",
      "Monthly marketplace growth review",
    ],
  },
  cataloging: {
    name: "Cataloging",
    category: "Marketplace & Seller",
    description:
      "Marketplace product catalog creation, listing optimization, variation mapping, and content cleanup.",
    outcomes: [
      "Product listing creation",
      "Title, bullet, and description optimization",
      "Image and variation mapping",
      "Catalog error cleanup",
    ],
  },
  accounting: {
    name: "Accounting",
    category: "Marketplace & Seller",
    description:
      "Seller-focused bookkeeping, reconciliation, payout tracking, and profitability visibility for online businesses.",
    outcomes: [
      "Sales and payout reconciliation",
      "Expense and fee tracking",
      "Profitability reporting",
      "Monthly account summaries",
    ],
  },
  advertising: {
    name: "Advertising",
    category: "Marketplace & Seller",
    description:
      "Performance ad campaigns for search, social, and marketplace platforms with budget control and clear reporting.",
    outcomes: [
      "Campaign structure and keyword planning",
      "Marketplace and PPC ad setup",
      "Budget, bid, and audience optimization",
      "ROAS and lead reporting",
    ],
  },
  "seller-training": {
    name: "Seller Training",
    category: "Marketplace & Seller",
    description:
      "Practical marketplace training for sellers, teams, and operators who want to manage accounts with confidence.",
    outcomes: [
      "Marketplace onboarding sessions",
      "Catalog and order workflow training",
      "Advertising and reporting basics",
      "Process documents for seller teams",
    ],
  },
  "ui-ux-design": {
    name: "UI/UX Design",
    category: "Web Development",
    description:
      "Conversion-focused interfaces, wireframes, design systems, and responsive web experiences.",
    outcomes: [
      "Wireframes and page structure",
      "Responsive interface design",
      "Design system foundations",
      "Usability and conversion improvements",
    ],
  },
  "web-app-development": {
    name: "Web App Development",
    category: "Web Development",
    description:
      "Custom web applications for startups and businesses using modern frontend, backend, and cloud tools.",
    outcomes: [
      "MVP and custom web app builds",
      "Admin panels and dashboards",
      "Authentication and user flows",
      "Deployment and maintenance support",
    ],
  },
};

export const SERVICE_LINKS = Object.entries(SERVICE_PAGES).map(
  ([slug, service]) => ({
    name: service.name,
    href: `/services/${slug}`,
    category: service.category,
  }),
);

// Dynamic service pages share the same FAQ component and JSON-LD. Keep the
// source here so visible answers and structured data cannot diverge. Each
// answer is intentionally substantive enough to be useful in the page rather
// than a thin rich-result placeholder.
export function getServiceFaqs(service) {
  const categoryFaqs = CATEGORY_DETAILS[service.category]?.faqs || [];
  const outcomeSummary = service.outcomes.slice(0, 3).join(", ").toLowerCase();

  return [
    {
      question: `What is included in Kraviona's ${service.name} service?`,
      answer: `The scope is shaped around your goals, current setup, and delivery priorities. A typical ${service.name} engagement can include ${outcomeSummary}. Before work begins, Kraviona confirms the practical deliverables, responsibilities, review points, and launch or handover plan in writing.`,
    },
    {
      question: `How do you scope a ${service.name} project?`,
      answer: `Kraviona starts with a discovery conversation, reviews the existing product or requirement, and identifies the highest-impact work. The team then turns that into a phased scope with assumptions, dependencies, milestones, and a realistic timeline, so the project stays focused instead of becoming an open-ended list of requests.`,
    },
    {
      question: `Can ${service.name} work with our existing tools and team?`,
      answer: `Yes. The work can be planned around the systems you already use, including your website, codebase, CMS, CRM, analytics, hosting, or internal workflows. Kraviona documents access needs early, works with your stakeholders, and recommends integration or migration steps that limit unnecessary disruption.`,
    },
    {
      question: `How is progress reported during ${service.name} work?`,
      answer: `You receive clear checkpoints rather than vague status updates. Depending on the scope, these can include a prioritized task plan, working demonstrations, before-and-after findings, implementation notes, and next actions. The reporting focuses on decisions, completed work, risks, and the measurable result the service is intended to improve.`,
    },
    {
      question: `What happens after the ${service.name} work is delivered?`,
      answer: `Kraviona explains what was completed, hands over relevant access or documentation, and outlines sensible next steps for your team. Projects include a practical review period for agreed fixes, while ongoing support can be arranged for monitoring, improvements, new features, or a longer-term growth roadmap.`,
    },
    ...categoryFaqs,
  ].slice(0, 7);
}
