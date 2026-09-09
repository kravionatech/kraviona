import { PostModel } from "../../models/blog/post.model.js";
import { CategoryModel } from "../../models/blog/category.model.js";
import { Service } from "../../models/services/service.model.js";
import { Project } from "../../models/portfolio/project.model.js";
import { CareerModel } from "../../models/Careers/career.model.js";
import { TeamMemberModel } from "../../models/team/team.model.js";
import config from "../../config/config.js";

// Global in-memory knowledge store and index
let knowledgeIndex = null;
let lastIndexTime = 0;
const INDEX_TTL_MS = 15 * 60 * 1000; // Auto refresh every 15 mins

// Comprehensive static company & service knowledge base
const STATIC_KRAVIONA_KNOWLEDGE = [
  {
    id: "static-about",
    type: "page",
    title: "About Kraviona Tech Solutions",
    category: "Company",
    url: "/about",
    description:
      "Kraviona Tech Solutions is a premier digital engineering and technical SEO agency based in Delhi NCR (Noida, India). We engineer high-performance MERN stack applications, modern Next.js websites, technical SEO architectures, AI automation solutions, and scalable cloud-ready backend platforms.",
    keywords: ["about kraviona", "company info", "what is kraviona", "who are you", "kraviona tech solutions", "location", "noida", "delhi ncr", "kraviona kya hai", "founder", "agency"],
  },
  {
    id: "static-contact",
    type: "page",
    title: "Contact Information & Inquiries",
    category: "Contact",
    url: "/contact",
    description:
      "You can connect with Kraviona Tech Solutions directly. Official Email: kravionatech@gmail.com, Official Phone: +91 96085 53167. Location: Noida, Delhi NCR, India. WhatsApp support is also available via +91 96085 53167.",
    keywords: ["contact", "email", "phone number", "call", "address", "reach out", "support", "office location", "whatsapp", "number", "sampark", "phone"],
  },
  {
    id: "static-services-overview",
    type: "page",
    title: "Kraviona Services Overview",
    category: "Services",
    url: "/services",
    description:
      "Kraviona provides 5 core engineering services: 1. Full-Stack Web Development (Next.js, React, Node.js, Express, MongoDB), 2. Advanced Technical SEO & Core Web Vitals Optimization (90+ speed scores), 3. Custom AI Automations & Workflows, 4. UI/UX Design & Prototyping, 5. Custom API Development & Cloud Systems.",
    keywords: ["services", "what do you offer", "web development", "seo", "ai automation", "mern stack", "hire developers", "kya karte ho", "features", "offerings"],
  },
  {
    id: "static-web-dev",
    type: "service",
    title: "Full-Stack Web Development",
    category: "Services",
    url: "/services",
    description:
      "We build modern, ultra-fast web applications using Next.js 14/15, React, Node.js, Express, MongoDB, and Tailwind CSS. Every project features responsive design, sub-second page loads, and enterprise-grade code quality.",
    keywords: ["web development", "nextjs", "next.js", "react", "mern", "website", "frontend", "backend", "full stack", "web dev", "website banwana"],
  },
  {
    id: "static-technical-seo",
    type: "service",
    title: "Technical SEO & Speed Optimization",
    category: "Services",
    url: "/services",
    description:
      "Our Technical SEO practice guarantees 90+ mobile Core Web Vitals scores, structured schema markup, crawl budget optimization, and site architecture enhancements designed for high organic Google rankings.",
    keywords: ["seo", "technical seo", "ranking", "google ranking", "core web vitals", "speed", "traffic", "organic search", "speed optimization"],
  },
  {
    id: "static-ai-automation",
    type: "service",
    title: "AI Workflows & Automations",
    category: "Services",
    url: "/services",
    description:
      "We design custom business AI automations, intelligent chat assistants, automated web scraping workflows, and LLM API integrations that streamline business operations.",
    keywords: ["ai", "automation", "workflows", "llm", "chatbots", "ai integration", "agents", "machine learning"],
  },
  {
    id: "static-pricing",
    type: "page",
    title: "Pricing & Service Packages",
    category: "Pricing",
    url: "/contact",
    description:
      "Kraviona offers flexible project-based quotes for custom development and monthly retainers for Technical SEO and site maintenance. Transparent pricing with no hidden charges. Contact us at kravionatech@gmail.com or +91 96085 53167 for a free custom estimate.",
    keywords: ["pricing", "cost", "rates", "packages", "hire", "charges", "how much", "kitna kharcha", "kitna lagega", "budget", "price", "rate", "fees"],
  },
  {
    id: "static-case-studies",
    type: "page",
    title: "Case Studies & Portfolio",
    category: "Portfolio",
    url: "/case-studies",
    description:
      "Explore real-world client implementations, architectural transformations, SEO scale-ups, and modern web application builds engineered by Kraviona Tech Solutions.",
    keywords: ["portfolio", "case studies", "projects", "work", "past work", "clients", "samples", "examples", "previous work", "kya banaya"],
  },
  {
    id: "static-careers",
    type: "page",
    title: "Careers at Kraviona",
    category: "Careers",
    url: "/careers",
    description:
      "Join the Kraviona engineering and digital growth team. Check out our open roles in frontend, backend, SEO, and AI engineering on our Careers page.",
    keywords: ["careers", "jobs", "hiring", "openings", "join team", "work with us", "internship", "apply", "job"],
  },
  {
    id: "static-location",
    type: "page",
    title: "Headquarters & Office Location",
    category: "Company",
    url: "/contact",
    description:
      "Kraviona Tech Solutions is headquartered in Delhi NCR (Noida, Uttar Pradesh, India). We deliver remote web engineering and SEO services across India and internationally.",
    keywords: ["location", "address", "where are you", "office", "noida", "delhi ncr", "kahan ho", "headquarters", "city"],
  },
];

