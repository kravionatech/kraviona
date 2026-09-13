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
    icon: <Terminal className="w-5 h-5 text-[#E8622A]" />,
    colSpan: "md:col-span-2",
    accentColor: "coral",
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
    icon: <Database className="w-5 h-5 text-[#2A4A52]" />,
    colSpan: "md:col-span-1",
    accentColor: "teal",
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
    icon: <Server className="w-5 h-5 text-[#1A2E33]" />,
    colSpan: "md:col-span-1",
    accentColor: "ink",
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
    icon: <Cloud className="w-5 h-5 text-[#5C9BAA]" />,
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
  coral: {
    badge: "bg-[#EAF3F5] text-[#2D6E7A] border-[#E8E4DE]",
    hover: "hover:bg-[#FEFCF9]",
  },
  teal: {
    badge: "bg-[#EAF3F5] text-[#2D6E7A] border-[#E8E4DE]",
    hover: "hover:bg-[#FEFCF9]",
  },
  ink: {
    badge: "bg-[#EAF3F5] text-[#2D6E7A] border-[#E8E4DE]",
    hover: "hover:bg-[#FEFCF9]",
  },
};

const TechStack = () => {
  return (
    <section
      className="py-20 md:py-28 bg-[#F7F5F1] relative overflow-hidden"
      aria-labelledby="techstack-heading"
    >
      {/* Background blobs */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-[36rem] h-[36rem] bg-[#EAF3F5]/60 blur-[110px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[20px] bg-[#FEFCF9] border border-[#E8E4DE] shadow-sm mb-5"
          >
            <Zap className="w-4 h-4 text-[#2D6E7A]" aria-hidden="true" />
            <span className="text-[#2D6E7A] font-semibold tracking-widest text-xs uppercase">
              Our Tech Arsenal
            </span>
          </motion.div>

          <motion.h2
            id="techstack-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#1A3840] tracking-tight mb-4"
          >
            Powered By{" "}
            <span className="text-[#2D6E7A]">
              Modern Tech
            </span>
          </motion.h2>
          <p className="text-[#5A7A82] text-base md:text-lg leading-relaxed max-w-xl mx-auto">
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
                className={`group relative bg-[#FEFCF9] border border-[#E8E4DE] rounded-[12px] p-6 md:p-8 overflow-hidden hover:shadow-brand-md transition-all duration-300 ${category.colSpan}`}
              >
                {/* Category label pill */}
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[20px] text-[10px] font-semibold uppercase tracking-widest border mb-4 ${accent.badge}`}
                >
                  {category.icon}
                  {category.label}
                </span>

                <h3 className="text-lg md:text-xl font-bold text-[#1A3840] mb-2">
                  {category.title}
                </h3>
                <p className="text-[#5A7A82] text-sm leading-relaxed mb-7">
                  {category.description}
                </p>

                {/* Tech Items */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {category.techs.map((tech, techIndex) => (
                    <div
                      key={`${tech.name}-${techIndex}`}
                      className={`group/tech flex flex-col items-center justify-center p-3.5 bg-[#EAF3F5]/50 hover:bg-[#FEFCF9] border border-[#E8E4DE] rounded-[8px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-default`}
                    >
                      <div className="w-9 h-9 mb-2.5 flex items-center justify-center">
                        <Image
                          src={tech.icon}
                          alt={`${tech.name} logo`}
                          className="w-full h-full object-contain group-hover/tech:scale-110 transition-transform duration-300"
                          width={36}
                          height={36}
                          sizes="36px"
                          unoptimized
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#1A3840] text-center leading-tight">
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
