// Instant Client-Side Verified Knowledge Fallback Engine for Kraviona AI
// Ensures 100% availability and instant accurate answers even under network latency or offline scenarios.

const HINGLISH_PATTERNS = [
  "kya", "kaise", "hai", "hain", "karna", "mujhe", "chahiye", "batao",
  "kaha", "kahan", "kaun", "kare", "sakta", "sakte", "mera", "meri",
  "banao", "banwana", "banwani", "kharidna", "rate", "paisa", "kitna",
  "namaste", "dhanyawad", "shukriya", "madad", "sampark", "kaam", "theek",
  "bhai", "karo", "do", "dena", "lagta", "kharcha"
];

export const isHindiOrHinglish = (text = "") => {
  if (/[\u0900-\u097F]/.test(text)) return true;
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => HINGLISH_PATTERNS.includes(w));
};

export const getFallbackChatResponse = (query = "") => {
  const q = String(query).toLowerCase().trim();
  const hinglish = isHindiOrHinglish(q);

  // 1. Thanks & Goodbye
  if (/\b(thank(s|\s+you)?|dhanyawad|shukriya|bye|goodbye|alvida|ok|okay|theek\s+hai|thik\s+hai)\b/i.test(q)) {
    return {
      reply: hinglish
        ? "Aapka swagat hai! 🙏 Agar aapko aur koi jaankari chahiye ya naya project discuss karna ho, Kraviona hamesha madad ke liye tayyar hai. Shubh din!"
        : "You're very welcome! If you need any more information or want to discuss a project, Kraviona is always here to help. Have a wonderful day! 😊",
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "courtesy",
    };
  }

  // 2. Greetings & Who are you
  if (/\b(hi|hello|hey|namaste|greetings|good\s+(morning|afternoon|evening|day)|who are you|what can you do|help|madad|kaise ho|kya haal hai|aap kaun ho)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Namaste! 👋 Main Kraviona ka AI Assistant hoon.\n\nMain aapki in topics par madad kar sakta hoon:\n• **Web Development**: Next.js 14/15, React & MERN stack web apps\n• **Technical SEO**: Core Web Vitals (90+ speed) & Google search growth\n• **AI Automations**: Custom business workflows & intelligent systems\n• **Pricing & Consultation**: Free customized proposal & timeline\n\nAapko kis baare mein jaankari chahiye?`
        : `Hello! 👋 I'm Kraviona's AI Assistant.\n\nI can assist you with:\n• **Web Engineering**: High-performance Next.js 14/15 & MERN stack applications\n• **Technical SEO**: Core Web Vitals (90+ score) & search visibility\n• **AI Workflows**: Custom automation systems & intelligent integrations\n• **Portfolio & Estimates**: Client case studies, estimates, and consultations\n\nHow can I help you today?`,
      sources: [
        { title: "Services", url: "/services", category: "Services" },
        { title: "Case Studies", url: "/case-studies", category: "Portfolio" },
        { title: "Contact", url: "/contact", category: "Contact" },
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
        { title: "Services", url: "/services", category: "Services" },
      ],
      type: "services",
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
        { title: "Contact Kraviona", url: "/contact", category: "Contact" },
        { title: "Services", url: "/services", category: "Services" },
      ],
      type: "project",
    };
  }

  // 5. Contact / Phone / Email / WhatsApp
  if (/\b(contact|phone|number|email|call|whatsapp|reach|sampark|touch)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona Tech Solutions se in channels ke through direct connect kar sakte hain:\n\n• **Official Email**: [kravionatech@gmail.com](mailto:kravionatech@gmail.com)\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Headquarters**: Noida, Delhi NCR, India\n• **Online Form**: [Contact Page Par Jaayein](/contact)\n\nHum har query ka javab 24 hours ke andar dete hain.`
        : `You can reach Kraviona Tech Solutions directly through:\n\n• **Email**: [kravionatech@gmail.com](mailto:kravionatech@gmail.com)\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Headquarters**: Noida, Delhi NCR, India\n• **Online Form**: [Contact Us](/contact)\n\nOur engineering team typically responds within 24 hours.`,
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "contact",
    };
  }

  // 6. Location / Office
  if (/\b(location|address|where|kahan|office|noida|delhi|headquarters)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona Tech Solutions ka primary office **Delhi NCR (Noida, Uttar Pradesh, India)** mein sthit hai.\n\nHum poore India aur international clients ke saath remotely aur project-based collaborate karte hain.\n\nConnect karne ke liye: [Contact Us](/contact) ya email karein [kravionatech@gmail.com](mailto:kravionatech@gmail.com).`
        : `Kraviona Tech Solutions is headquartered in **Delhi NCR (Noida, Uttar Pradesh, India)**.\n\nWe engineer web solutions and handle technical SEO for clients across India and globally through modern remote workflows.\n\nGet in touch at [kravionatech@gmail.com](mailto:kravionatech@gmail.com) or visit our [Contact Page](/contact).`,
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "location",
    };
  }

  // 7. Pricing / Cost
  if (/\b(price|pricing|cost|charge|charges|rate|rates|fee|fees|kitna kharcha|kitna lagega|budget|paisa|package|packages)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona transparent aur competitive pricing offer karta hai:\n\n• **Project-Based**: Fixed pricing for new website development, web apps, ya complete redesign\n• **Monthly Retainer**: Technical SEO, site performance monitoring, aur ongoing updates\n• **Custom AI Solutions**: Workflow complexity aur API needs ke mutabik\n\nApne project ka free customized quote lene ke liye humare [Contact Page](/contact) par details share karein ya [+91 96085 53167](tel:+919608553167) par sampark karein.`
        : `Kraviona offers clear, value-driven pricing:\n\n• **Project-Based**: Fixed quotes for new web builds, Next.js migrations, or custom web apps\n• **Monthly Retainers**: For ongoing Technical SEO audits, site speed optimization, and search rankings\n• **Custom AI Solutions**: Tailored to scope, agents, and API integrations\n\nFor a free tailored quotation, submit your project details on our [Contact Page](/contact) or email [kravionatech@gmail.com](mailto:kravionatech@gmail.com).`,
      sources: [
        { title: "Contact for Quote", url: "/contact", category: "Pricing" },
        { title: "Services", url: "/services", category: "Services" },
      ],
      type: "pricing",
    };
  }

  // 8. Web Development / Next.js / React / MERN
  if (/\b(web dev|web development|nextjs|next\.js|react|mern|frontend|backend|node|full stack)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Hum modern Next.js 14/15, React, Node.js, Express aur MongoDB (MERN stack) par high-performance web applications develop karte hain.\n\nHar application sub-second page loads, SEO-friendly architecture, aur sleek responsive design ke saath aati hai.\n\nExplore karein: [Services](/services) ya discuss karein apna project: [Contact Page](/contact).`
        : `Kraviona specializes in modern web engineering using Next.js 14/15, React.js, Node.js, Express, and MongoDB. We build ultra-fast, accessible, and scalable platforms with enterprise-grade quality.\n\nExplore our web development services on our [Services Page](/services).`,
      sources: [
        { title: "Web Development Services", url: "/services", category: "Services" },
      ],
      type: "webdev",
    };
  }

  // 9. Technical SEO
  if (/\b(seo|technical seo|ranking|google ranking|core web vitals|page speed|traffic|organic)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona Technical SEO aur site speed optimization mein specialize karta hai:\n\n• **Core Web Vitals**: Mobile aur Desktop par 90+ speed score guarantee\n• **Schema & Structured Data**: Rich snippets aur Google search indexing optimize karna\n• **Crawl & Indexing Audits**: Broken links, redirects, aur site architecture fix karna\n\nAur jaankari ke liye visit karein: [Services](/services).`
        : `Kraviona's Technical SEO practice focuses on data-driven search growth:\n\n• **Core Web Vitals**: 90+ mobile & desktop speed scores guaranteed\n• **Structured Schema**: Rich snippets and comprehensive Schema.org markup\n• **Crawl Architecture**: Optimizing crawl budgets, internal links, and indexation\n\nLearn more on our [Services Page](/services).`,
      sources: [
        { title: "SEO Services", url: "/services", category: "Services" },
      ],
      type: "seo",
    };
  }

  // 10. AI Automation
  if (/\b(ai|artificial intelligence|automations?|workflows?|llms?|chatbots?|agents?|machine learning)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Hum custom AI workflows, intelligent chat assistants, scrapers aur LLM API integrations design karte hain jo aapke business operations ko scale aur automate karte hain.\n\nExplore karein: [Services](/services) ya reach out karein: [Contact](/contact).`
        : `We engineer bespoke AI automation systems, intelligent customer chat assistants, workflow pipelines, and custom LLM integrations that streamline repetitive business tasks.\n\nLearn more on our [Services Page](/services).`,
      sources: [
        { title: "AI Services", url: "/services", category: "Services" },
      ],
      type: "ai",
    };
  }

  // 11. Portfolio / Case Studies
  if (/\b(portfolio|case studies|case study|projects|past work|clients|samples|kya banaya)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona ke real-world client projects, architectural transformations aur SEO growth case studies dekh sakte hain:\n\n• [Case Studies Page Par Jaayein](/case-studies)\n\nKisi specific project ya live demo ke baare mein baat karne ke liye connect karein: [Contact Us](/contact).`
        : `Explore real-world client implementations, architectural transformations, and SEO scale-ups engineered by Kraviona Tech Solutions:\n\n• [Explore All Case Studies](/case-studies)\n\nInterested in building something similar? Connect with us on our [Contact Page](/contact).`,
      sources: [
        { title: "Case Studies", url: "/case-studies", category: "Portfolio" },
      ],
      type: "portfolio",
    };
  }

  // 12. Careers
  if (/\b(career|careers|job|jobs|hiring|internship|openings?|apply|work with us)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona engineering, SEO aur AI talents ko hire karta rehta hai!\n\nOpen roles dekhne aur direct apply karne ke liye visit karein:\n• [Kraviona Careers Page](/careers)\n\nAap apna resume [kravionatech@gmail.com](mailto:kravionatech@gmail.com) par bhi email kar sakte hain.`
        : `We are always looking for passionate engineers and digital specialists in frontend, backend, SEO, and AI engineering.\n\nExplore our open roles and apply at:\n• [Careers at Kraviona](/careers)\n\nYou can also share your resume directly at [kravionatech@gmail.com](mailto:kravionatech@gmail.com).`,
      sources: [
        { title: "Careers", url: "/careers", category: "Careers" },
      ],
      type: "careers",
    };
  }

  // 13. About / Company
  if (/\b(about|kraviona|company|who are you|founder|agency)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `**Kraviona Tech Solutions** ek premier digital engineering aur technical SEO agency hai jo Delhi NCR (Noida, India) mein based hai. Hum high-performance Next.js web applications, MERN stack software, aur data-driven SEO architectures deliver karte hain.\n\nAur jaankari ke liye visit karein: [About Kraviona](/about).`
        : `**Kraviona Tech Solutions** is a premier digital engineering and technical SEO agency based in Delhi NCR (Noida, India). We engineer high-performance web applications, scalable backend APIs, and modern search growth architectures.\n\nLearn more on our [About Page](/about).`,
      sources: [
        { title: "About Us", url: "/about", category: "Company" },
        { title: "Services", url: "/services", category: "Services" },
      ],
      type: "about",
    };
  }

  // General Fallback — honest about uncertainty, surfaces direct contact options
  return {
    reply: hinglish
      ? `Main is question ka bilkul sahi jawab dene mein confident nahi hoon. 🙏\n\nSabse accha hoga agar aap Kraviona team se **directly** sampark karein:\n• **WhatsApp**: [+91 96085 53167](https://wa.me/919608553167)\n• **Email**: [kravionatech@gmail.com](mailto:kravionatech@gmail.com)\n• **Contact Form**: [Yahan click karein](/contact)\n\nMain in topics par zarur madad kar sakta hoon:\n• Web Development (Next.js, MERN, React)\n• Technical SEO & Core Web Vitals\n• AI Automation & Chatbots\n• Pricing & Project Estimates`
      : `I'm not confident I have the right answer for that specific question — I don't want to guess and waste your time. 🙏\n\nThe fastest way to get an accurate answer is to reach the team directly:\n• **WhatsApp**: [+91 96085 53167](https://wa.me/919608553167)\n• **Email**: [kravionatech@gmail.com](mailto:kravionatech@gmail.com)\n• **Contact Form**: [Fill it out here](/contact)\n\nI can reliably help with:\n• Web development services (Next.js, MERN, React)\n• Technical SEO & site performance\n• AI automation & chatbot development\n• Pricing estimates & project timelines`,
    sources: [
      { title: "Contact Us", url: "/contact", category: "Contact" },
      { title: "Services", url: "/services", category: "Services" },
    ],
    type: "fallback",
  };
};