import mongoose from "mongoose";

// Common conversational and generic stopwords in English and Hindi/Hinglish
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with",
  "by", "about", "from", "of", "is", "are", "am", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "can", "could", "will",
  "would", "should", "may", "might", "must", "how", "what", "why", "when",
  "where", "who", "which", "make", "tell", "me", "us", "you", "your", "my",
  "i", "it", "its", "this", "that", "these", "those", "please",
]);

// Clean and tokenize text for TF-IDF / keyword search
const tokenize = (text = "", filterStopwords = false) => {
  const tokens = String(text)
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);

  return filterStopwords ? tokens.filter((t) => !STOP_WORDS.has(t)) : tokens;
};

// Hindi / Hinglish query intent recognition
const isHindiOrHinglish = (text = "") => {
  const hindiRegex = /[\u0900-\u097F]/;
  const hinglishWords = [
    "kya", "kaise", "hai", "hain", "karna", "mujhe", "chahiye", "batao",
    "kaha", "kahan", "kaun", "kare", "sakta", "sakte", "mera", "meri",
    "banao", "banwana", "banwani", "kharidna", "rate", "paisa", "kitna",
    "namaste", "dhanyawad", "shukriya", "madad", "sampark", "kaam", "theek",
    "bhai", "karo", "do", "dena", "lagta", "kharcha"
  ];
  if (hindiRegex.test(text)) return true;
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => hinglishWords.includes(w));
};

/**
 * Builds the searchable public knowledge index from MongoDB + static data.
 * Guarantees zero unpublished/draft/private data.
 */
