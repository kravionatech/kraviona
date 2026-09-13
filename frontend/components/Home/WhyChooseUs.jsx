"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "Clear Development Process",
    description:
      "You get practical milestones, direct communication, and enough structure to know what is happening at each stage.",
  },
  {
    title: "Scalable MERN Architecture",
    description:
      "Applications are planned with clean APIs, maintainable code, and database decisions that do not trap you later.",
  },
  {
    title: "SEO Built Into the Work",
    description:
      "Technical SEO, performance, metadata, and structure are handled during the build, not patched in as an afterthought.",
  },
];

const stats = [
  { value: "5+", label: "Years Experience", color: "text-[#E8622A]" },
  { value: "50+", label: "Projects Delivered", color: "text-[#F28C5E]" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-[#FEFCF9] font-sans relative overflow-hidden">
      {/* Subtle light background texture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-[#EAF3F5]/60 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side: Visuals & Floating Stats */}
          <div className="relative h-full min-h-[550px] w-full lg:order-1 order-2">
            {/* Main Image Base */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-[12px] overflow-hidden bg-[#2D6E7A] z-10 w-[90%] h-[90%] mt-auto shadow-[0_8px_30px_rgba(26,56,64,0.15)] border border-[#E8E4DE]"
            >
              <Image
                src="/images/office/team-collaboration.webp"
                alt="Kraviona product team reviewing a digital product in the office"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-60 mix-blend-luminosity transform hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D6E7A]/60 via-[#2D6E7A]/20 to-transparent"></div>
            </motion.div>

            {/* Decorative Offset Outline Box */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -30 }}
              whileInView={{ opacity: 1, x: 20, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute inset-0 border border-[#2D6E7A]/30 rounded-[12px] z-0 w-[90%] h-[90%]"
            />

            {/* Floating Stat Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="absolute -right-2 md:-right-6 top-16 bg-[#FEFCF9] p-6 rounded-[12px] shadow-brand-md z-20 border border-[#E8E4DE] max-w-[220px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[8px] bg-[#EAF3F5] border border-[#E8E4DE] flex items-center justify-center shrink-0 shadow-inner">
                  <svg
                    className="w-6 h-6 text-[#2D6E7A]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A3840]">
                    {stats[0].value}
                  </p>
                  <p className="text-[10px] font-semibold text-[#5A7A82] uppercase tracking-widest">
                    {stats[0].label}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Stat Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, 15, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -left-4 md:-left-8 bottom-16 bg-[#FEFCF9] p-6 rounded-[12px] shadow-brand-md z-20 border border-[#E8E4DE] max-w-[240px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[8px] bg-[#EAF3F5] border border-[#E8E4DE] flex items-center justify-center shrink-0 shadow-inner">
                  <svg
                    className="w-6 h-6 text-[#C85A3C]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#1A3840]">
                    {stats[1].value}
                  </p>
                  <p className="text-[10px] font-semibold text-[#5A7A82] uppercase tracking-widest">
                    {stats[1].label}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Content */}
          <div className="lg:order-2 order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-[2px] bg-[#2D6E7A]"></span>
                <span className="text-[#2D6E7A] font-semibold tracking-[0.2em] text-xs uppercase">
                  Why Kraviona
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A3840] tracking-tight mb-6 leading-[1.15]">
                We Build Systems That{" "}
                <span className="text-[#2D6E7A]">
                  Keep Working
                </span>
              </h2>

              <p className="text-lg md:text-xl text-[#5A7A82] mb-10 leading-relaxed">
                Kraviona is built for businesses that want more than a pretty
                launch. We combine product thinking, clean engineering, and
                technical SEO so your website or application has a stronger
                foundation from day one.
              </p>
            </motion.div>

            {/* Custom List Features */}
            <div className="space-y-6 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="flex gap-5 group"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-[8px] bg-[#EAF3F5] border border-[#E8E4DE] text-[#2D6E7A] flex items-center justify-center transition-all duration-200 shadow-sm">
                      <svg
                        className="w-5 h-5 text-[#2D6E7A]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1A3840] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-[#5A7A82] text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 pt-4 border-t border-[#E8E4DE]"
            >
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4 bg-[#C85A3C] hover:bg-[#B04D31] text-white rounded-[6px] font-semibold transition-all duration-200 shadow-brand-sm hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                Read Our Story
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-12 h-12 rounded-[8px] bg-[#EAF3F5] flex items-center justify-center border border-[#E8E4DE] text-[#2D6E7A] transition-colors duration-200">
                  <svg
                    className="w-5 h-5 text-[#2D6E7A]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-[#5A7A82] font-semibold uppercase tracking-widest mb-0.5">
                    Call Us Anytime
                  </p>
                  <a
                    href="tel:+919608553167"
                    className="text-[#1A3840] font-bold hover:text-[#2D6E7A] transition-colors text-lg tracking-wide"
                  >
                    +91 96085 53167
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
