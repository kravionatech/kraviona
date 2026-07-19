"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    title: "Agile Development Process",
    description:
      "We iterate quickly and adapt to your changing business needs seamlessly.",
  },
  {
    title: "Scalable MERN Architecture",
    description:
      "Future-proof applications engineered to handle massive growth and high traffic.",
  },
  {
    title: "Data-Driven Marketing",
    description:
      "ROI-focused SEO and digital marketing strategies that consistently convert.",
  },
];

const stats = [
  { value: "99%", label: "Client Retention", color: "text-[#d96c4e]" },
  { value: "150+", label: "Projects Delivered", color: "text-[#f4be78]" },
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-[#1b3d3e] to-[#0f2425] font-sans relative overflow-hidden">
      {/* Cinematic Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-[#295c5e]/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[0%] w-[400px] h-[400px] bg-[#d96c4e]/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Side: Visuals & Floating Glassmorphic Stats */}
          <div className="relative h-full min-h-[550px] w-full lg:order-1 order-2">
            {/* Main Image Base with Premium Overlay */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-[2rem] overflow-hidden bg-[#0f2425] z-10 w-[90%] h-[90%] mt-auto shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/5"
            >
              <Image
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                alt="Kraviona Tech Team Working"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-50 mix-blend-luminosity transform hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2425] via-[#0f2425]/40 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#295c5e]/20 to-transparent mix-blend-overlay"></div>
            </motion.div>

            {/* Decorative Offset Outline Box */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: -30 }}
              whileInView={{ opacity: 1, x: 20, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="absolute inset-0 border border-[#d96c4e]/50 rounded-[2rem] z-0 w-[90%] h-[90%]"
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
              className="absolute -right-2 md:-right-6 top-16 bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.2)] z-20 border border-white/10 max-w-[220px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#d96c4e]/20 border border-[#d96c4e]/30 flex items-center justify-center shrink-0 shadow-inner">
                  <svg
                    className="w-6 h-6 text-[#d96c4e]"
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
                  <p className="text-2xl font-black text-white">
                    {stats[0].value}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
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
              className="absolute -left-4 md:-left-8 bottom-16 bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl shadow-[0_20px_40px_rgb(0,0,0,0.2)] z-20 border border-white/10 max-w-[240px]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#295c5e]/40 border border-[#295c5e]/50 flex items-center justify-center shrink-0 shadow-inner">
                  <svg
                    className="w-6 h-6 text-[#f4be78]"
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
                  <p className="text-2xl font-black text-white">
                    {stats[1].value}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
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
                <span className="w-10 h-[2px] bg-gradient-to-r from-transparent to-[#f4be78]"></span>
                <span className="text-[#f4be78] font-bold tracking-[0.2em] text-xs uppercase drop-shadow-sm">
                  Why Kraviona
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.15]">
                We Build Solutions That{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e] drop-shadow-md">
                  Drive Growth
                </span>
              </h2>

              <p className="text-lg md:text-xl text-gray-400 font-light mb-10 leading-relaxed">
                At Kraviona, we don’t just write code; we engineer success.
                Whether you need a robust web application or a marketing
                strategy that outranks competitors, our expert team delivers
                excellence from concept to deployment.
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
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#d96c4e] group-hover:border-[#d96c4e] transition-all duration-300 shadow-sm">
                      <svg
                        className="w-5 h-5 text-[#f4be78] group-hover:text-white transition-colors duration-300"
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
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#f4be78] transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed">
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
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 pt-4 border-t border-white/10"
            >
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4 bg-[#d96c4e] text-white rounded-xl font-bold hover:bg-[#c25e41] transition-all duration-300 shadow-[0_4px_20px_rgb(217,108,78,0.3)] hover:shadow-[0_8px_25px_rgb(217,108,78,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                Discover Our Story
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
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
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#f4be78] transition-colors duration-300">
                  <svg
                    className="w-5 h-5 text-[#f4be78]"
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
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">
                    Call Us Anytime
                  </p>
                  <a
                    href="tel:+919608553167"
                    className="text-white font-bold hover:text-[#d96c4e] transition-colors text-lg tracking-wide"
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
