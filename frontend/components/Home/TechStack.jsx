"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Terminal, Database, Cloud, Server, Zap } from "lucide-react";

const techCategories = [
  {
    id: "frontend",
    label: "Frontend",
    title: "Frontend Engineering",
    description:
      "Building ultra-fast, responsive, and interactive user interfaces optimised for SEO and conversion.",
    icon: <Terminal className="w-5 h-5 text-orange-500" />,
    colSpan: "md:col-span-2",
    accentColor: "orange",
    techs: [
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
      },
      {
        name: "Tailwind",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    title: "Backend Architecture",
    description: "Scalable server-side logic, RESTful APIs, and microservices.",
    icon: <Database className="w-5 h-5 text-rose-500" />,
    colSpan: "md:col-span-1",
    accentColor: "rose",
    techs: [
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      },
      {
        name: "Express",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
      },
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      },
      {
        name: "Java",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      },
    ],
  },
  {
    id: "database",
    label: "Database",
    title: "Database & Storage",
    description:
      "Reliable, high-performance data management and storage solutions.",
    icon: <Server className="w-5 h-5 text-purple-500" />,
    colSpan: "md:col-span-1",
    accentColor: "purple",
    techs: [
      {
        name: "MongoDB",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
      {
        name: "Redis",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
      },
      {
        name: "MySQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    title: "Cloud & DevOps",
    description:
      "Secure, scalable deployments and CI/CD pipelines for maximum uptime and reliability.",
    icon: <Cloud className="w-5 h-5 text-teal-600" />,
    colSpan: "md:col-span-2",
    accentColor: "teal",
    techs: [
      {
        name: "AWS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
      },
      {
        name: "Docker",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      },
      {
        name: "GitHub",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
      },
      {
        name: "Vercel",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
      },
    ],
  },
];

const accentClasses = {
  orange: {
    badge: "bg-orange-50 text-orange-600 border-orange-200",
    hover: "group-hover:bg-orange-50/60",
  },
  rose: {
    badge: "bg-rose-50 text-rose-600 border-rose-200",
    hover: "group-hover:bg-rose-50/60",
  },
  purple: {
    badge: "bg-purple-50 text-purple-600 border-purple-200",
    hover: "group-hover:bg-purple-50/60",
  },
  teal: {
    badge: "bg-teal-50 text-teal-700 border-teal-200",
    hover: "group-hover:bg-teal-50/60",
  },
};

const TechStack = () => {
  return (
    <section
      className="py-20 md:py-28 bg-gray-50/80 relative overflow-hidden"
      aria-labelledby="techstack-heading"
    >
      {/* Background blobs */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-[36rem] h-[36rem] bg-teal-200/30 blur-[110px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-rose-200/30 blur-[110px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-5"
          >
            <Zap className="w-4 h-4 text-[#d96c4e]" aria-hidden="true" />
            <span className="text-gray-600 font-bold tracking-widest text-xs uppercase">
              Our Tech Arsenal
            </span>
          </motion.div>

          <motion.h2
            id="techstack-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-gray-900 tracking-tight mb-4"
          >
            Powered By{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96c4e] to-[#f4be78]">
              Modern Tech
            </span>
          </motion.h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Production-grade tools and frameworks we use to ship fast,
            SEO-ready, and scalable digital products.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {techCategories.map((category, index) => {
            const accent = accentClasses[category.accentColor];
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, ease: "easeOut" }}
                className={`group relative bg-white border border-gray-200 rounded-2xl p-6 md:p-8 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-400 ${category.colSpan}`}
              >
                {/* Category label pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mb-4 ${accent.badge}`}
                >
                  {category.icon}
                  {category.label}
                </span>

                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-7">
                  {category.description}
                </p>

                {/* Tech Items */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {category.techs.map((tech, techIndex) => (
                    <div
                      key={`${tech.name}-${techIndex}`}
                      className={`group/tech flex flex-col items-center justify-center p-3.5 bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default ${accent.hover}`}
                    >
                      <div className="w-9 h-9 mb-2.5 flex items-center justify-center">
                        <Image
                          src={tech.icon}
                          alt={`${tech.name} logo`}
                          className="w-full h-full object-contain group-hover/tech:scale-110 transition-transform duration-300"
                          width={36}
                          height={36}
                          unoptimized
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-gray-600 text-center leading-tight">
                        {tech.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
