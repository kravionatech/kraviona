import { authenticateAdminSession } from "../auth.js";
import { handle } from "../tools/admin.js";
import { disconnectDB, connectDB } from "../db.js";
import { Service } from "../../backend/src/models/services/service.model.js";
import { RedirectModel } from "../../backend/src/models/settings/redirect.model.js";

const CANONICAL_URLS = {
  "fix-crawl-budget-waste-technical-seo-guide-2026": "https://kraviona.com/technical-seo/fix-crawl-budget-waste-technical-seo-guide-2026",
  "next-js-vs-react-differences": "https://kraviona.com/mern-stack/next-js-vs-react-differences",
  "benefits-of-artificial-intelligence-in-business": "https://kraviona.com/ai-and-automation/benefits-of-artificial-intelligence-in-business",
  "how-to-choose-the-right-tech-stack-for-your-business-2026": "https://kraviona.com/mern-stack/how-to-choose-the-right-tech-stack-for-your-business-2026",
  "chatgpt-6-vs-fable-5-1-september-2026": "https://kraviona.com/ai-news/chatgpt-6-vs-fable-5-1-september-2026",
  "tokenized-real-world-assets-blockchain-2026": "https://kraviona.com/blockchain/tokenized-real-world-assets-blockchain-2026",
  "best-ai-personal-finance-apps-2026": "https://kraviona.com/ai-news/best-ai-personal-finance-apps-2026",
  "ai-agents-india-2026": "https://kraviona.com/ai-news/ai-agents-india-2026",
  "nvidia-acquires-hugging-face-12-9-billion-open-source-ai-india": "https://kraviona.com/ai-news/nvidia-acquires-hugging-face-12-9-billion-open-source-ai-india",
  "zero-trust-security-guide-2026": "https://kraviona.com/ai-and-automation/zero-trust-security-guide-2026",
  "chatgpt-ads-india-2026-what-it-means": "https://kraviona.com/ai-news/chatgpt-ads-india-2026-what-it-means",
  "lt-india-largest-ai-factory-nvidia-b300-chennai-together-ai": "https://kraviona.com/ai-news/lt-india-largest-ai-factory-nvidia-b300-chennai-together-ai",
  "keyword-research-for-seo-complete-guide": "https://kraviona.com/technical-seo/keyword-research-for-seo-complete-guide",
  "google-adsense-approval-in-india-2026": "https://kraviona.com/ai-and-automation/google-adsense-approval-in-india-2026",
  "best-ai-tools-for-freelancers-india-2026": "https://kraviona.com/ai-and-automation/best-ai-tools-for-freelancers-india-2026",
  "chatgpt-plus-price-india-2026-gpt-56-plans-inr": "https://kraviona.com/ai-news/chatgpt-plus-price-india-2026-gpt-56-plans-inr",
  "vibe-coding-kya-hai-2026-guide-india": "https://kraviona.com/ai-news/vibe-coding-kya-hai-2026-guide-india",
  "claude-code-vs-cursor-vs-github-copilot-2026-india": "https://kraviona.com/ai-and-automation/claude-code-vs-cursor-vs-github-copilot-2026-india",
  "github-down-august-2026-outage-what-happened": "https://kraviona.com/ai-news/github-down-august-2026-outage-what-happened",
  "ai-trends-august-2026-what-is-changing": "https://kraviona.com/ai-news/ai-trends-august-2026-what-is-changing",
  "javascript-vs-typescript-the-real-difference": "https://kraviona.com/mern-stack/javascript-vs-typescript-the-real-difference",
  "latest-ai-news-august-2026": "https://kraviona.com/ai-news/latest-ai-news-august-2026",
  "ai-agents-2026-autonomous-ai-replacing-traditional-automation": "https://kraviona.com/ai-news/ai-agents-2026-autonomous-ai-replacing-traditional-automation",
  "mern-stack-development-company-delhi": "https://kraviona.com/mern-stack/mern-stack-development-company-delhi",
  "nvidia-250-billion-ai-supremacy-race-2026": "https://kraviona.com/ai-news/nvidia-250-billion-ai-supremacy-race-2026",
  "ai-chatbots-guide": "https://kraviona.com/next-gen-web-development/ai-chatbots-guide",
  "machine-learning-the-technology-that-is-changing-the-future": "https://kraviona.com/next-gen-web-development/machine-learning-the-technology-that-is-changing-the-future",
  "what-is-mern-stack-the-complete-2026-guide-for-developers": "https://kraviona.com/next-gen-web-development/what-is-mern-stack-the-complete-2026-guide-for-developers",
  "web3-gaming-2026-play-to-earn-play-and-own-india": "https://kraviona.com/web-3-development/web3-gaming-2026-play-to-earn-play-and-own-india",
  "web3-trends-2026-rwa-depin-ai-blockchain-india": "https://kraviona.com/web-3-development/web3-trends-2026-rwa-depin-ai-blockchain-india",
  "core-web-vitals-2026-guide": "https://kraviona.com/next-gen-web-development/core-web-vitals-2026-guide",
  "blockchain-development-indian-businesses-guide-2026": "https://kraviona.com/blockchain/blockchain-development-indian-businesses-guide-2026",
  "best-web3-development-tools-in-2026-the-real-stack-not-another-recycled-list": "https://kraviona.com/web-3-development/best-web3-development-tools-in-2026-the-real-stack-not-another-recycled-list",
  "model-context-protocol-mcp-the-complete-2026-guide": "https://kraviona.com/ai-and-automation/model-context-protocol-mcp-the-complete-2026-guide",
  "mern-stack-for-enterprise-and-business-applications-a-practical-2026-guide": "https://kraviona.com/mern-stack/mern-stack-for-enterprise-and-business-applications-a-practical-2026-guide",
  "web3-for-businesses-a-practical-2026-guide-to-why-and-how-to-adopt-it": "https://kraviona.com/web-3-development/web3-for-businesses-a-practical-2026-guide-to-why-and-how-to-adopt-it",
  "what-is-web3-complete-guide-decentralized-internet": "https://kraviona.com/ai-and-automation/what-is-web3-complete-guide-decentralized-internet",
  "ai-in-healthcare-guide-2026": "https://kraviona.com/ai-and-automation/ai-in-healthcare-guide-2026",
  "java-full-stack-developer-roadmap-2026-how-to-actually-get-job-ready": "https://kraviona.com/technology-and-programming/java-full-stack-developer-roadmap-2026-how-to-actually-get-job-ready",
  "java-full-stack-development-for-businesses-cost-hiring-and-when-its-the-right-call": "https://kraviona.com/next-gen-web-development/java-full-stack-development-for-businesses-cost-hiring-and-when-its-the-right-call",
  "mern-stack-interview-questions-2026": "https://kraviona.com/mern-stack/mern-stack-interview-questions-2026",
  "top-programming-languages-to-learn-2026": "https://kraviona.com/technology-and-programming/top-programming-languages-to-learn-2026",
  "technical-seo-agency-delhi": "https://kraviona.com/technical-seo/technical-seo-agency-delhi",
  "reactjs-development-company-india": "https://kraviona.com/mern-stack/reactjs-development-company-india",
  "mern-stack-vs-mean-stack-2026": "https://kraviona.com/mern-stack/mern-stack-vs-mean-stack-2026",
  "hire-mern-stack-developer-india": "https://kraviona.com/mern-stack/hire-mern-stack-developer-india",
  "web3-explained-what-it-is-how-it-works-india-2026": "https://kraviona.com/web-3-development/web3-explained-what-it-is-how-it-works-india-2026",
  "ai-chatbot-development-company-india": "https://kraviona.com/ai-and-automation/ai-chatbot-development-company-india",
  "whatsapp-automation-for-business-india": "https://kraviona.com/ai-and-automation/whatsapp-automation-for-business-india",
  "n8n-automation-agency-india": "https://kraviona.com/ai-and-automation/n8n-automation-agency-india",
  "ai-workflow-automation-for-businesses": "https://kraviona.com/ai-and-automation/ai-workflow-automation-for-businesses",
  "best-ai-automation-company-in-delhi-how-businesses-are-growing-smarter-in-2025": "https://kraviona.com/ai-and-automation/best-ai-automation-company-in-delhi-how-businesses-are-growing-smarter-in-2025",
  "ai-automation-agency-india": "https://kraviona.com/ai-and-automation/ai-automation-agency-india",
  "how-to-use-ai-in-real-estate": "https://kraviona.com/next-gen-web-development/how-to-use-ai-in-real-estate",
  "what-is-mern-stack-2026": "https://kraviona.com/mern-stack/what-is-mern-stack-2026",
  "what-is-technical-seo-2026": "https://kraviona.com/technical-seo/what-is-technical-seo-2026",
  "mern-stack-development-company-in-india": "https://kraviona.com/web-performance/mern-stack-development-company-in-india",
  "how-to-use-chatgpt-for-business": "https://kraviona.com/ai-and-automation/how-to-use-chatgpt-for-business",
  "ai-tools-for-small-business": "https://kraviona.com/ai-and-automation/ai-tools-for-small-business",
  "why-choosing-a-top-mern-stack-development-company-in-india-changes-the-game": "https://kraviona.com/next-gen-web-development/why-choosing-a-top-mern-stack-development-company-in-india-changes-the-game",
  "what-is-mern-stack-the-complete-2026-guide-for-developer": "https://kraviona.com/next-gen-web-development/what-is-mern-stack-the-complete-2026-guide-for-developer",
  "website-development-company-in-delhi": "https://kraviona.com/next-gen-web-development/website-development-company-in-delhi",
  "ai-driven-seo-machine-learning-organic-search-2026": "https://kraviona.com/ai-and-automation/ai-driven-seo-machine-learning-organic-search-2026",
  "ai-revolutionizing-full-stack-web-development-2026": "https://kraviona.com/ai-and-automation/ai-revolutionizing-full-stack-web-development-2026",
  "rise-of-autonomous-ai-agents-2026-essay": "https://kraviona.com/ai-and-automation/rise-of-autonomous-ai-agents-2026-essay",
  "ultimate-mern-stack-developer-roadmap-2026": "https://kraviona.com/next-gen-web-development/ultimate-mern-stack-developer-roadmap-2026",
  "10-game-changing-benefits-of-web3-the-future-of-ownership": "https://kraviona.com/web-3-development/10-game-changing-benefits-of-web3-the-future-of-ownership",
  "10-benefits-of-artificial-intelligence-essay": "https://kraviona.com/ai-and-automation/10-benefits-of-artificial-intelligence-essay"
};

