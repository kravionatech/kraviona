"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, CodeXml, Target, Users } from "lucide-react";

// Differentiators Data (Confident & Humanized Copy)
const reasons = [
  {
    id: "performance",
    icon: <Zap className="w-6 h-6 text-[#F28C5E]" />,
    title: "Zero Bloatware",
    description:
      "We don't rely on slow, heavy drag-and-drop builders. Every line of code is optimized for raw speed, giving you perfect Core Web Vitals and lightning-fast load times.",
    borderHover: "hover:border-[#F28C5E]/50",
    glowColor: "bg-[#F28C5E]",
  },
  {
    id: "architecture",
    icon: <CodeXml className="w-6 h-6 text-[#E8622A]" />,
    title: "Scalable by Design",
    description:
      "Built on robust architectures like the MERN stack and Next.js, our solutions are engineered to handle your business's traffic spikes without breaking a sweat.",
    borderHover: "hover:border-[#E8622A]/50",
    glowColor: "bg-[#E8622A]",
  },
  {
    id: "roi",
    icon: <Target className="w-6 h-6 text-[#2A4A52]" />,
    title: "Conversion Obsessed",
    description:
      "A pretty website is useless if it doesn't sell. We bake technical SEO and high-converting UX into the core DNA of your project to turn passive traffic into revenue.",
    borderHover: "hover:border-[#2A4A52]/50",
    glowColor: "bg-[#2A4A52]",
  },
  {
    id: "communication",
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Direct Engineering Access",
    description:
      "No corporate red tape or lost translations through account managers. You talk directly to the hardcore engineers building your product for rapid, accurate execution.",
    borderHover: "hover:border-primary/50",
    glowColor: "bg-primary",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-surface font-sans relative overflow-hidden border-t border-gray-200/80">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
        <div className="absolute w-[40rem] h-[40rem] bg-primary/5 blur-[150px] rounded-full"></div>
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#0f5960 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* --- Header Area --- */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8622A]/10 border border-[#E8622A]/20 mb-6 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#E8622A] animate-pulse"></span>
            <span className="text-[#E8622A] font-bold tracking-widest text-xs uppercase">
              The Kraviona Edge
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark tracking-tight leading-[1.1] mb-6"
          >
            We Engineer Results, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8622A] to-[#F28C5E]">
              Not Just Websites.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-muted leading-relaxed"
          >
            In a market flooded with mediocre templates, we stand out by writing
            clean code and building architectures that actually scale your
            business.
          </motion.p>
        </div>

        {/* --- Bento Grid / Feature Cards --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.id}
              variants={itemVariants}
              className={`group relative p-8 md:p-10 bg-white border border-gray-200 rounded-[2rem] shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-brand-md ${reason.borderHover} overflow-hidden`}
            >
              {/* Top Accent Line that animates on hover */}
              <div
                className={`absolute top-0 left-0 h-1 w-0 group-hover:w-full ${reason.glowColor} transition-all duration-700 ease-in-out`}
              ></div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Icon Box */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-surface flex items-center justify-center border border-gray-200 group-hover:scale-110 transition-transform duration-500">
                  {reason.icon}
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-3 tracking-wide">
                    {reason.title}
                  </h3>
                  <p className="text-brand-muted leading-relaxed text-sm md:text-base transition-colors duration-300">
                    {reason.description}
                  </p>
                </div>
              </div>

              {/* Faint Background Glow on Hover */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-5 ${reason.glowColor} blur-[100px] transition-opacity duration-500 pointer-events-none`}
              ></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
