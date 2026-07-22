"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe2,
  ShoppingCart,
  LayoutDashboard,
  MonitorSmartphone,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

// --- Data setup with inline features for expansion ---
const TypesData = [
  {
    id: 1,
    icon: <Globe2 className="w-7 h-7" />,
    title: "Corporate & Business",
    description:
      "Professional websites that explain your offer clearly, build trust quickly, and make it easy for visitors to become qualified leads.",
    features: [
      "Custom Brand Integration & Identity",
      "Lead Generation Forms & CRM Sync",
      "Technical SEO Optimized Architecture",
      "Easy-to-use Content Management System (CMS)",
    ],
  },
  {
    id: 2,
    icon: <ShoppingCart className="w-7 h-7" />,
    title: "E-Commerce Experiences",
    description:
      "Online stores built to sell. We focus on lightning-fast product pages, frictionless checkouts, and secure payment integrations.",
    features: [
      "Frictionless 1-Click Checkout Flows",
      "Secure Payment Gateway Integrations",
      "Advanced Inventory & Order Management",
      "High-Conversion Product Pages",
    ],
  },
  {
    id: 3,
    icon: <LayoutDashboard className="w-7 h-7" />,
    title: "SaaS & Web Apps",
    description:
      "Complex ideas turned into simple interfaces. From user dashboards to internal tools, we build software that scales with your user base.",
    features: [
      "Scalable MERN Stack Architecture",
      "Secure User Authentication & Roles",
      "Real-time Data Processing & Analytics",
      "Custom API Development & Integration",
    ],
  },
  {
    id: 4,
    icon: <MonitorSmartphone className="w-7 h-7" />,
    title: "High-Converting Pages",
    description:
      "Running a campaign? We design single-page experiences focused entirely on getting that click, sign-up, or sale.",
    features: [
      "A/B Tested Layouts & Copy Structure",
      "Lightning-fast Load Times (Core Web Vitals)",
      "Strategic Call-To-Action Placement",
      "Analytics & Heatmap Tracking Setup",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function Types() {
  // State to track which card is currently expanded
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-32 relative bg-[#FAFCFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Header Section --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#111A1F] mb-6 tracking-tight">
            What Are You Looking To Build?
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-light">
            Every business is unique. We tailor our engineering to match your
            specific digital goals. Click on any service to see the full
            arsenal.
          </p>
        </motion.div>

        {/* --- Grid Section --- */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start"
        >
          {TypesData.map((type) => {
            const isExpanded = expandedId === type.id;

            return (
              <motion.div
                layout // Automatically animates height changes
                key={type.id}
                variants={fadeUp}
                onClick={() => toggleExpand(type.id)}
                className={`group bg-white p-8 md:p-10 rounded-[2rem] border transition-all duration-500 relative overflow-hidden flex flex-col cursor-pointer ${
                  isExpanded
                    ? "border-[#d96c4e] shadow-[0_20px_40px_rgb(217,108,78,0.15)] ring-2 ring-[#d96c4e]/20"
                    : "border-gray-100 hover:border-[#d96c4e]/30 shadow-sm hover:shadow-[0_20px_40px_rgb(217,108,78,0.08)]"
                }`}
              >
                {/* Background Glow on Hover/Active */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#f4be78]/20 to-transparent transition-opacity duration-500 rounded-bl-[100px] ${isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                ></div>

                <motion.div layout className="relative z-10 flex-grow">
                  {/* Icon Box */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500 shadow-sm ${isExpanded ? "bg-[#d96c4e] text-white" : "bg-gray-50 text-[#295c5e] group-hover:bg-[#d96c4e] group-hover:text-white group-hover:shadow-md"}`}
                  >
                    {type.icon}
                  </div>

                  {/* Text Content */}
                  <motion.h3
                    layout
                    className={`text-2xl font-bold mb-4 transition-colors ${isExpanded ? "text-[#d96c4e]" : "text-[#111A1F] group-hover:text-[#d96c4e]"}`}
                  >
                    {type.title}
                  </motion.h3>

                  <motion.p
                    layout
                    className="text-gray-500 leading-relaxed text-lg font-light mb-2"
                  >
                    {type.description}
                  </motion.p>
                </motion.div>

                {/* --- Expandable Details Section --- */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="relative z-10 overflow-hidden border-t border-gray-100 pt-6"
                    >
                      <h4 className="text-sm font-bold text-[#295c5e] uppercase tracking-widest mb-4">
                        What&apos;s Included:
                      </h4>
                      <ul className="space-y-3">
                        {type.features.map((feature, i) => (
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="flex items-start text-gray-600"
                          >
                            <CheckCircle2 className="w-5 h-5 text-[#f4be78] mr-3 flex-shrink-0 mt-0.5" />
                            <span className="font-medium text-sm md:text-base">
                              {feature}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Interactive Action Text */}
                <motion.div
                  layout
                  className={`relative z-10 flex items-center font-bold text-sm transition-all duration-300 mt-6 pt-4 border-t ${isExpanded ? "text-gray-400 border-gray-100" : "text-[#d96c4e] border-transparent opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:border-gray-50"}`}
                >
                  {isExpanded ? "Close Details" : "View Full Details"}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="ml-2"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
