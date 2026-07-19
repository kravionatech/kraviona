"use client";
import React from "react";
import { motion } from "framer-motion";
import { HeartHandshake, LayoutDashboard, Cpu, Rocket } from "lucide-react";

const processes = [
  {
    icon: <HeartHandshake />,
    title: "1. Let's Chat",
    desc: "We align with your vision and plan a tailored strategy.",
  },
  {
    icon: <LayoutDashboard />,
    title: "2. Visual Design",
    desc: "Interactive mockups so you see it before we code it.",
  },
  {
    icon: <Cpu />,
    title: "3. Deep Coding",
    desc: "Clean, scalable architecture brought to life.",
  },
  {
    icon: <Rocket />,
    title: "4. Launch",
    desc: "Heavy testing, successful deployment, and ongoing support.",
  },
];

export default function ProcessTimeline() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1b3d3e] mb-6 tracking-tight">
            How We Make It Happen
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto">
            A transparent, structured process. You are part of the journey at
            every single step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[12%] w-[76%] h-[2px] bg-gray-200 z-0 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              viewport={{ once: true }}
              className="h-full bg-gradient-to-r from-[#d96c4e] via-[#f4be78] to-[#295c5e] rounded-full relative"
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#295c5e] rounded-full shadow-[0_0_10px_#295c5e]"></div>
            </motion.div>
          </div>

          {processes.map((process, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 bg-white border-[6px] border-[#fafaf9] shadow-xl text-[#d96c4e] rounded-full flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:shadow-2xl transition-all duration-300">
                {process.icon}
              </div>
              <h4 className="text-xl font-bold text-[#1b3d3e] mb-3">
                {process.title}
              </h4>
              <p className="text-gray-500 leading-relaxed font-light px-2">
                {process.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