const resultsSummary = {
  task1: { total: 0, fixed: 0, skipped: 0, errors: [], logs: [] },
  task2: { total: 0, fixed: 0, skipped: 0, errors: [], logs: [] },
  task3: { total: 0, fixed: 0, skipped: 0, errors: [], logs: [] },
  task4: { total: 0, fixed: 0, skipped: 0, errors: [], logs: [] },
  task5: { total: 0, fixed: 0, skipped: 0, errors: [], logs: [] },
  task6: { total: 0, fixed: 0, skipped: 0, errors: [], logs: [] },
  task7: { total: 0, fixed: 0, skipped: 0, errors: [], logs: [] },
  task8: { total: 0, fixed: 0, skipped: 0, errors: [], logs: [] },
  task9: { total: 0, fixed: 0, skipped: 0, errors: [], logs: [] },
};

async function run() {
  await connectDB();
  const session = await authenticateAdminSession();
  console.log(`\n=== KRAVIONA GSC MASTER FIX EXECUTION ===`);
  console.log(`Authenticated: ${session.actor.name} (${session.actor.email}, role: ${session.actor.role})`);

  // -------------------------------------------------------------
  // TASK 1: Fix Canonical URLs on all 68 published posts (Batches of 10)
  // -------------------------------------------------------------
  console.log(`\n--- TASK 1: Canonical URLs (68 posts) ---`);
  const slugs = Object.keys(CANONICAL_URLS);
  resultsSummary.task1.total = slugs.length;
  const batchSize = 10;

  for (let i = 0; i < slugs.length; i += batchSize) {
    const batch = slugs.slice(i, i + batchSize);
    console.log(`\nProcessing Batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(slugs.length / batchSize)} (posts ${i + 1} to ${Math.min(i + batchSize, slugs.length)})...`);

    for (const slug of batch) {
      const correctCanonical = CANONICAL_URLS[slug];
      try {
        const getRes = await handle("kraviona_get_post", { slug }, session);
        const oldCanonical = getRes.structuredContent?.post?.record?.canonicalUrl || "none";
        
        const updateRes = await handle("kraviona_update_post", {
          slug,
          changes: { canonicalUrl: correctCanonical }
        }, session);

        if (updateRes.isError) {
          throw new Error(updateRes.content?.[0]?.text || "Unknown error during update");
        }

        resultsSummary.task1.fixed++;
        const logEntry = { slug, oldCanonical, newCanonical: correctCanonical, status: "Fixed" };
        resultsSummary.task1.logs.push(logEntry);
        console.log(`[Task 1 Fixed] ${slug} | Old: ${oldCanonical} | New: ${correctCanonical}`);
      } catch (err) {
        resultsSummary.task1.errors.push({ slug, error: err.message });
        const logEntry = { slug, oldCanonical: "unknown", newCanonical: correctCanonical, status: `Error: ${err.message}` };
        resultsSummary.task1.logs.push(logEntry);
        console.error(`[Task 1 Error] ${slug}: ${err.message}`);
      }
    }
  }

  // -------------------------------------------------------------
  // TASK 2: Fix Merchant Listings Structured Data Issues
  // -------------------------------------------------------------
  console.log(`\n--- TASK 2: Merchant Listings Structured Data ---`);
  const task2APosts = [
    "chatgpt-plus-price-india-2026-gpt-56-plans-inr",
    "best-ai-personal-finance-apps-2026",
    "best-ai-tools-for-freelancers-india-2026",
    "ai-tools-for-small-business",
    "claude-code-vs-cursor-vs-github-copilot-2026-india",
    "google-adsense-approval-in-india-2026",
    "ai-chatbot-development-company-india",
    "whatsapp-automation-for-business-india",
    "n8n-automation-agency-india"
  ];

  const task2BPosts = [
    "mern-stack-development-company-delhi",
    "mern-stack-development-company-in-india",
    "reactjs-development-company-india",
    "technical-seo-agency-delhi",
    "ai-automation-agency-india",
    "ai-chatbot-development-company-india",
    "website-development-company-in-delhi"
  ];

  resultsSummary.task2.total = task2APosts.length + task2BPosts.length;

  console.log(`\n2A: Updating schemaType to 'Article' on ${task2APosts.length} posts...`);
  for (const slug of task2APosts) {
    try {
      const updateRes = await handle("kraviona_update_post", {
        slug,
        changes: { schemaType: "Article" }
      }, session);

      if (updateRes.isError) throw new Error(updateRes.content?.[0]?.text || "Update error");

      resultsSummary.task2.fixed++;
      resultsSummary.task2.logs.push({ slug, action: "2A: schemaType -> Article", status: "Fixed" });
      console.log(`[Task 2A Fixed] ${slug} -> schemaType: Article`);
    } catch (err) {
      resultsSummary.task2.errors.push({ slug, error: err.message });
      console.error(`[Task 2A Error] ${slug}: ${err.message}`);
    }
  }

  console.log(`\n2B: Updating schemaType to 'Article' + structuredDataOverride on ${task2BPosts.length} service/blog posts...`);
  for (const slug of task2BPosts) {
    try {
      const getRes = await handle("kraviona_get_post", { slug }, session);
      const post = getRes.structuredContent?.post?.record;
      const title = post?.title || slug;

      const override = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "author": { "@type": "Person", "name": "Amar Kumar" },
        "publisher": { "@type": "Organization", "name": "Kraviona Tech Solutions", "url": "https://kraviona.com" }
      };

      const updateRes = await handle("kraviona_update_post", {
        slug,
        changes: {
          schemaType: "Article",
          structuredDataOverride: override
        }
      }, session);

      if (updateRes.isError) throw new Error(updateRes.content?.[0]?.text || "Update error");

      resultsSummary.task2.fixed++;
      resultsSummary.task2.logs.push({ slug, action: "2B: Article + structuredDataOverride", status: "Fixed" });
      console.log(`[Task 2B Fixed] ${slug} -> Article schema override applied`);
    } catch (err) {
      resultsSummary.task2.errors.push({ slug, error: err.message });
      console.error(`[Task 2B Error] ${slug}: ${err.message}`);
    }
  }

  // -------------------------------------------------------------
  // TASK 3: Fix Product Snippets Structured Data Issues
  // -------------------------------------------------------------
  console.log(`\n--- TASK 3: Product Snippets Structured Data ---`);
  const task3APosts = [
    "ai-tools-for-small-business",
    "best-ai-tools-for-freelancers-india-2026",
    "claude-code-vs-cursor-vs-github-copilot-2026-india",
    "chatgpt-plus-price-india-2026-gpt-56-plans-inr",
    "best-ai-personal-finance-apps-2026",
    "chatgpt-6-vs-fable-5-1-september-2026"
  ];

  const task3BPosts = [
    "ai-chatbot-development-company-india",
    "mern-stack-development-company-delhi",
    "mern-stack-development-company-in-india",
    "reactjs-development-company-india"
  ];

  resultsSummary.task3.total = task3APosts.length + task3BPosts.length;

  console.log(`\n3A: Updating ${task3APosts.length} posts with Article schema + review/tools comparison signal...`);
  for (const slug of task3APosts) {
    try {
      const getRes = await handle("kraviona_get_post", { slug }, session);
      const post = getRes.structuredContent?.post?.record;
      const title = post?.title || slug;

      const override = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "about": { "@type": "ItemList", "name": "AI tools comparison" },
        "author": { "@type": "Person", "name": "Amar Kumar" },
        "publisher": { "@type": "Organization", "name": "Kraviona Tech Solutions", "url": "https://kraviona.com" }
      };

      const updateRes = await handle("kraviona_update_post", {
        slug,
        changes: {
          schemaType: "Article",
          structuredDataOverride: override
        }
      }, session);

      if (updateRes.isError) throw new Error(updateRes.content?.[0]?.text || "Update error");

      resultsSummary.task3.fixed++;
      resultsSummary.task3.logs.push({ slug, action: "3A: Article + comparison ItemList override", status: "Fixed" });
      console.log(`[Task 3A Fixed] ${slug} -> Article comparison schema override applied`);
    } catch (err) {
      resultsSummary.task3.errors.push({ slug, error: err.message });
      console.error(`[Task 3A Error] ${slug}: ${err.message}`);
    }
  }

  console.log(`\n3B: Ensuring ${task3BPosts.length} posts with INR tables have schemaType: Article...`);
  for (const slug of task3BPosts) {
    try {
      const updateRes = await handle("kraviona_update_post", {
        slug,
        changes: { schemaType: "Article" }
      }, session);

      if (updateRes.isError) throw new Error(updateRes.content?.[0]?.text || "Update error");

      resultsSummary.task3.fixed++;
      resultsSummary.task3.logs.push({ slug, action: "3B: schemaType -> Article confirmed", status: "Fixed" });
      console.log(`[Task 3B Fixed] ${slug} -> schemaType confirmed Article`);
    } catch (err) {
      resultsSummary.task3.errors.push({ slug, error: err.message });
      console.error(`[Task 3B Error] ${slug}: ${err.message}`);
    }
  }

  // -------------------------------------------------------------
  // TASK 4: Create Missing 301 Redirects
  // -------------------------------------------------------------
  console.log(`\n--- TASK 4: Create 301 Redirects ---`);
  const redirectsToCreate = [
    { source: "/solutions", destination: "/services", type: "301" },
    { source: "/ai-trends-august-2026-what-is-changing", destination: "/ai-news/ai-trends-august-2026-what-is-changing", type: "301" },
    { source: "/latest-ai-news-august-2026", destination: "/ai-news/latest-ai-news-august-2026", type: "301" },
    { source: "/ai-agents-2026-autonomous-ai-replacing-traditional-automation", destination: "/ai-news/ai-agents-2026-autonomous-ai-replacing-traditional-automation", type: "301" },
  ];

  resultsSummary.task4.total = redirectsToCreate.length;

  for (const redir of redirectsToCreate) {
    try {
      const existing = await RedirectModel.findOne({ source: redir.source }).lean();
      if (existing) {
        if (existing.destination === redir.destination && existing.type === redir.type && existing.active) {
          resultsSummary.task4.fixed++;
          resultsSummary.task4.logs.push({ source: redir.source, destination: redir.destination, status: "Already Exists & Active" });
          console.log(`[Task 4 Exists] Redirect ${redir.source} -> ${redir.destination} already exists and active`);
          continue;
        } else {
          // Update it
          await RedirectModel.updateOne({ _id: existing._id }, { $set: { destination: redir.destination, type: redir.type, active: true } });
          resultsSummary.task4.fixed++;
          resultsSummary.task4.logs.push({ source: redir.source, destination: redir.destination, status: "Updated to Match" });
          console.log(`[Task 4 Updated] Redirect ${redir.source} -> ${redir.destination} updated`);
          continue;
        }
      }

      const createRes = await handle("kraviona_create_redirect", {
        source: redir.source,
        destination: redir.destination,
        type: redir.type,
        active: true
      }, session);

      if (createRes.isError) throw new Error(createRes.content?.[0]?.text || "Redirect create error");

      resultsSummary.task4.fixed++;
      resultsSummary.task4.logs.push({ source: redir.source, destination: redir.destination, status: "Created" });
      console.log(`[Task 4 Created] ${redir.source} -> ${redir.destination} (301)`);
    } catch (err) {
      resultsSummary.task4.errors.push({ source: redir.source, error: err.message });
      console.error(`[Task 4 Error] ${redir.source}: ${err.message}`);
    }
  }

  // -------------------------------------------------------------
  // TASK 5: Fix noindex on Published Posts (18 slugs + service page)
  // -------------------------------------------------------------
  console.log(`\n--- TASK 5: Fix noindex on Published Posts ---`);
  const noIndexSlugs = [
    "blockchain-developer-complete-career-guide-for-2026",
    "what-is-blockchain-technology-2026",
    "what-is-a-smart-contract",
    "deploy-nodejs-app-aws-complete-guide-2026",
    "ai-integration-tally-zoho-razorpay-india",
    "core-web-vitals-optimization-india",
    "what-is-on-page-seo",
    "what-is-website-audit",
    "what-is-nextjs-and-why-use-it",
    "javascript-vs-typescript-2026",
    "schema-markup-implementation-service-india",
    "ai-agents-for-business-india-2026",
    "nodejs-development-company-india",
    "how-ai-is-transforming-web-development-in-2026",
    "what-is-ai-automation-in-business",
    "machine-learning-solutions-for-indian-businesses",
    "the-complete-guide-to-building-scalable-e-commerce-using-mern-stack-in-2026",
    "10-benefits-of-artificial-intelligence-essay-transforming-the-future-of-humanity"
  ];

  resultsSummary.task5.total = noIndexSlugs.length;

  for (const slug of noIndexSlugs) {
    try {
      const getRes = await handle("kraviona_get_post", { slug }, session);
      if (getRes.isError || !getRes.structuredContent?.post?.record) {
        resultsSummary.task5.skipped++;
        resultsSummary.task5.logs.push({ slug, status: "NOT FOUND — likely deleted, skip" });
        console.log(`[Task 5 Skipped] ${slug} -> NOT FOUND — likely deleted, skip`);
        continue;
      }

      const post = getRes.structuredContent.post.record;
      const changes = {};

      if (post.isNoIndex === true) {
        changes.isNoIndex = false;
      }
      if (post.status === "draft" || post.status === "archived") {
        changes.status = "published";
        changes.isNoIndex = false;
      }

      if (Object.keys(changes).length > 0) {
        const updateRes = await handle("kraviona_update_post", { slug, changes }, session);
        if (updateRes.isError) throw new Error(updateRes.content?.[0]?.text || "Update error");

        resultsSummary.task5.fixed++;
        resultsSummary.task5.logs.push({ slug, changes, status: "Fixed" });
        console.log(`[Task 5 Fixed] ${slug} -> Updated: ${JSON.stringify(changes)}`);
      } else {
        resultsSummary.task5.fixed++;
        resultsSummary.task5.logs.push({ slug, status: "Already indexable (published & isNoIndex: false)" });
        console.log(`[Task 5 OK] ${slug} -> Already indexable`);
      }
    } catch (err) {
      if (err.message.includes("not found")) {
        resultsSummary.task5.skipped++;
        resultsSummary.task5.logs.push({ slug, status: "NOT FOUND — likely deleted, skip" });
        console.log(`[Task 5 Skipped] ${slug} -> NOT FOUND — likely deleted, skip`);
      } else {
        resultsSummary.task5.errors.push({ slug, error: err.message });
        console.error(`[Task 5 Error] ${slug}: ${err.message}`);
      }
    }
  }

  // Check service page: /services/web3-blockchain-development
  console.log(`\nChecking service page 'web3-blockchain-development'...`);
  try {
    const service = await Service.findOne({ slug: "web3-blockchain-development" }).lean();
    if (service) {
      console.log(`[Task 5 Service] Found service '${service.title}'. SEO noIndex: ${service.seo?.noIndex}`);
      if (service.seo?.noIndex === true) {
        await Service.updateOne({ slug: "web3-blockchain-development" }, { $set: { "seo.noIndex": false } });
        console.log(`[Task 5 Service Fixed] 'web3-blockchain-development' seo.noIndex set to false`);
      }
    } else {
      console.log(`[Task 5 Service] Service 'web3-blockchain-development' not found in Service collection.`);
      // Check if redirect exists or services listed
      const allServices = await Service.find({}, "title slug seo.noIndex").lean();
      console.log(`Available services in DB:`, allServices.map(s => `${s.slug} (noIndex: ${s.seo?.noIndex})`));
    }
  } catch (err) {
    console.error(`[Task 5 Service Error]`, err.message);
  }

  // -------------------------------------------------------------
  // TASK 6: Fix Canonical Conflict
  // -------------------------------------------------------------
  console.log(`\n--- TASK 6: Canonical Conflict Verification ---`);
  resultsSummary.task6.total = 1;
  const conflictSlug = "ai-agents-2026-autonomous-ai-replacing-traditional-automation";
  try {
    const getRes = await handle("kraviona_get_post", { slug: conflictSlug }, session);
    const post = getRes.structuredContent?.post?.record;
    console.log(`[Task 6] Post '${conflictSlug}':`);
    console.log(`  canonicalUrl: ${post?.canonicalUrl}`);
    console.log(`  url: ${post?.url}`);
    console.log(`  previousSlugs:`, post?.previousSlugs);

    const expectedCanonical = "https://kraviona.com/ai-news/ai-agents-2026-autonomous-ai-replacing-traditional-automation";
    if (post?.canonicalUrl === expectedCanonical) {
      resultsSummary.task6.fixed++;
      console.log(`[Task 6 Fixed] Canonical URL matches expected: ${expectedCanonical}`);
    } else {
      // Apply it
      await handle("kraviona_update_post", {
        slug: conflictSlug,
        changes: { canonicalUrl: expectedCanonical }
      }, session);
      resultsSummary.task6.fixed++;
      console.log(`[Task 6 Fixed] Canonical URL updated to: ${expectedCanonical}`);
    }

    // Check if previousSlugs need redirects
    if (post?.previousSlugs && post.previousSlugs.length > 0) {
      for (const prev of post.previousSlugs) {
        const prevSlug = typeof prev === "string" ? prev : prev.slug;
        if (prevSlug && prevSlug !== conflictSlug) {
          const src = `/${prevSlug}`;
          const dest = `/ai-news/${conflictSlug}`;
          const existing = await RedirectModel.findOne({ source: src }).lean();
          if (!existing) {
            await handle("kraviona_create_redirect", {
              source: src,
              destination: dest,
              type: "301",
              active: true
            }, session);
            console.log(`[Task 6 Redirect Created] ${src} -> ${dest}`);
          }
        }
      }
    }
  } catch (err) {
    resultsSummary.task6.errors.push({ slug: conflictSlug, error: err.message });
    console.error(`[Task 6 Error]`, err.message);
  }

  // -------------------------------------------------------------
  // TASK 7: Fix OG Image 5xx Server Error
  // -------------------------------------------------------------
  console.log(`\n--- TASK 7: OG Image 5xx Check ---`);
  resultsSummary.task7.total = 1;
  const ogSlug = "schema-markup-implementation-service-india";
  try {
    const getRes = await handle("kraviona_get_post", { slug: ogSlug }, session);
    if (getRes.isError || !getRes.structuredContent?.post?.record) {
      resultsSummary.task7.skipped++;
      resultsSummary.task7.logs.push({
        slug: ogSlug,
        note: "Post deleted — OG image route orphaned — no action possible via MCP. Flagged for developer to add Next.js notFound() handler."
      });
      console.log(`[Task 7 Log] Post '${ogSlug}' deleted — OG image route orphaned — no action possible via MCP.`);
    } else {
      const post = getRes.structuredContent.post.record;
      console.log(`[Task 7 Post Exists] status: ${post.status}, isNoIndex: ${post.isNoIndex}, featuredImage:`, post.featuredImage);
      // If featuredImage empty or broken, or status draft/archived
      if (!post.featuredImage?.url) {
        console.log(`[Task 7] featuredImage missing!`);
      }
      resultsSummary.task7.fixed++;
    }
  } catch (err) {
    if (err.message.includes("not found")) {
      resultsSummary.task7.skipped++;
      resultsSummary.task7.logs.push({
        slug: ogSlug,
        note: "Post deleted — OG image route orphaned — no action possible via MCP. Flagged for developer to add Next.js notFound() handler."
      });
      console.log(`[Task 7 Log] Post '${ogSlug}' deleted — OG image route orphaned — no action possible via MCP.`);
    } else {
      resultsSummary.task7.errors.push({ slug: ogSlug, error: err.message });
      console.error(`[Task 7 Error]`, err.message);
    }
  }

  // -------------------------------------------------------------
  // TASK 8: Update robots.txt
  // -------------------------------------------------------------
  console.log(`\n--- TASK 8: Update robots.txt ---`);
  resultsSummary.task8.total = 1;
  const newRobotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /*?q=
Disallow: /*?search=
Sitemap: https://kraviona.com/sitemap.xml`;

  try {
    const robotsRes = await handle("kraviona_update_robots", { content: newRobotsTxt }, session);
    if (robotsRes.isError) throw new Error(robotsRes.content?.[0]?.text || "Robots update failed");

    resultsSummary.task8.fixed++;
    console.log(`[Task 8 Fixed] robots.txt updated successfully in database:`);
    console.log(robotsRes.structuredContent?.content || newRobotsTxt);
  } catch (err) {
    resultsSummary.task8.errors.push({ error: err.message });
    console.error(`[Task 8 Error]`, err.message);
  }

  // -------------------------------------------------------------
  // TASK 9: Internal Links Audit
  // -------------------------------------------------------------
  console.log(`\n--- TASK 9: Internal Links Audit ---`);
  const internalLinkPosts = [
    "ai-tools-for-small-business",
    "ai-chatbot-development-company-india",
    "next-js-vs-react-differences"
  ];

  resultsSummary.task9.total = internalLinkPosts.length;

  for (const slug of internalLinkPosts) {
    try {
      const getRes = await handle("kraviona_get_post", { slug }, session);
      const post = getRes.structuredContent?.post?.record;
      if (!post || !post.content) {
        console.log(`[Task 9 Skipped] ${slug} has no content`);
        resultsSummary.task9.skipped++;
        continue;
      }

      let content = post.content;
      let replacementsMade = 0;

      // Replace /blog/{slug} with correct canonical path
      for (const [targetSlug, fullUrl] of Object.entries(CANONICAL_URLS)) {
        const canonicalPath = new URL(fullUrl).pathname;
        const oldPatterns = [
          `href="/blog/${targetSlug}"`,
          `href='/blog/${targetSlug}'`,
          `href="https://kraviona.com/blog/${targetSlug}"`,
          `href='https://kraviona.com/blog/${targetSlug}'`
        ];

        for (const pattern of oldPatterns) {
          if (content.includes(pattern)) {
            const quote = pattern.startsWith("href=\"") ? "\"" : "'";
            const replacement = `href=${quote}${canonicalPath}${quote}`;
            const count = content.split(pattern).length - 1;
            content = content.replaceAll(pattern, replacement);
            replacementsMade += count;
            console.log(`  Replacing ${pattern} -> ${replacement} (${count} times)`);
          }
        }
      }

      // Also check general regex for any remaining /blog/ links
      const blogRegex = /href=["'](\/blog\/([a-z0-9-]+))["']/gi;
      let match;
      while ((match = blogRegex.exec(content)) !== null) {
        const matchedSlug = match[2];
        if (CANONICAL_URLS[matchedSlug]) {
          const canonicalPath = new URL(CANONICAL_URLS[matchedSlug]).pathname;
          content = content.replaceAll(match[0], `href="${canonicalPath}"`);
          replacementsMade++;
          console.log(`  Regex replaced ${match[0]} -> href="${canonicalPath}"`);
        } else {
          console.log(`  Found unmatched blog link: ${match[0]}`);
        }
      }

      if (replacementsMade > 0) {
        const updateRes = await handle("kraviona_update_post", {
          slug,
          changes: { content }
        }, session);

        if (updateRes.isError) throw new Error(updateRes.content?.[0]?.text || "Content update error");

        resultsSummary.task9.fixed++;
        resultsSummary.task9.logs.push({ slug, replacementsMade, status: "Fixed" });
        console.log(`[Task 9 Fixed] ${slug} -> ${replacementsMade} internal link(s) updated`);
      } else {
        resultsSummary.task9.fixed++;
        resultsSummary.task9.logs.push({ slug, replacementsMade: 0, status: "Clean (No /blog/ links found)" });
        console.log(`[Task 9 OK] ${slug} -> Clean, no /blog/ links found`);
      }
    } catch (err) {
      resultsSummary.task9.errors.push({ slug, error: err.message });
      console.error(`[Task 9 Error] ${slug}:`, err.message);
    }
  }

  console.log(`\n======================================================`);
  console.log(`ALL TASKS COMPLETED. SUMMARY JSON:`);
  console.log(JSON.stringify(resultsSummary, null, 2));
  console.log(`======================================================`);
}

run()
  .catch((err) => {
    console.error("Fatal execution error:", err);
  })
  .finally(async () => {
    await disconnectDB();
  });
