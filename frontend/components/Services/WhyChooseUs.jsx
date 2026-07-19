"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, CodeXml, Target, Users } from "lucide-react";

// Differentiators Data (Confident & Humanized Copy)
const reasons = [
  {
    id: "performance",
    icon: <Zap className="w-6 h-6 text-[#f4be78]" />,
    title: "Zero Bloatware",
    description:
      "We don't rely on slow, heavy drag-and-drop builders. Every line of code is optimized for raw speed, giving you perfect Core Web Vitals and lightning-fast load times.",
    borderHover: "hover:border-[#f4be78]/50",
    glowColor: "bg-[#f4be78]",
  },
  {
    id: "architecture",
    icon: <CodeXml className="w-6 h-6 text-[#d96c4e]" />,
    title: "Scalable by Design",
    description:
      "Built on robust architectures like the MERN stack and Next.js, our solutions are engineered to handle your business's traffic spikes without breaking a sweat.",
    borderHover: "hover:border-[#d96c4e]/50",
    glowColor: "bg-[#d96c4e]",
  },
  {
    id: "roi",
    icon: <Target className="w-6 h-6 text-[#295c5e]" />,
    title: "Conversion Obsessed",
    description:
      "A pretty website is useless if it doesn't sell. We bake technical SEO and high-converting UX into the core DNA of your project to turn passive traffic into revenue.",
    borderHover: "hover:border-[#295c5e]/50",
    glowColor: "bg-[#295c5e]",
  },
  {
    id: "communication",
    icon: <Users className="w-6 h-6 text-white" />,
    title: "Direct Engineering Access",
    description:
      "No corporate red tape or lost translations through account managers. You talk directly to the hardcore engineers building your product for rapid, accurate execution.",
    borderHover: "hover:border-white/50",
    glowColor: "bg-white",
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
    <section className="py-24 bg-[#081314] font-sans relative overflow-hidden border-t border-white/5">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
        <div className="absolute w-[40rem] h-[40rem] bg-[#295c5e] opacity-[0.08] blur-[150px] rounded-full mix-blend-screen"></div>
        {/* Subtle dot grid for tech vibe */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d96c4e]/10 border border-[#d96c4e]/20 mb-6 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#d96c4e] animate-pulse"></span>
            <span className="text-[#d96c4e] font-bold tracking-widest text-xs uppercase">
              The Kraviona Edge
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
          >
            We Engineer Results, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Not Just Websites.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 font-light leading-relaxed"
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
              className={`group relative p-8 md:p-10 bg-white/[0.02] backdrop-blur-lg border border-white/5 rounded-[2rem] transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04] ${reason.borderHover} overflow-hidden`}
            >
              {/* Top Accent Line that animates on hover */}
              <div
                className={`absolute top-0 left-0 h-1 w-0 group-hover:w-full ${reason.glowColor} transition-all duration-700 ease-in-out`}
              ></div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Icon Box */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  {reason.icon}
                </div>

                {/* Text Content */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                    {reason.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-light text-sm md:text-base group-hover:text-gray-300 transition-colors duration-300">
                    {reason.description}
                  </p>
                </div>
              </div>

              {/* Faint Background Glow on Hover */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 ${reason.glowColor} blur-[100px] transition-opacity duration-500 pointer-events-none`}
              ></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