export const buildKnowledgeIndex = async () => {
  const docs = [...STATIC_KRAVIONA_KNOWLEDGE];

  try {
    // Only query MongoDB if connected to avoid buffer timeouts
    if (mongoose.connection?.readyState === 1) {
      const now = new Date();

    // 1. Published Blog & News Posts
    const posts = await PostModel.find({
      status: "published",
      $or: [
        { publishedAt: { $exists: false } },
        { publishedAt: null },
        { publishedAt: { $lte: now } },
      ],
      isNoIndex: { $ne: true },
    })
      .select("title slug excerpt content quickAnswer keyTakeaways faqSchema category contentType tags")
      .lean();

    for (const post of posts) {
      const catSlug = post.category?.slug || (post.contentType === "news" ? "news" : "blog");
      // Format strict correct URL: /{category}/{slug}
      const itemUrl = `/${catSlug}/${post.slug}`;
      const faqTexts = Array.isArray(post.faqSchema)
        ? post.faqSchema.map((f) => `${f.question} ${f.answer}`).join(" ")
        : "";
      const takeaways = Array.isArray(post.keyTakeaways)
        ? post.keyTakeaways.join(" ")
        : "";

      docs.push({
        id: `post-${post._id}`,
        type: post.contentType === "news" ? "news" : "blog",
        title: post.title,
        slug: post.slug,
        category: post.category?.name || catSlug,
        categorySlug: catSlug,
        url: itemUrl,
        description: post.quickAnswer || post.excerpt || "",
        body: `${post.excerpt || ""} ${takeaways} ${faqTexts} ${(post.content || "").slice(0, 800)}`,
        keywords: [
          ...(post.tags || []),
          post.title,
          post.category?.name,
          post.contentType,
        ].filter(Boolean),
      });
    }

    // 2. Published Categories
    const categories = await CategoryModel.find({ status: "published" })
      .select("name slug description")
      .lean();

    for (const cat of categories) {
      docs.push({
        id: `category-${cat._id}`,
        type: "category",
        title: `${cat.name} Articles`,
        slug: cat.slug,
        category: "Categories",
        url: `/category/${cat.slug}`,
        description: cat.description || `Browse all articles under ${cat.name}.`,
        body: cat.description || "",
        keywords: [cat.name, cat.slug, "blog category", "topic"],
      });
    }

    // 3. Active Services
    const services = await Service.find({ isActive: true })
      .select("title slug category description features hero faqs")
      .lean();

    for (const s of services) {
      const featuresText = Array.isArray(s.features) ? s.features.join(", ") : "";
      const faqsText = Array.isArray(s.faqs)
        ? s.faqs.map((f) => `${f.question}: ${f.answer}`).join(" ")
        : "";

      docs.push({
        id: `service-${s._id}`,
        type: "service",
        title: s.title,
        slug: s.slug,
        category: s.category || "Service",
        url: `/services/${s.slug}`,
        description: s.description || s.hero?.description || "",
        body: `${featuresText} ${faqsText}`,
        keywords: [s.title, s.category, "service", ...(s.features || [])],
      });
    }

    // 4. Active Portfolio / Projects
    const projects = await Project.find({ isActive: true })
      .select("title slug category description solution results techStack")
      .lean();

    for (const p of projects) {
      const techText = Array.isArray(p.techStack) ? p.techStack.join(", ") : "";
      const resultsText = Array.isArray(p.results) ? p.results.join(", ") : "";

      docs.push({
        id: `project-${p._id}`,
        type: "project",
        title: p.title,
        slug: p.slug,
        category: p.category || "Case Study",
        url: `/case-studies/${p.slug}`,
        description: p.description || "",
        body: `${p.solution || ""} ${resultsText} Tech: ${techText}`,
        keywords: [p.title, p.category, "case study", "project", ...(p.techStack || [])],
      });
    }

    // 5. Published Careers
    const careers = await CareerModel.find({
      status: "published",
      $or: [
        { publishedAt: null },
        { publishedAt: { $exists: false } },
        { publishedAt: { $lte: now } },
      ],
      $or: [
        { "application.deadline": null },
        { "application.deadline": { $exists: false } },
        { "application.deadline": { $gte: now } },
      ],
    })
      .select("jobTitle slug department employmentType workplaceType summary")
      .lean();

    for (const c of careers) {
      docs.push({
        id: `career-${c._id}`,
        type: "career",
        title: `${c.jobTitle} (${c.department})`,
        slug: c.slug,
        category: "Careers",
        url: `/careers/${c.slug}`,
        description: c.summary || `${c.jobTitle} opening at Kraviona.`,
        body: `${c.employmentType || ""} ${c.workplaceType || ""} in ${c.department || ""}`,
        keywords: [c.jobTitle, c.department, "job", "career", "hiring"],
      });
    }

    // 6. Active Team
    const teamMembers = await TeamMemberModel.find({ status: "active" })
      .select("name slug designation bio")
      .lean();

    for (const t of teamMembers) {
      docs.push({
        id: `team-${t._id}`,
        type: "team",
        title: `${t.name} - ${t.designation}`,
        slug: t.slug,
        category: "Team",
        url: "/team",
        description: t.bio || `${t.name}, ${t.designation} at Kraviona.`,
        body: t.bio || "",
        keywords: [t.name, t.designation, "team", "leader"],
      });
    }
  }
} catch (error) {
    console.error("[Chatbot Index Error] Failed building dynamic index:", error?.message);
  }

  // Pre-tokenize docs for rapid BM25 / token matching
  const processedDocs = docs.map((doc) => {
    const titleTokens = tokenize(doc.title);
    const kwTokens = (doc.keywords || []).flatMap(tokenize);
    const descTokens = tokenize(doc.description);
    const bodyTokens = tokenize(doc.body || "");

    return {
      ...doc,
      titleTokens,
      kwTokens,
      descTokens,
      bodyTokens,
    };
  });

  knowledgeIndex = processedDocs;
  lastIndexTime = Date.now();
  return knowledgeIndex;
};

