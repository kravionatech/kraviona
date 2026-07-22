"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Layout,
  Server,
  Layers,
  BarChart,
  Settings,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { API_URL } from "@/utils/api";

// Static fallback services — shown when API returns empty
const FALLBACK_SERVICES = [
  {
    _id: "1",
    title: "MERN Stack Development",
    description:
      "Full-stack applications built with MongoDB, Express.js, React.js, and Node.js for teams that need speed, clarity, and room to scale.",
    features: [
      "React.js Frontend",
      "Node.js API",
      "MongoDB Database",
      "REST & GraphQL",
    ],
    slug: "mern-stack-development",
  },
  {
    _id: "2",
    title: "Technical SEO",
    description:
      "Technical SEO audits and fixes for Core Web Vitals, structured data, crawlability, canonical tags, indexing, and AI-search readiness.",
    features: [
      "Core Web Vitals",
      "Schema Markup",
      "Crawl Optimisation",
      "Site Speed",
    ],
    slug: "technical-seo",
  },
  {
    _id: "3",
    title: "Web Performance Optimization",
    description:
      "Page-speed improvements, image optimisation, code splitting, lazy loading, and deployment cleanup for faster user experiences.",
    features: [
      "Lighthouse 90+ Score",
      "Image Optimisation",
      "Code Splitting",
      "CDN Setup",
    ],
    slug: "web-app-development",
  },
  {
    _id: "4",
    title: "AI Automation",
    description:
      "LLM integrations, workflow automation, chatbots, and internal tools that remove repetitive work from your day-to-day operations.",
    features: [
      "LLM Integration",
      "Workflow Automation",
      "AI Chatbots",
      "Data Pipelines",
    ],
    slug: "ai-automation",
  },
  {
    _id: "5",
    title: "Backend Architecture",
    description:
      "Node.js APIs, authentication, integrations, database structure, real-time features, and deployment support for reliable product foundations.",
    features: ["Microservices", "JWT Auth", "WebSockets", "Cloud Deploy"],
    slug: "nodejs-development",
  },
  {
    _id: "6",
    title: "API Development",
    description:
      "Documented REST and GraphQL APIs with versioning, rate limiting, caching, webhook support, and handover-ready documentation.",
    features: [
      "REST & GraphQL",
      "Rate Limiting",
      "API Caching",
      "OpenAPI Docs",
    ],
    slug: "api-development",
  },
];

const SERVICE_ICONS = [
  <Layers key="layers" className="w-7 h-7" />,
  <BarChart key="chart" className="w-7 h-7" />,
  <Cpu key="cpu" className="w-7 h-7" />,
  <Settings key="settings" className="w-7 h-7" />,
  <Server key="server" className="w-7 h-7" />,
  <Layout key="layout" className="w-7 h-7" />,
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 75, damping: 20 },
  },
};

const FeaturedServices = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        const json = response.ok ? await response.json() : [];
        const data = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];
        setServices(
          data.slice(0, 6).length > 0 ? data.slice(0, 6) : FALLBACK_SERVICES,
        );
      } catch {
        setServices(FALLBACK_SERVICES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section
      className="py-20 md:py-28 bg-[#FAFCFC] relative overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* Subtle dot-grid background */}
      <div
        className="absolute inset-0 opacity-[0.028] z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#111A1F 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14 md:mb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-10 h-[2px] bg-[#d96c4e]" aria-hidden="true" />
              <span className="text-[#d96c4e] font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
                Our Solutions
              </span>
            </motion.div>

            <h2
              id="services-heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[#111A1F] tracking-tight leading-[1.1]"
            >
              Services Built Around{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96c4e] to-[#f4be78]">
                Real Outcomes
              </span>
            </h2>
          </div>

          <div className="md:border-l-2 border-[#f4be78]/60 md:pl-6 max-w-xs">
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              We focus on the parts that make a digital product useful:
              performance, structure, maintainability, search visibility, and a
              clear path to launch.
            </p>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            className="flex justify-center items-center py-24"
            aria-live="polite"
            aria-busy="true"
          >
            <Loader2 size={40} className="animate-spin text-[#295c5e]" />
          </div>
        ) : (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
            aria-label="Our services"
          >
            {services.map((service, index) => {
              const icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
              const features = Array.isArray(service.features)
                ? service.features.slice(0, 4)
                : [];

              return (
                <motion.li
                  key={service._id || index}
                  variants={cardVariants}
                  className="group overflow-hidden flex flex-col h-full"
                >
                  <article
                    className="relative bg-white rounded-2xl border border-gray-200/80 transition-all duration-500 hover:-translate-y-2 shadow-sm overflow-hidden flex flex-col h-full"
                    style={{
                      background: "white",
                    }}
                  >
                    {/* Gradient border glow on hover – via pseudo box-shadow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        boxShadow:
                          "inset 0 0 0 1.5px rgba(217,108,78,0.5), 0 20px 48px rgba(15,36,37,0.14)",
                      }}
                      aria-hidden="true"
                    />

                    {/* Top accent line */}
                    <div
                      className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#d96c4e]/0 to-transparent group-hover:via-[#d96c4e]/80 transition-all duration-500"
                      aria-hidden="true"
                    />

                    <div className="p-7 md:p-8 flex flex-col h-full relative z-10">
                      {/* Icon */}
                      <div
                        className="w-14 h-14 rounded-xl bg-[#FAFCFC] border border-gray-100 group-hover:bg-[#0f2425] group-hover:border-[#0f2425] text-[#295c5e] group-hover:text-[#f4be78] flex items-center justify-center mb-6 transition-all duration-500 shadow-sm"
                        aria-hidden="true"
                      >
                        {icon}
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-[#111A1F] mb-3 group-hover:text-[#111A1F] transition-colors duration-300">
                          {service.title || service.name}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                          {service.description}
                        </p>

                        {features.length > 0 && (
                          <ul
                            className="space-y-2.5 mb-6"
                            aria-label={`Features of ${service.title}`}
                          >
                            {features.map((feature, i) => (
                              <li
                                key={i}
                                className="flex items-center text-sm font-medium text-gray-600"
                              >
                                <CheckCircle2
                                  className="w-4 h-4 text-[#d96c4e] mr-2.5 flex-shrink-0"
                                  aria-hidden="true"
                                />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="mt-auto pt-5 border-t border-gray-100 group-hover:border-[#d96c4e]/15 transition-colors duration-500">
                        <Link
                          href={`/services/${service.slug || ""}`}
                          className="inline-flex items-center gap-2 text-sm font-bold text-[#295c5e] group-hover:text-[#d96c4e] transition-colors duration-300"
                        >
                          Learn more about {service.title}
                          <ArrowRight
                            className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                </motion.li>
              );
            })}
          </motion.ul>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111A1F] text-white font-bold rounded-xl hover:bg-[#d96c4e] transition-all duration-300 text-sm shadow-sm hover:shadow-[0_4px_20px_rgba(217,108,78,0.3)] hover:-translate-y-0.5"
          >
            View All Services
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedServices;
