"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is MERN Stack development and why should I choose it?",
    answer:
      "MERN Stack development uses MongoDB, Express.js, React.js, and Node.js — a full JavaScript ecosystem for building fast, scalable web applications. It enables rapid development, cost-efficiency (one language across frontend & backend), and is ideal for startups to enterprise businesses. At Kraviona, we specialise in delivering production-grade MERN applications with 99.9% uptime and performance-first architecture.",
  },
  {
    question: "How does Kraviona approach Technical SEO for websites?",
    answer:
      "Our Technical SEO process covers Core Web Vitals optimisation, structured data (Schema.org markup), XML sitemaps, robots.txt configuration, canonical tags, Open Graph & Twitter Card meta, site speed improvements, mobile responsiveness, and crawlability audits. We identify and eliminate every technical barrier preventing your site from ranking.",
  },
  {
    question: "How long does it take to build a custom web application?",
    answer:
      "A typical custom web application takes 4–12 weeks depending on complexity. Simple landing pages are delivered in 1–2 weeks. Full-stack MERN applications with custom admin panels, APIs, and third-party integrations typically take 6–10 weeks. We follow Agile sprints so you see working deliverables every week.",
  },
  {
    question: "Do you provide SEO services along with web development?",
    answer:
      "Yes. Kraviona is uniquely positioned as both a web development agency and a Technical SEO agency. Every website we build is SEO-optimised from day one — including semantic HTML structure, proper heading hierarchy, performance optimisation, structured data markup, and keyword-targeted meta content.",
  },
  {
    question:
      "What makes Kraviona different from other web development agencies?",
    answer:
      "Unlike generic agencies, Kraviona focuses exclusively on performance-first, SEO-ready web solutions. We combine MERN Stack engineering excellence with data-driven marketing strategy, transparent communication, Agile delivery, post-launch support, and measurable ROI-focused outcomes.",
  },
  {
    question: "Can you help improve my existing website's performance and SEO?",
    answer:
      "Absolutely. Our comprehensive website audit covers page speed (Core Web Vitals), SEO health (on-page, technical, and off-page), UX/mobile usability, conversion rate optimisation, and security. After the audit, we provide a prioritised action plan and implement fixes.",
  },
  {
    question:
      "Do you offer React.js and Node.js development services separately?",
    answer:
      "Yes. We offer dedicated React.js frontend development (dynamic SPAs and dashboards) and standalone Node.js/Express.js backend development (RESTful APIs, microservices, real-time WebSockets). We can integrate with your existing stack or build a completely new backend infrastructure.",
  },
  {
    question: "What is your pricing model for web development projects?",
    answer:
      "We offer flexible pricing: fixed-price for well-defined projects, time & material for evolving requirements, and monthly retainers for ongoing development & SEO support. Every project starts with a free 30-minute consultation to understand your goals and provide an accurate quote.",
  },
];

const HomeFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section
      className="py-20 md:py-28 bg-white relative overflow-hidden"
      aria-labelledby="faq-heading"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      {/* Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "radial-gradient(#111A1F 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d96c4e]/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#295c5e]/5 blur-3xl rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-5"
          >
            <span className="w-8 h-[2px] bg-[#d96c4e]" aria-hidden="true" />
            <span className="text-[#d96c4e] font-bold uppercase tracking-[0.2em] text-xs">
              Got Questions?
            </span>
            <span className="w-8 h-[2px] bg-[#d96c4e]" aria-hidden="true" />
          </motion.div>

          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111A1F] tracking-tight mb-4"
          >
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96c4e] to-[#f4be78]">
              Questions
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Everything you need to know about MERN Stack development, Technical
            SEO, and how Kraviona can grow your business.
          </motion.p>
        </div>

        {/* FAQ Accordion */}
        <ul className="space-y-3" aria-label="Frequently Asked Questions">
          {faqs.map((faq, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.055 }}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "border-[#d96c4e]/45 shadow-[0_4px_28px_rgba(217,108,78,0.1)]"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <button
                onClick={() => toggle(index)}
                id={`faq-btn-${index}`}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-gray-50/50 transition-colors duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d96c4e]/40 rounded-t-2xl"
              >
                <span
                  itemProp="name"
                  className={`font-semibold text-base md:text-[17px] leading-snug transition-colors duration-200 pr-2 ${
                    openIndex === index
                      ? "text-[#d96c4e]"
                      : "text-[#111A1F] group-hover:text-[#295c5e]"
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? "bg-[#d96c4e] text-white"
                      : "bg-gray-100 text-gray-500 group-hover:bg-[#f4be78]/20 group-hover:text-[#d96c4e]"
                  }`}
                  aria-hidden="true"
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-btn-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <div className="px-6 pb-6 pt-3 border-t border-gray-100/80">
                      <p
                        itemProp="text"
                        className="text-gray-600 leading-relaxed text-sm md:text-base"
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </ul>
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-14 text-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-gray-50 rounded-2xl border border-gray-200 mb-6">
            <HelpCircle className="w-5 h-5 text-[#d96c4e]" aria-hidden="true" />
            <p className="text-gray-500 text-sm font-medium">
              Still have questions? We&apos;re happy to help.
            </p>
          </div>
          <div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#111A1F] text-white font-bold rounded-xl hover:bg-[#d96c4e] transition-all duration-300 shadow-sm hover:shadow-[0_6px_24px_rgba(217,108,78,0.3)] hover:-translate-y-0.5 text-sm"
            >
              Contact Our Team
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFAQ;