/**
 * Returns cached knowledge index or rebuilds if stale.
 */
export const getKnowledgeIndex = async () => {
  if (!knowledgeIndex || Date.now() - lastIndexTime > INDEX_TTL_MS) {
    await buildKnowledgeIndex();
  }
  return knowledgeIndex;
};

/**
 * Invalidate index cache so newly published content is instantly available.
 */
export const invalidateChatbotIndex = () => {
  knowledgeIndex = null;
  lastIndexTime = 0;
};

/**
 * RAG Search: Scores documents based on query relevance
 */
export const searchKnowledgeBase = async (queryText) => {
  const index = await getKnowledgeIndex();
  const allTokens = tokenize(queryText, false);
  const meaningfulTokens = tokenize(queryText, true);
  const queryTokens = meaningfulTokens.length ? meaningfulTokens : allTokens;

  if (!queryTokens.length) return [];

  // If query contains zero meaningful tokens and no direct brand keywords, don't match random docs
  if (!meaningfulTokens.length && !allTokens.some((t) => ["kraviona", "service", "services", "contact", "about", "seo", "blog", "news", "project", "career"].includes(t))) {
    return [];
  }

  const scoredDocs = [];

  for (const doc of index) {
    let score = 0;
    const matchedTokens = new Set();

    for (const token of queryTokens) {
      // 1. Exact match in title (High weight: 10 pts)
      if (doc.titleTokens.includes(token)) {
        score += 10;
        matchedTokens.add(token);
      } else if (token.length >= 4 && doc.titleTokens.some((t) => t.length >= 4 && (t.startsWith(token) || token.startsWith(t)))) {
        score += 5;
        matchedTokens.add(token);
      }

      // 2. Keyword match (Weight: 6 pts)
      if (doc.kwTokens.includes(token)) {
        score += 6;
        matchedTokens.add(token);
      } else if (token.length >= 4 && doc.kwTokens.some((t) => t.length >= 4 && (t.startsWith(token) || token.startsWith(t)))) {
        score += 3;
        matchedTokens.add(token);
      }

      // 3. Description match (Weight: 3 pts)
      if (doc.descTokens.includes(token)) {
        score += 3;
        matchedTokens.add(token);
      }

      // 4. Body content match (Weight: 1 pt)
      if (doc.bodyTokens.includes(token)) {
        score += 1;
        matchedTokens.add(token);
      }
    }

    // Give bonus for matching multiple distinct query tokens
    if (matchedTokens.size > 1) {
      score *= 1.25 * matchedTokens.size;
    }

    if (score > 0) {
      scoredDocs.push({ ...doc, score });
    }
  }

  scoredDocs.sort((a, b) => b.score - a.score);
  return scoredDocs.slice(0, 4); // Top 4 most relevant chunks
};

/**
 * Attempt to query local Ollama / llama.cpp if available
 */
const queryLocalModel = async (userQuery, contextSnippets, languageMode) => {
  const localUrl = process.env.LOCAL_AI_URL || "http://localhost:11434";
  const modelName = process.env.LOCAL_AI_MODEL || "qwen2.5:0.5b";

  const contextText = contextSnippets
    .map(
      (s) =>
        `Title: ${s.title}\nURL: ${s.url}\nType: ${s.type}\nContent: ${s.description}\n${s.body ? s.body.slice(0, 300) : ""}`
    )
    .join("\n\n---\n\n");

  const systemInstruction = `You are the official Kraviona Tech Solutions public website AI assistant.
Your goal is to help visitors by answering questions ONLY using the verified public website context below.

STRICT RULES:
1. Never invent facts. Answer directly and concisely based ONLY on the provided context.
2. If the answer is NOT present in the provided context, respond EXACTLY with:
   "Is information ke baare mein mujhe website par koi verified public content nahi mila."
3. Respond in the same language as the user (${languageMode === "hinglish" ? "Hinglish / Hindi" : "English"}).
4. Always provide the exact clickable markdown link for the related page from the context (e.g. [Page Title](${contextSnippets[0]?.url || "/services"})).
5. Never talk about admin credentials, private configs, or internal server details.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s max

  try {
    const response = await fetch(`${localUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: systemInstruction },
          {
            role: "user",
            content: `Context:\n${contextText}\n\nUser Question:\n${userQuery}`,
          },
        ],
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 250,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const rawAnswer = data.message?.content?.trim();
      if (rawAnswer && rawAnswer.length > 10) {
        return rawAnswer;
      }
    }
  } catch (err) {
    // Local Ollama not running or timed out - graceful fallback
  } finally {
    clearTimeout(timeoutId);
  }

  return null;
};

