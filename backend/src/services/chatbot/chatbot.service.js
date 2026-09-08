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

// Static company info
const STATIC_KRAVIONA_KNOWLEDGE = [
  {
    id: "static-about",
    type: "page",
    title: "About Kraviona Tech Solutions",
    category: "Company",
    url: "/about",
    description:
      "Kraviona Tech Solutions is a premier digital engineering and technical SEO agency based in Delhi NCR (Noida, India). We engineer high-performance MERN stack applications, modern Next.js websites, technical SEO architectures, AI automation solutions, and scalable cloud-ready backend platforms.",
    keywords: ["about kraviona", "company info", "what is kraviona", "who are you", "kraviona tech solutions", "location", "noida", "delhi ncr"],
  },
  {
    id: "static-contact",
    type: "page",
    title: "Contact Information & Inquiries",
    category: "Contact",
    url: "/contact",
    description:
      "You can connect with Kraviona Tech Solutions directly. Official Email: kravionatech@gmail.com, Official Phone: +91 96085 53167. Location: Delhi NCR / Noida, India. You can also reach out via WhatsApp through the floating icon on our website.",
    keywords: ["contact", "email", "phone number", "call", "address", "reach out", "support", "office location", "whatsapp"],
  },
  {
    id: "static-services-overview",
    type: "page",
    title: "Kraviona Services Overview",
    category: "Services",
    url: "/services",
    description:
      "Kraviona provides comprehensive digital services including: 1. Full-Stack Web Development (Next.js, React, Node.js, Express, MongoDB), 2. Advanced Technical SEO & Core Web Vitals Optimization, 3. Custom AI Automation & Workflows, 4. UI/UX Design & Prototyping, 5. Custom API Development & System Integration.",
    keywords: ["services", "what do you offer", "web development", "seo", "ai automation", "mern stack", "hire developers"],
  },
  {
    id: "static-pricing",
    type: "page",
    title: "Pricing & Service Packages",
    category: "Pricing",
    url: "/pricing",
    description:
      "Kraviona offers flexible project-based and dedicated retainer pricing for web development, technical SEO, and AI automation. Contact our team at kravionatech@gmail.com or visit /contact for a custom estimate tailored to your requirements.",
    keywords: ["pricing", "cost", "rates", "packages", "hire", "charges", "how much"],
  },
  {
    id: "static-case-studies",
    type: "page",
    title: "Case Studies & Portfolio",
    category: "Portfolio",
    url: "/case-studies",
    description:
      "Explore real-world client implementations, architectural transformations, SEO scale-ups, and modern web application builds engineered by Kraviona Tech Solutions.",
    keywords: ["portfolio", "case studies", "projects", "work", "past work", "clients", "samples"],
  },
  {
    id: "static-careers",
    type: "page",
    title: "Careers at Kraviona",
    category: "Careers",
    url: "/careers",
    description:
      "Join the Kraviona engineering and digital growth team. Check out our open roles in frontend, backend, SEO, and AI engineering on our Careers page.",
    keywords: ["careers", "jobs", "hiring", "openings", "join team", "work with us", "internship"],
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
  "i", "it", "its", "this", "that", "these", "those", "please", "hello", "hi",
  "hey", "kya", "hai", "hain", "ka", "ki", "ke", "ko", "se", "me", "mein",
  "par", "batao", "mujhe", "chahiye", "kar", "kare", "karna"
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
    "kaha", "kaha se", "kaun", "kare", "sakta", "sakte", "mera", "meri",
    "banao", "banwana", "kharidna", "rate", "paisa", "kitna", "namaste"
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

// Conversational greetings & introductory queries
const GREETING_PATTERNS = [
  /^(hi|hello|hey|greetings|namaste|good\s+(morning|afternoon|evening|day))\b/i,
  /^(who are you|what can you do|how can you help|help me|what is your name)\b/i,
];

const handleGreeting = (query) => {
  const isGreeting = GREETING_PATTERNS.some((pattern) => pattern.test(query.trim()));
  if (!isGreeting) return null;

  return {
    reply: `Hello! 👋 I'm Kraviona's AI Assistant, designed to help you navigate our services, case studies, and published insights.

How can I assist you today? You can ask me about:
• **Full-Stack Engineering**: Next.js, React.js, Node.js, and high-scale MERN products.
• **Technical SEO**: Core Web Vitals optimization, site speed architecture, and search visibility.
• **AI Automation**: Tailored business workflows and AI-driven systems.
• **Projects & Insights**: Explore our recent [Case Studies](/case-studies) or read our latest [Tech Articles](/blog).

Feel free to ask any question or tap a suggested topic below!`,
    sources: [
      { title: "Services", url: "/services", category: "Services", type: "page" },
      { title: "Case Studies", url: "/case-studies", category: "Portfolio", type: "page" },
      { title: "Contact", url: "/contact", category: "Contact", type: "page" },
    ],
    type: "greeting",
  };
};

/**
 * Built-in Local Extractive & Synthesis Engine (Claude / ChatGPT Style)
 * Professional English tone, formatted bullets, verified hyperlinks.
 */
const synthesizeLocalResponse = (query, relevantDocs) => {
  if (!relevantDocs || relevantDocs.length === 0) {
    return {
      reply: `I couldn't find verified public information regarding that question on our website.

As Kraviona's AI Assistant, I can provide information about our web development services, technical SEO audits, portfolio case studies, and published articles. 

If you have a custom project inquiry, you can connect directly with our team at [kravionatech@gmail.com](mailto:kravionatech@gmail.com) or visit our [Contact Page](/contact).`,
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

  let responseText = `Here is what I found on Kraviona's official website:\n\n### **${primary.title}**\n${primary.description}\n\n`;

  if (relevantDocs.length > 1) {
    responseText += `**Explore Related Resources:**\n`;
    relevantDocs.forEach((doc) => {
      responseText += `• [${doc.title}](${doc.url}) — *${doc.category || "Website resource"}*\n`;
    });
  } else {
    responseText += `For complete details and specifications, explore: [${primary.title}](${primary.url})`;
  }

  return { reply: responseText, sources, type: "local-rag" };
};

/**
 * Main Public Chat Processor
 */
export const processChatQuery = async (userQuery) => {
  const trimmed = String(userQuery || "").trim();

  // 1. Conversational Greeting check (Claude / ChatGPT style)
  const greetingResponse = handleGreeting(trimmed);
  if (greetingResponse) {
    return greetingResponse;
  }

  // 2. Search knowledge base
  const relevantDocs = await searchKnowledgeBase(trimmed);

  // 3. Strict grounding test: if no docs found or relevance is too low
  if (!relevantDocs || relevantDocs.length === 0 || relevantDocs[0].score < 5) {
    return {
      reply: `I couldn't find verified public information regarding that topic on our website.

As Kraviona's AI Assistant, I can help you with details on:
• Our Next.js & MERN web development offerings ([View Services](/services))
• Technical SEO and site speed optimization
• Past client results and case studies ([Case Studies](/case-studies))
• Reaching our engineering team ([Contact Us](/contact))

Feel free to ask about any of the above!`,
      sources: [],
      type: "unmatched",
    };
  }

  // 4. Try Local Ollama / SLM model if available on server
  const localModelReply = await queryLocalModel(
    trimmed,
    relevantDocs,
    "english"
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

  // 5. Built-in Local Claude/ChatGPT-Style Synthesis
  return synthesizeLocalResponse(trimmed, relevantDocs);
};

/**
 * Common quick questions for the chatbot suggestions
 */
export const getChatSuggestions = () => [
  "What services does Kraviona offer?",
  "How can I contact Kraviona?",
  "Read latest MERN stack & SEO blog posts",
  "Where is Kraviona located?",
  "Do you provide Next.js web development?",
];