// Direct Intent Matcher for high-accuracy, human-grade conversational responses
const matchDirectIntent = (query, hinglish) => {
  const q = query.toLowerCase().trim();

  // 1. Thanks & Goodbye
  if (/\b(thank(s|\s+you)?|dhanyawad|shukriya|bye|goodbye|alvida|ok|okay|theek\s+hai|thik\s+hai)\b/i.test(q)) {
    return {
      reply: hinglish
        ? "Aapka swagat hai! 🙏 Agar aapko aur koi jaankari chahiye ho ya naya project discuss karna ho, Kraviona hamesha madad ke liye tayyar hai. Shubh din!"
        : "You're very welcome! If you need any more information or want to discuss a project, Kraviona is always here to help. Have a wonderful day! 😊",
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "courtesy",
    };
  }

  // 2. Greetings & Who are you
  if (
    /\b(hi|hello|hey|namaste|greetings|good\s+(morning|afternoon|evening|day)|who are you|what can you do|help|madad|kaise ho|kya haal hai|aap kaun ho)\b/i.test(q)
  ) {
    return {
      reply: hinglish
        ? `Namaste! 👋 Main Kraviona ka AI Assistant hoon.\n\nMain aapki in topics par madad kar sakta hoon:\n• **Web Development**: Next.js 14/15, React, Node.js & MERN stack web apps\n• **Technical SEO**: Core Web Vitals (90+ speed), Schema & Google search ranking\n• **AI Automations**: Custom business workflows & intelligent integrations\n• **Pricing & Consultation**: Free customized proposal & timeline\n\nAapko kis baare mein jaankari chahiye?`
        : `Hello! 👋 I'm Kraviona's AI Assistant.\n\nI can assist you with:\n• **Web Engineering**: High-performance Next.js 14/15 & MERN stack applications\n• **Technical SEO**: Core Web Vitals (90+ score), speed architecture & search visibility\n• **AI Workflows**: Custom automation systems & intelligent API integrations\n• **Portfolio & Estimates**: Client case studies, estimates, and consultations\n\nHow can I help you today?`,
      sources: [
        { title: "Services", url: "/services", category: "Services", type: "page" },
        { title: "Case Studies", url: "/case-studies", category: "Portfolio", type: "page" },
        { title: "Contact", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "greeting",
    };
  }

  // 3. Services Overview / Kya karte ho / What do you do
  if (/\b(service|services|kya karte ho|kya karta hai|what do you do|what does kraviona do|what do you offer|what services|offerings|solutions|capabilities|features)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona Tech Solutions ye core digital engineering services provide karta hai:\n\n• **Full-Stack Web Development**: Next.js 14/15, React, Node.js & MERN stack web applications\n• **Technical SEO**: Core Web Vitals (90+ mobile speed), Schema markup & search visibility\n• **AI Automations & Workflows**: Custom AI agents, LLM integrations & workflow automation\n• **UI/UX Design**: Modern, responsive Figma designs & conversion-focused interfaces\n• **Custom APIs & Cloud**: Scalable backend architectures & database engineering\n\nFull details ke liye explore karein: [Kraviona Services](/services)`
        : `Kraviona Tech Solutions delivers 5 core digital engineering services:\n\n• **Full-Stack Web Development**: High-performance Next.js 14/15, React, Node.js & MERN stack apps\n• **Technical SEO**: Core Web Vitals speed optimization (90+ mobile), structured schema & search rankings\n• **AI Automations & Workflows**: Tailored business automation, custom agents & LLM integrations\n• **UI/UX Design**: High-converting, modern design systems & responsive interfaces\n• **API & Cloud Architecture**: Scalable microservices, REST/GraphQL APIs & database systems\n\nExplore all solutions on our [Services Page](/services).`,
      sources: [
        { title: "Services", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-services",
    };
  }

  // 4. New Project / Website Banwani Hai / Hire
  if (
    /\b(banwani|banwana|banana|banaye|banao)\b/i.test(q) ||
    (/\b(website|web\s*site|web\s*app|app|software|project)\b/i.test(q) && /\b(build|make|create|develop|need|want|chahiye|start|new)\b/i.test(q)) ||
    /\b(hire|developer|quote|quotation|proposal|start project|project discuss)\b/i.test(q)
  ) {
    return {
      reply: hinglish
        ? `Kraviona Tech Solutions aapki requirement ke mutabik high-speed, custom website aur web apps engineer karta hai!\n\nAap humari engineering team se direct connect kar sakte hain:\n• **WhatsApp / Call**: [+91 96085 53167](tel:+919608553167)\n• **Official Email**: [kravionatech@gmail.com](mailto:kravionatech@gmail.com)\n• **Contact Page**: [Requirement Form Bharein](/contact)\n\nHumari team 24 hours ke andar customized quote aur timeline ke saath aapse connect karegi.`
        : `We would love to engineer your project! Kraviona specializes in modern, high-speed Next.js websites and scalable MERN stack web apps.\n\nConnect directly with our engineering team:\n• **Email**: [kravionatech@gmail.com](mailto:kravionatech@gmail.com)\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Online Inquiry**: [Fill Out Our Contact Form](/contact)\n\nOur team will review your specifications and get back to you within 24 hours with a custom proposal.`,
      sources: [
        { title: "Contact Kraviona", url: "/contact", category: "Contact", type: "page" },
        { title: "Services", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-project",
    };
  }

  // 5. Contact / Phone / Email / WhatsApp
  if (/\b(contact|phone|number|email|call|whatsapp|reach|sampark|touch)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona Tech Solutions se in channels ke through direct connect kar sakte hain:\n\n• **Official Email**: [kravionatech@gmail.com](mailto:kravionatech@gmail.com)\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Headquarters**: Noida, Delhi NCR, India\n• **Online Form**: [Contact Page Par Jaayein](/contact)\n\nHum har query ka javab 24 hours ke andar dete hain.`
        : `You can reach Kraviona Tech Solutions directly through:\n\n• **Email**: [kravionatech@gmail.com](mailto:kravionatech@gmail.com)\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Headquarters**: Noida, Delhi NCR, India\n• **Online Form**: [Contact Us](/contact)\n\nOur engineering team typically responds within 24 hours.`,
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "intent-contact",
    };
  }

  // 6. Location / Office / Address
  if (/\b(location|address|where|kahan|office|noida|delhi|headquarters)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona Tech Solutions ka primary office **Delhi NCR (Noida, Uttar Pradesh, India)** mein sthit hai.\n\nHum poore India aur international clients ke saath remotely aur project-based collaborate karte hain.\n\nConnect karne ke liye: [Contact Us](/contact) ya email karein [kravionatech@gmail.com](mailto:kravionatech@gmail.com).`
        : `Kraviona Tech Solutions is headquartered in **Delhi NCR (Noida, Uttar Pradesh, India)**.\n\nWe engineer web solutions and handle technical SEO for clients across India and globally through modern remote workflows.\n\nGet in touch at [kravionatech@gmail.com](mailto:kravionatech@gmail.com) or visit our [Contact Page](/contact).`,
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "intent-location",
    };
  }

  // 7. Pricing / Cost / Rates / Packages
  if (/\b(price|pricing|cost|charge|charges|rate|rates|fee|fees|kitna kharcha|kitna lagega|budget|paisa|package|packages)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona transparent aur competitive pricing offer karta hai:\n\n• **Project-Based**: Fixed pricing for new website development, web apps, ya complete redesign\n• **Monthly Retainer**: Technical SEO, site performance monitoring, aur ongoing updates\n• **Custom AI Solutions**: Workflow complexity aur API needs ke mutabik\n\nApne project ka free customized quote lene ke liye humare [Contact Page](/contact) par details share karein ya [+91 96085 53167](tel:+919608553167) par sampark karein.`
        : `Kraviona offers clear, value-driven pricing:\n\n• **Project-Based**: Fixed quotes for new web builds, Next.js migrations, or custom web apps\n• **Monthly Retainers**: For ongoing Technical SEO audits, site speed optimization, and search rankings\n• **Custom AI Solutions**: Tailored to scope, agents, and API integrations\n\nFor a free tailored quotation, submit your project details on our [Contact Page](/contact) or email [kravionatech@gmail.com](mailto:kravionatech@gmail.com).`,
      sources: [
        { title: "Contact for Quote", url: "/contact", category: "Pricing", type: "page" },
        { title: "Services", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-pricing",
    };
  }

  // 8. Web Development / Next.js / React / MERN
  if (/\b(web dev|web development|nextjs|next\.js|react|mern|frontend|backend|node|full stack)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Hum modern Next.js 14/15, React, Node.js, Express aur MongoDB (MERN stack) par high-performance web applications develop karte hain.\n\nHar application sub-second page loads, SEO-friendly architecture, aur sleek responsive design ke saath aati hai.\n\nExplore karein: [Services](/services) ya discuss karein apna project: [Contact Page](/contact).`
        : `Kraviona specializes in modern web engineering using Next.js 14/15, React.js, Node.js, Express, and MongoDB. We build ultra-fast, accessible, and scalable platforms with enterprise-grade quality.\n\nExplore our web development services on our [Services Page](/services).`,
      sources: [
        { title: "Web Development Services", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-webdev",
    };
  }

  // 9. Technical SEO / Ranking / Speed
  if (/\b(seo|technical seo|ranking|google ranking|core web vitals|page speed|traffic|organic)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona Technical SEO aur site speed optimization mein specialize karta hai:\n\n• **Core Web Vitals**: Mobile aur Desktop par 90+ speed score guarantee\n• **Schema & Structured Data**: Rich snippets aur Google search indexing optimize karna\n• **Crawl & Indexing Audits**: Broken links, redirects, aur site architecture fix karna\n\nAur jaankari ke liye visit karein: [Services](/services).`
        : `Kraviona's Technical SEO practice focuses on data-driven search growth:\n\n• **Core Web Vitals**: 90+ mobile & desktop speed scores guaranteed\n• **Structured Schema**: Rich snippets and comprehensive Schema.org markup\n• **Crawl Architecture**: Optimizing crawl budgets, internal links, and indexation\n\nLearn more on our [Services Page](/services).`,
      sources: [
        { title: "SEO Services", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-seo",
    };
  }

  // 10. AI Automation / Workflows
  if (/\b(ai|artificial intelligence|automations?|workflows?|llms?|chatbots?|agents?|machine learning)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Hum custom AI workflows, intelligent chat assistants, scrapers aur LLM API integrations design karte hain jo aapke business operations ko scale aur automate karte hain.\n\nExplore karein: [Services](/services) ya reach out karein: [Contact](/contact).`
        : `We engineer bespoke AI automation systems, intelligent customer chat assistants, workflow pipelines, and custom LLM integrations that streamline repetitive business tasks.\n\nLearn more on our [Services Page](/services).`,
      sources: [
        { title: "AI Services", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-ai",
    };
  }

  // 11. Portfolio / Case Studies / Projects
  if (/\b(portfolio|case studies|case study|projects|past work|clients|samples|kya banaya)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona ke real-world client projects, architectural transformations aur SEO growth case studies dekh sakte hain:\n\n• [Case Studies Page Par Jaayein](/case-studies)\n\nKisi specific project ya live demo ke baare mein baat karne ke liye connect karein: [Contact Us](/contact).`
        : `Explore real-world client implementations, architectural transformations, and SEO scale-ups engineered by Kraviona Tech Solutions:\n\n• [Explore All Case Studies](/case-studies)\n\nInterested in building something similar? Connect with us on our [Contact Page](/contact).`,
      sources: [
        { title: "Case Studies", url: "/case-studies", category: "Portfolio", type: "page" },
      ],
      type: "intent-portfolio",
    };
  }

  // 12. Careers / Jobs / Hiring
  if (/\b(career|careers|job|jobs|hiring|internship|openings?|apply|work with us)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona engineering, SEO aur AI talents ko hire karta rehta hai!\n\nOpen roles dekhne aur direct apply karne ke liye visit karein:\n• [Kraviona Careers Page](/careers)\n\nAap apna resume [kravionatech@gmail.com](mailto:kravionatech@gmail.com) par bhi email kar sakte hain.`
        : `We are always looking for passionate engineers and digital specialists in frontend, backend, SEO, and AI engineering.\n\nExplore our open roles and apply at:\n• [Careers at Kraviona](/careers)\n\nYou can also share your resume directly at [kravionatech@gmail.com](mailto:kravionatech@gmail.com).`,
      sources: [
        { title: "Careers", url: "/careers", category: "Careers", type: "page" },
      ],
      type: "intent-careers",
    };
  }

  // 13. About / Company / Founder
  if (/\b(about|kraviona|company|who are you|founder|agency)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `**Kraviona Tech Solutions** ek premier digital engineering aur technical SEO agency hai jo Delhi NCR (Noida, India) mein based hai. Hum high-performance Next.js web applications, MERN stack software, aur data-driven SEO architectures deliver karte hain.\n\nAur jaankari ke liye visit karein: [About Kraviona](/about).`
        : `**Kraviona Tech Solutions** is a premier digital engineering and technical SEO agency based in Delhi NCR (Noida, India). We engineer high-performance web applications, scalable backend APIs, and modern search growth architectures.\n\nLearn more on our [About Page](/about).`,
      sources: [
        { title: "About Us", url: "/about", category: "Company", type: "page" },
        { title: "Services", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-about",
    };
  }

  return null;
};

/**
 * Built-in Local Extractive & Synthesis Engine
 * Clean, readable sentences without raw markdown hash headers.
 */
const synthesizeLocalResponse = (query, relevantDocs, hinglish) => {
  if (!relevantDocs || relevantDocs.length === 0) {
    return {
      reply: hinglish
        ? `Is topic ke baare mein website par specific public content nahi mila.\n\nLekin main Kraviona ki **Web Development**, **Technical SEO**, **Pricing**, ya **Contact** details ke baare mein aapki poori madad kar sakta hoon.\n\nAap humari team se direct sampark kar sakte hain: [Contact Page](/contact) ya WhatsApp [+91 96085 53167](tel:+919608553167).`
        : `I couldn't find a specific page on our website regarding that question.\n\nHowever, I can help you with details on:\n• Our Next.js & MERN web development services ([View Services](/services))\n• Technical SEO and site speed optimization\n• Project pricing and past client results ([Case Studies](/case-studies))\n• Reaching our engineering team directly ([Contact Us](/contact))\n\nFeel free to ask about any of the above!`,
      sources: [],
      type: "unmatched",
    };
  }

  const primary = relevantDocs[0];
  const sources = relevantDocs.map((d) => ({
    title: d.title,
    url: d.url,
    category: d.category,
    type: d.type,
  }));

  let responseText = `**${primary.title}**\n${primary.description}\n\n`;

  if (primary.url) {
    responseText += `• [Read more on ${primary.title}](${primary.url})\n`;
  }

  if (relevantDocs.length > 1) {
    responseText += `\n**Related Resources:**\n`;
    relevantDocs.slice(1, 3).forEach((doc) => {
      responseText += `• [${doc.title}](${doc.url})\n`;
    });
  }

  return { reply: responseText, sources, type: "local-rag" };
};

/**
 * Main Public Chat Processor
 */
export const processChatQuery = async (userQuery) => {
  const trimmed = String(userQuery || "").trim();
  const hinglish = isHindiOrHinglish(trimmed);

  // 1. Check high-precision direct intent
  const directResponse = matchDirectIntent(trimmed, hinglish);
  if (directResponse) {
    return directResponse;
  }

  // 2. Search knowledge base
  const relevantDocs = await searchKnowledgeBase(trimmed);

  // 3. Strict grounding test: if no docs found or relevance is too low
  if (!relevantDocs || relevantDocs.length === 0 || relevantDocs[0].score < 4) {
    return synthesizeLocalResponse(trimmed, [], hinglish);
  }

  // 4. Try Local Ollama / SLM model if available on server
  const localModelReply = await queryLocalModel(
    trimmed,
    relevantDocs,
    hinglish ? "hinglish" : "english"
  );

  const sources = relevantDocs.map((d) => ({
    title: d.title,
    url: d.url,
    category: d.category,
    type: d.type,
  }));

  if (localModelReply) {
    return {
      reply: localModelReply,
      sources,
      type: "local-slm",
    };
  }

  // 5. Built-in Local Synthesis without raw hash headers
  return synthesizeLocalResponse(trimmed, relevantDocs, hinglish);
};

/**
 * Common quick questions for the chatbot suggestions
 */
export const getChatSuggestions = () => [
  "What services do you offer?",
  "How can I contact the team?",
  "What are your pricing plans?",
  "Where is Kraviona located?",
  "View portfolio case studies",
];
